import {
  ManifestAppDirectorySchema,
  ManifestAppHomeMessagesTabSchema,
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
} from "./manifest_schema.ts";
import { OAuth2Provider } from "../providers/oauth2/mod.ts";
import { ICustomType } from "../types/types.ts";
import { CamelCasedPropertiesDeep } from "./types_util.ts";
import { ICustomEvent } from "../events/types.ts";

/** Manifest definition.
 *
 * SlackManifestType contains affordances for better user experience (e.g runOnSlack property)
 * The lower level ManifestSchema aligns with Slack API
 *
 * A discriminated union where the discriminant property runOnSlack
 * maps to function_runtime in the underlying ManifestSchema.
 */
export type SlackManifestType =
  | ISlackManifestRunOnSlack
  | ISlackManifestRemote;

/** Slack-hosted app manifest
 *
 * When runOnSlack = true
 * Corresponds to function_runtime = slack in ManifestSchema.
 */
export interface ISlackManifestRunOnSlack extends ISlackManifestShared {
  runOnSlack?: true; // maps to function_runtime = "slack" in ManifestSchema, optional since the apps are slack hosted by default
  features?: ISlackManifestRunOnSlackFeaturesSchema;
  externalAuthProviders?: (OAuth2Provider /*|OAuth1Provider*/)[];
}

/** Non-Slack hosted app manifest
 *
 * When runOnSlack = false.
 * Corresponds to function_runtime = remote in ManifestSchema.
 */
export interface ISlackManifestRemote extends ISlackManifestShared {
  runOnSlack: false; // maps to function_runtime = "remote" in ManifestSchema

  settings?: Omit<
    ManifestSettingsSchema,
    | "event_subscriptions"
    | "socket_mode_enabled"
    | "token_rotation_enabled"
    | "function_runtime"
  >; // lifting omitted properties to top level
  eventSubscriptions?: ManifestEventSubscriptionsSchema;
  socketModeEnabled?: boolean;
  tokenRotationEnabled?: boolean;
  appDirectory?: ManifestAppDirectorySchema;
  redirectUrls?: Array<string>;
  features?: ISlackManifestRemoteFeaturesSchema;
}

/* Shared app manifest properties */
interface ISlackManifestShared {
  backgroundColor?: string;
  botScopes: Array<string>;
  datastores?: ManifestDatastore[];
  description: string;
  displayName?: string;
  events?: ICustomEvent[];
  functions?: ManifestFunction[];
  icon: string;
  longDescription?: string;
  name: string;
  outgoingDomains?: Array<string>;
  types?: ICustomType[];
  userScopes?: Array<string>;
  workflows?: ManifestWorkflow[];
}

interface ISlackManifestRunOnSlackFeaturesSchema {
  // currently home_tab_enabled is not supported for RunOnSlack apps
  appHome?: CamelCasedPropertiesDeep<ManifestAppHomeMessagesTabSchema>;
}
interface ISlackManifestRemoteFeaturesSchema {
  appHome?: CamelCasedPropertiesDeep<ManifestAppHomeSchema>;
  botUser?: Omit<ManifestBotUserSchema, "display_name">;
  shortcuts?: ManifestShortcutsSchema;
  slashCommands?: ManifestSlashCommandsSchema;
  unfurlDomains?: ManifestUnfurlDomainsSchema;
  workflowSteps?: ManifestWorkflowStepsSchemaLegacy;
}
