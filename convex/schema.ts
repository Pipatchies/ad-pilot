import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  briefs: defineTable({
    periodFrom: v.string(),
    periodTo: v.string(),
    target: v.string(),
    territory: v.string(),
    cities: v.string(),
    budget: v.string(),
    objectives: v.array(v.string()),
    mediaTypes: v.array(v.string()),
    tvTypes: v.optional(v.array(v.string())),
    displayTypes: v.optional(v.string()),
    radioTypes: v.optional(v.array(v.string())),
    brief: v.string(),
  }),
  users: defineTable({
    email: v.string(),
    password: v.string(),
    prénom: v.string(),
    nom: v.string(),
    role: v.string(),
  }),
});

