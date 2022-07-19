import { ManifestAppDirectorySchema, ManifestAppHomeSchema, ManifestBotUserSchema, ManifestDatastore, ManifestEventSubscriptionsSchema, ManifestFunction, ManifestSettingsSchema, ManifestShortcutsSchema, ManifestSlashCommandsSchema, ManifestUnfurlDomainsSchema, ManifestWorkflow, ManifestWorkflowStepsSchemaLegacy } from "./manifest_schema.js";
import { OAuth2Provider } from "../providers/oauth2/mod.js";
import { ICustomType } from "../types/types.js";
/** Manifest definition.
 *
 * SlackManifestType contains affordances for better user experience (e.g runOnSlack property)
 * The lower level ManifestSchema aligns with Slack API
 *
 * A discriminated union where the discriminant property runOnSlack
 * maps to function_runtime in the underlying ManifestSchema.
 */
export declare type SlackManifestType = ISlackManifestRunOnSlack | ISlackManifestRemote;
/** Slack-hosted app manifest
 *
 * When runOnSlack = true
 * Corresponds to function_runtime = slack in ManifestSchema.
 */
export interface ISlackManifestRunOnSlack extends ISlackManifestShared {
    runOnSlack?: true;
    outgoingDomains?: Array<string>;
    features?: ISlackManifestRunOnSlackFeaturesSchema;
}
/** Non-Slack hosted app manifest
 *
 * When runOnSlack = false.
 * Corresponds to function_runtime = remote in ManifestSchema.
 */
export interface ISlackManifestRemote extends ISlackManifestShared {
    runOnSlack: false;
    settings?: Omit<ManifestSettingsSchema, "function_runtime" | "event_subscriptions" | "socket_mode_enabled" | "token_rotation_enabled">;
    eventSubscriptions?: ManifestEventSubscriptionsSchema;
    socketModeEnabled?: boolean;
    tokenRotationEnabled?: boolean;
    appDirectory?: ManifestAppDirectorySchema;
    userScopes?: Array<string>;
    redirectUrls?: Array<string>;
    tokenManagementEnabled?: boolean;
    features?: ISlackManifestRemoteFeaturesSchema;
}
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
    externalAuthProviders?: (OAuth2Provider)[];
}
interface ISlackManifestRunOnSlackFeaturesSchema {
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
export {};
