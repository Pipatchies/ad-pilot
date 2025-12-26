import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "archive-expired-campaigns",
  { hourUTC: 1, minuteUTC: 0 }, // Run at 1 AM UTC
  internal.mutations.campaigns.autoArchiveCampaigns
);

export default crons;
