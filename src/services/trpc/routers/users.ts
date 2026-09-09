import { headers } from "next/headers";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { auth } from "@/services/auth/auth";
import { db } from "@/services/db/index";
import {
  plotRepresentatives,
  plots,
  profiles,
  user,
} from "@/services/db/schema";
import { adminProcedure, createTRPCRouter } from "@/services/trpc/init";
import { ensurePlot, insertActivity, type Db } from "@/services/trpc/lib/helpers";
import type { Profile, UserRole } from "@/lib/types";

const ROLE = z.enum(["admin", "operator", "viewer"]);
const SLUG_RE = /^([a-z])-([A-H][A-F][1-4])$/i;

// Resolve "a-AA1, b-CB2" → plot ids, creating plot rows on demand (sparse model).
async function resolvePlotRefs(tx: Db, raw: string): Promise<string[]> {
  const slugs = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const ids: string[] = [];
  for (const slug of slugs) {
    const m = SLUG_RE.exec(slug);
    if (!m) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `"${slug}" is not a valid plot (use garden-ref, e.g. a-AA1).`,
      });
    }
    const id = await ensurePlot(tx, m[1], m[2].toUpperCase());
    ids.push(id);
  }
  return [...new Set(ids)];
}

export const usersRouter = createTRPCRouter({
  list: adminProcedure.query(async ({ ctx }) => {
    const [members, mappings] = await Promise.all([
      db
        .select({
          id: profiles.id,
          email: profiles.email,
          full_name: profiles.full_name,
          role: profiles.role,
          created_at: profiles.created_at,
        })
        .from(profiles)
        .orderBy(asc(profiles.created_at)),
      db
        .select({
          profile_id: plotRepresentatives.profile_id,
          garden_id: plots.garden_id,
          ref: plots.ref,
        })
        .from(plotRepresentatives)
        .innerJoin(plots, eq(plots.id, plotRepresentatives.plot_id)),
    ]);

    const plotsByMember: Record<string, string> = {};
    for (const m of mappings) {
      const slug = `${m.garden_id}-${m.ref}`;
      plotsByMember[m.profile_id] = plotsByMember[m.profile_id]
        ? `${plotsByMember[m.profile_id]}, ${slug}`
        : slug;
    }

    return {
      members: members as Profile[],
      plotsByMember,
      currentUserId: ctx.profile.id,
    };
  }),

  create: adminProcedure
    .input(
      z.object({
        email: z.string().trim().email(),
        password: z.string().min(8, "Password must be at least 8 characters."),
        full_name: z.string().trim().min(1, "Name is required."),
        role: ROLE,
        plot_refs: z.string().default(""),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Create the auth user (admin plugin authorizes via the caller's session).
      let userId: string;
      try {
        const created = await auth.api.createUser({
          headers: await headers(),
          body: {
            email: input.email,
            password: input.password,
            name: input.full_name,
          },
        });
        userId = created.user.id;
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: e instanceof Error ? e.message : "Could not create user.",
        });
      }

      await db.transaction(async (tx) => {
        // Guarantee the profile exists with the requested role (does not rely
        // on the create hook), and mirror role into user.role for admin authz.
        await tx
          .insert(profiles)
          .values({
            id: userId,
            email: input.email,
            full_name: input.full_name,
            role: input.role,
          })
          .onConflictDoUpdate({
            target: profiles.id,
            set: { role: input.role, full_name: input.full_name },
          });
        await tx.update(user).set({ role: input.role }).where(eq(user.id, userId));

        if (input.role === "viewer" && input.plot_refs.trim()) {
          const ids = await resolvePlotRefs(tx, input.plot_refs);
          if (ids.length > 0) {
            await tx
              .insert(plotRepresentatives)
              .values(ids.map((plot_id) => ({ profile_id: userId, plot_id })))
              .onConflictDoNothing();
          }
        }

        await insertActivity(tx, {
          actorName: ctx.profile.full_name,
          action: "created user",
          entity: "user",
        });
      });

      return { ok: true };
    }),

  update: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: ROLE,
        plot_refs: z.string().default(""),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.profile.id === input.userId && input.role !== "admin") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot demote your own account.",
        });
      }

      await db.transaction(async (tx) => {
        await tx
          .update(profiles)
          .set({ role: input.role })
          .where(eq(profiles.id, input.userId));
        await tx
          .update(user)
          .set({ role: input.role })
          .where(eq(user.id, input.userId));

        // Replace plot mappings wholesale with what the form submitted.
        await tx
          .delete(plotRepresentatives)
          .where(eq(plotRepresentatives.profile_id, input.userId));

        if (input.role === "viewer" && input.plot_refs.trim()) {
          const ids = await resolvePlotRefs(tx, input.plot_refs);
          if (ids.length > 0) {
            await tx
              .insert(plotRepresentatives)
              .values(
                ids.map((plot_id) => ({ profile_id: input.userId, plot_id }))
              )
              .onConflictDoNothing();
          }
        }

        await insertActivity(tx, {
          actorName: ctx.profile.full_name,
          action: "updated user",
          entity: "user",
        });
      });

      return { ok: true };
    }),

  remove: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.profile.id === input.userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot remove your own account.",
        });
      }
      // Cascades to profiles, plot_representatives, sessions, accounts.
      await db.delete(user).where(eq(user.id, input.userId));
      await insertActivity(db, {
        actorName: ctx.profile.full_name,
        action: "removed user",
        entity: "user",
      });
      return { ok: true };
    }),
});
