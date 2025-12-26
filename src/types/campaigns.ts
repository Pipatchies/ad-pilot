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
  status?: "current" | "archived";
  document?: string;
  kpi?: {
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
  diffusions?: {
    mediaType: MediaType;
    startDate: string;
    endDate: string;
  }[];
  digitalReportUrl?: string;
  report?: CampaignReport;
  archived: boolean;
  organizationId: Id<"organizations">;
  organizationName?: string;
  _id: Id<"campaigns">;
  _creationTime: number;
};
