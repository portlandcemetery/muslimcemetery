import "./load-env";

import { db } from "@/services/db/index";
import { gardens, organizationSettings } from "@/services/db/schema";

// Edit these to match the cemetery's real gardens. Plots are NOT seeded — a plot
// row is created lazily the first time a plot is edited (sparse model).
const GARDENS = [
  { id: "a", name: "Garden A", arabic_name: "", sort_order: 1 },
  { id: "b", name: "Garden B", arabic_name: "", sort_order: 2 },
  { id: "c", name: "Garden C", arabic_name: "", sort_order: 3 },
  { id: "d", name: "Garden D", arabic_name: "", sort_order: 4 },
];

async function main() {
  const existing = await db.select({ id: gardens.id }).from(gardens);
  if (existing.length > 0) {
    console.log(
      `Gardens already seeded (${existing.length}). Skipping gardens.`,
    );
  } else {
    await db.insert(gardens).values(GARDENS);
    console.log(`Seeded ${GARDENS.length} gardens.`);
  }

  await db
    .insert(organizationSettings)
    .values({
      id: 1,
      org_name: "Islamic Center of Portland",
      cemetery_name: "Memorial Gardens",
      contact_email: "",
      phone: "",
    })
    .onConflictDoNothing();
  console.log("Ensured organization_settings singleton.");

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
