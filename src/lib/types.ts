export type UserRole = "admin" | "operator" | "viewer";

export type PlotStatus =
  | "available"
  | "full"
  | "partial"
  | "unpaid"
  | "buried"
  | "unavailable";

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
};

export type Garden = {
  id: string;
  name: string;
  arabic_name: string;
  sort_order: number;
};

export type PlotRow = {
  id: string;
  garden_id: string;
  col_letter: string;
  row_letter: string;
  position: number;
  ref: string;
  status: PlotStatus;
  price: number;
  deceased_name: string | null;
  date_of_birth: string | null;
  date_of_death: string | null;
  burial_date: string | null;
  id_tag_number: string | null;
  case_number: string | null;
  county_of_death: string | null;
  reservation_holder: string | null;
  purchaser_name: string | null;
  purchaser_phone: string | null;
  purchaser_email: string | null;
  purchaser_address: string | null;
  notes: string | null;
  general_note: string | null;
  updated_at: string;
};

export type MapPlot = {
  id: string;
  garden_id: string;
  col_letter: string;
  row_letter: string;
  position: number;
  ref: string;
  status: PlotStatus;
  deceased_name: string | null;
};

export type Payment = {
  id: string;
  plot_id: string;
  amount: number;
  paid_at: string;
  method: string | null;
  received_by: string | null;
  reference_no: string | null;
  note: string | null;
  source: "manual" | "online";
  created_at: string;
};

export type PaymentSummary = {
  plot_id: string;
  price: number;
  total_paid: number;
  outstanding: number;
};

export type PlotDocument = {
  id: string;
  plot_id: string;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

export type ActivityEntry = {
  id: number;
  actor_name: string | null;
  action: string;
  entity: string;
  plot_ref: string | null;
  created_at: string;
};

export const isStaff = (role: UserRole | null | undefined) =>
  role === "admin" || role === "operator";
