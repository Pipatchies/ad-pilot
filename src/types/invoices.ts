export type Invoice = {
  title: string;
  description: string;
  invoiceType: "agency" | "vendor";
  agencyInvoice?: string;
  vendorName?: string;
  htprice: number;
  ttcprice: number;
  startDate: string;
  dueDate: string;
  url: string;
  publicId: string;
  resourceType: "raw";
};