import { Id } from "../../convex/_generated/dataModel";

export type Invoice = {
  _id?: Id<"invoices">;
  title: string;
  invoiceType?: "agency" | "vendor";
  agencyInvoice?: string;
  vendorName?: string;
  htprice: number;
  ttcprice: number;
  startDate: string;
  dueDate: string;
  url?: string;
  publicId?: string;
  resourceType?: "raw";
  organizationId?: Id<"organizations">;
  campaignId?: Id<"campaigns">;
  campaign?: string;
  organizationName?: string;
};
