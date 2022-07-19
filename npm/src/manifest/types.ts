import {
  ManifestAppDirectorySchema,
  ManifestAppHomeSchema,
  ManifestBotUserSchema,
  ManifestDatastore,
  ManifestEventSubscriptionsSchema,
  ManifestFunction,
  ManifestSettingsSchema,
  ManifestShortcutsSchema,
  ManifestSlashCommandsSchema,
  ManifestUnfurlDomainsSchema,
  ManifestWorkflow,
  ManifestWorkflowStepsSchemaLegacy,
} from "./manifest_schema.js";

import { ICustomType } from "../types/types.js";

/** User-facing manifest definition.
 *
 * SlackManifestType contains affordances for better user experience (e.g runOnSlack property)
 * The lower level ManifestSchema aligns with Slack API
 *
 * A discriminated union where the discriminant property runOnSlack
 * maps to function_runtime in the underlying ManifestSchema.
 */
export type SlackManifestType =
  | ISlackManifestHosted
  | ISlackManifestRemote;

/** Slack-hosted app manifest
 *
 * When runOnSlack = true
 * Corresponds to function_runtime = slack in ManifestSchema.
 */
export interface ISlackManifestHosted extends ISlackManifestShared {
  runOnSlack?: true; // maps to function_runtime = "slack" in ManifestSchema, optional since the apps are slack hosted by default
  outgoingDomains?: Array<string>;
  features?: ISlackManifestHostedFeaturesSchema;
}

/** Non-Slack hosted app manifest
 *
 * When runOnSlack = false.
 * Corresponds to function_runtime = slack in ManifestSchema.
 */
export interface ISlackManifestRemote extends ISlackManifestShared {
  runOnSlack: false; // maps to function_runtime = "remote" in ManifestSchema

  settings?: Omit<
    ManifestSettingsSchema,
    | "function_runtime"
    | "event_subscriptions"
    | "socket_mode_enabled"
    | "token_rotation_enabled"
  >; // lifting omitted properties to top level
  eventSubscriptions?: ManifestEventSubscriptionsSchema;
  socketModeEnabled?: boolean;
  tokenRotationEnabled?: boolean;
  appDirectory?: ManifestAppDirectorySchema;
  userScopes?: Array<string>;
  redirectUrls?: Array<string>;
  tokenManagementEnabled?: boolean;
  features?: ISlackManifestRemoteFeaturesSchema;
}

/* Shared app manifest properties */
interface ISlackManifestShared {
  name: string;
  backgroundColor?: string;
  description: string;
  displayName?: string;
  icon: string;
  longDescription?: string;
  botScopes: Array<string>;
  functions?: ManifestFunction[];
  workflows?: ManifestWorkflow[];
  outgoingDomains?: Array<string>;
  types?: ICustomType[];
  datastores?: ManifestDatastore[];
}

interface ISlackManifestHostedFeaturesSchema {
  appHome?: ManifestAppHomeSchema;
}

interface ISlackManifestRemoteFeaturesSchema {
  appHome?: ManifestAppHomeSchema;
  botUser?: Omit<ManifestBotUserSchema, "display_name">;
  shortcuts?: ManifestShortcutsSchema;
  slashCommands?: ManifestSlashCommandsSchema;
  unfurlDomains?: ManifestUnfurlDomainsSchema;
  workflowSteps?: ManifestWorkflowStepsSchemaLegacy;
}
