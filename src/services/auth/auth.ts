import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import { db } from "@/services/db/index";
import {
  account,
  profiles,
  session,
  user,
  verification,
} from "@/services/db/schema";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const auth = betterAuth({
  baseURL: APP_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, account, session, verification },
  }),
  trustedOrigins: [APP_URL],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // No password-reset flow (removed per product decision).
  },
  databaseHooks: {
    user: {
      create: {
        // Mirror every auth user into a `profiles` row — the app's
        // authorization + FK source of truth (replaces the old Supabase trigger).
        after: async (createdUser) => {
          const role =
            (createdUser as { role?: string }).role === "admin"
              ? "admin"
              : (createdUser as { role?: string }).role === "operator"
                ? "operator"
                : "viewer";
          await db
            .insert(profiles)
            .values({
              id: createdUser.id,
              email: createdUser.email,
              full_name: createdUser.name ?? "",
              role,
            })
            .onConflictDoNothing();
        },
      },
    },
  },
  plugins: [admin(), nextCookies()],
});

// Helper: keep user.role (admin-plugin authorization) and profiles.role (app
// authorization) in sync for a given user.
export async function syncUserRole(
  userId: string,
  role: "admin" | "operator" | "viewer"
) {
  await db.update(user).set({ role }).where(eq(user.id, userId));
  await db.update(profiles).set({ role }).where(eq(profiles.id, userId));
}
