/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ResendOTPPasswordReset from "../ResendOTPPasswordReset.js";
import type * as actions_cloudinary from "../actions/cloudinary.js";
import type * as actions_sendEmail from "../actions/sendEmail.js";
import type * as actions_users from "../actions/users.js";
import type * as auth from "../auth.js";
import type * as crons from "../crons.js";
import type * as error from "../error.js";
import type * as http from "../http.js";
import type * as mutations_briefs from "../mutations/briefs.js";
import type * as mutations_campaigns from "../mutations/campaigns.js";
import type * as mutations_documents from "../mutations/documents.js";
import type * as mutations_invoices from "../mutations/invoices.js";
import type * as mutations_medias from "../mutations/medias.js";
import type * as mutations_organizations from "../mutations/organizations.js";
import type * as mutations_quotes from "../mutations/quotes.js";
import type * as mutations_users from "../mutations/users.js";
import type * as queries_briefs from "../queries/briefs.js";
import type * as queries_campaigns from "../queries/campaigns.js";
import type * as queries_documents from "../queries/documents.js";
import type * as queries_invoices from "../queries/invoices.js";
import type * as queries_medias from "../queries/medias.js";
import type * as queries_organizations from "../queries/organizations.js";
import type * as queries_roles from "../queries/roles.js";
import type * as queries_users from "../queries/users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ResendOTPPasswordReset: typeof ResendOTPPasswordReset;
  "actions/cloudinary": typeof actions_cloudinary;
  "actions/sendEmail": typeof actions_sendEmail;
  "actions/users": typeof actions_users;
  auth: typeof auth;
  crons: typeof crons;
  error: typeof error;
  http: typeof http;
  "mutations/briefs": typeof mutations_briefs;
  "mutations/campaigns": typeof mutations_campaigns;
  "mutations/documents": typeof mutations_documents;
  "mutations/invoices": typeof mutations_invoices;
  "mutations/medias": typeof mutations_medias;
  "mutations/organizations": typeof mutations_organizations;
  "mutations/quotes": typeof mutations_quotes;
  "mutations/users": typeof mutations_users;
  "queries/briefs": typeof queries_briefs;
  "queries/campaigns": typeof queries_campaigns;
  "queries/documents": typeof queries_documents;
  "queries/invoices": typeof queries_invoices;
  "queries/medias": typeof queries_medias;
  "queries/organizations": typeof queries_organizations;
  "queries/roles": typeof queries_roles;
  "queries/users": typeof queries_users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
