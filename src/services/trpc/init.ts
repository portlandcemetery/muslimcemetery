import { cache } from "react";
import { headers } from "next/headers";
import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { auth } from "@/services/auth/auth";
import { db } from "@/services/db/index";
import { profiles } from "@/services/db/schema";
import type { Profile } from "@/lib/types";

export const createTRPCContext = cache(async () => {
  return {};
});

const t = initTRPC.create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const createMiddleware = t.middleware;
export const baseProcedure = t.procedure;

// Authenticated + profile-loaded. `profile` is the app's authorization source.
export const protectedProcedure = baseProcedure.use(async ({ next, ctx }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be signed in.",
    });
  }

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);

  if (!profile) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "No profile found for this account.",
    });
  }

  return next({ ctx: { ...ctx, session, profile: profile as Profile } });
});

export const staffProcedure = protectedProcedure.use(async ({ next, ctx }) => {
  if (ctx.profile.role !== "admin" && ctx.profile.role !== "operator") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Staff access required." });
  }
  return next({ ctx });
});

export const adminProcedure = protectedProcedure.use(async ({ next, ctx }) => {
  if (ctx.profile.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required." });
  }
  return next({ ctx });
});
