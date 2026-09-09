import "./load-env";

import { auth, syncUserRole } from "@/services/auth/auth";

// Usage: npm run create:admin -- <email> <password> "<Full Name>"
// or set ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME in .env.local
async function main() {
  const email = process.argv[2] || process.env.ADMIN_EMAIL;
  const password = process.argv[3] || process.env.ADMIN_PASSWORD;
  const name = process.argv[4] || process.env.ADMIN_NAME || "Administrator";

  if (!email || !password) {
    console.error(
      'Usage: npm run create:admin -- <email> <password> "<Full Name>"'
    );
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const result = await auth.api.signUpEmail({
    body: { email, password, name },
  });
  const userId = result.user.id;

  // Promote to admin (both user.role for admin-plugin authz and profiles.role).
  await syncUserRole(userId, "admin");

  console.log(`Created admin: ${email} (${userId})`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
