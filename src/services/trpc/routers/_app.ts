import { createTRPCRouter } from "@/services/trpc/init";
import { authRouter } from "./auth";
import { dashboardRouter } from "./dashboard";
import { documentsRouter } from "./documents";
import { gardensRouter } from "./gardens";
import { organizationRouter } from "./organization";
import { paymentsRouter } from "./payments";
import { plotsRouter } from "./plots";
import { reportsRouter } from "./reports";
import { usersRouter } from "./users";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  dashboard: dashboardRouter,
  documents: documentsRouter,
  gardens: gardensRouter,
  organization: organizationRouter,
  payments: paymentsRouter,
  plots: plotsRouter,
  reports: reportsRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
