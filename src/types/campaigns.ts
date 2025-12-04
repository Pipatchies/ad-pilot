import { Id } from "../../convex/_generated/dataModel";
import { MediaType } from "./medias";

export type CampaignStatus = {
  id: number;
  label: string;
  state: "completed" | "current" | "upcoming";
  deadline: string;
};

export type CampaignBudgetLine = {
  type: MediaType;
  amount: number;
  pourcent: number | string;
  periodFrom?: string;
  startDate?: string;
  periodTo?: string;
  title?: string;
  details?: string;
};

export type CampaignReport = {
  status: "completed" | "archived";
  document?: string;
  kpi: {
    icon: string;
    title: string;
    info: string;
  }[];
};

export type Campaign = {
  title: string;
  subtitle: string;
  mediaTypes: MediaType[];
  startDate: string;
  endDate: string;
  totalBudget: number;
  budgetMedia: CampaignBudgetLine[];
  status: CampaignStatus[];
  digitalReportUrl?: string;
  report?: CampaignReport;
  archived: boolean;
  organizationId: Id<"organizations">;
  _id: Id<"campaigns">;
  _creationTime: number;
};
