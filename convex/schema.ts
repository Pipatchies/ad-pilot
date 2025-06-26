import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  briefs: defineTable({
    periodeFrom: v.string(),
    periodeTo: v.string(),
    cible: v.string(),
    territoire: v.string(),
    villes: v.string(),
    budget: v.string(),
    objectifs: v.array(v.string()),
    mediaType: v.array(v.string()),
    diffusionTV: v.optional(v.array(v.string())),
    typeAffichage: v.optional(v.string()),
    diffusionRadio: v.optional(v.array(v.string())),
    brief: v.string(),
  }),
});
