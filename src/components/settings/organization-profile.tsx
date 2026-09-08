import { getOrganizationSettings } from "@/lib/data/organization";
import { OrganizationProfileForm } from "./organization-profile-form";

export async function OrganizationProfile() {
  const settings = await getOrganizationSettings();
  return <OrganizationProfileForm settings={settings} />;
}
