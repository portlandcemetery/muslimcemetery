import { sql } from "drizzle-orm";
import {
  bigserial,
  boolean,
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

// ── Enums ────────────────────────────────────────────────────────────────────

export const userRole = pgEnum("user_role", ["admin", "operator", "viewer"]);
export const plotStatus = pgEnum("plot_status", [
  "available",
  "full",
  "partial",
  "unpaid",
  "buried",
  "unavailable",
]);

// ── Better Auth tables (camelCase keys — the drizzle adapter maps by field name) ──

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
  // admin() plugin fields
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

// ── App tables (snake_case keys to mirror src/lib/types.ts) ───────────────────

export const profiles = pgTable("profiles", {
  id: text("id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  full_name: text("full_name").notNull().default(""),
  role: userRole("role").notNull().default("viewer"),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const gardens = pgTable("gardens", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  arabic_name: text("arabic_name").notNull().default(""),
  sort_order: integer("sort_order").notNull().default(0),
});

export const plots = pgTable(
  "plots",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    garden_id: text("garden_id")
      .notNull()
      .references(() => gardens.id, { onDelete: "cascade" }),
    col_letter: text("col_letter").notNull(),
    row_letter: text("row_letter").notNull(),
    position: integer("position").notNull(),
    ref: text("ref").notNull(),
    status: plotStatus("status").notNull().default("available"),
    price: numeric("price").notNull().default("0"),
    deceased_name: text("deceased_name"),
    date_of_birth: date("date_of_birth"),
    date_of_death: date("date_of_death"),
    burial_date: date("burial_date"),
    id_tag_number: text("id_tag_number"),
    case_number: text("case_number"),
    county_of_death: text("county_of_death"),
    reservation_holder: text("reservation_holder"),
    purchaser_name: text("purchaser_name"),
    purchaser_phone: text("purchaser_phone"),
    purchaser_email: text("purchaser_email"),
    purchaser_address: text("purchaser_address"),
    notes: text("notes"),
    general_note: text("general_note"),
    updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (t) => [unique("plots_garden_ref_uq").on(t.garden_id, t.ref)]
);

export const payments = pgTable("payments", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  plot_id: uuid("plot_id")
    .notNull()
    .references(() => plots.id, { onDelete: "cascade" }),
  amount: numeric("amount").notNull(),
  paid_at: date("paid_at").notNull(),
  method: text("method"),
  received_by: text("received_by"),
  reference_no: text("reference_no"),
  note: text("note"),
  source: text("source", { enum: ["manual", "online"] })
    .notNull()
    .default("manual"),
  created_by: text("created_by").references(() => profiles.id, {
    onDelete: "set null",
  }),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const documents = pgTable("documents", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  plot_id: uuid("plot_id")
    .notNull()
    .references(() => plots.id, { onDelete: "cascade" }),
  storage_path: text("storage_path").notNull(),
  file_name: text("file_name").notNull(),
  mime_type: text("mime_type"),
  size_bytes: integer("size_bytes"),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const plotRepresentatives = pgTable(
  "plot_representatives",
  {
    profile_id: text("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    plot_id: uuid("plot_id")
      .notNull()
      .references(() => plots.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.profile_id, t.plot_id] })]
);

export const organizationSettings = pgTable("organization_settings", {
  id: integer("id").primaryKey().default(1),
  org_name: text("org_name").notNull().default(""),
  cemetery_name: text("cemetery_name").notNull().default(""),
  contact_email: text("contact_email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const activityLog = pgTable("activity_log", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  actor_name: text("actor_name"),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  plot_ref: text("plot_ref"),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const reportExports = pgTable("report_exports", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  report_type: text("report_type").notNull(),
  file_name: text("file_name").notNull(),
  size_bytes: integer("size_bytes"),
  exported_by: text("exported_by").references(() => profiles.id, {
    onDelete: "set null",
  }),
  exported_by_name: text("exported_by_name"),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});
