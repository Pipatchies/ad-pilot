/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as actions_sendEmail from "../actions/sendEmail.js";
import type * as actions_users from "../actions/users.js";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as mutations_briefs from "../mutations/briefs.js";
import type * as mutations_users from "../mutations/users.js";
import type * as queries_campaigns from "../queries/campaigns.js";
import type * as queries_invoices from "../queries/invoices.js";
import type * as queries_medias from "../queries/medias.js";
import type * as queries_roles from "../queries/roles.js";
import type * as queries_users from "../queries/users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "actions/sendEmail": typeof actions_sendEmail;
  "actions/users": typeof actions_users;
  auth: typeof auth;
  http: typeof http;
  "mutations/briefs": typeof mutations_briefs;
  "mutations/users": typeof mutations_users;
  "queries/campaigns": typeof queries_campaigns;
  "queries/invoices": typeof queries_invoices;
  "queries/medias": typeof queries_medias;
  "queries/roles": typeof queries_roles;
  "queries/users": typeof queries_users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
