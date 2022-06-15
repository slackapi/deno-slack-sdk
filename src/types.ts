import type { ISlackFunction } from "./functions/types.ts";
import type { ISlackWorkflow } from "./workflows/types.ts";
import type { ISlackDatastore } from "./datastore/types.ts";
import type {
  ParameterDefinition,
  ParameterSetDefinition,
} from "./parameters/mod.ts";
import type { ICustomType } from "./types/types.ts";
// import type { CamelCasedPropertiesDeep } from "./types_utils/camel-case.ts";

export type {
  BaseSlackFunctionHandler,
  FunctionHandler, // Deprecated
  SlackFunctionHandler,
} from "./functions/types.ts";

/** SlackManifestType describes the shape of the manifest definition provided by
 * the user. An app manifest of type ManifestSchema is generated based on what is
 * defined in it. It does not map 1:1 to the ManifestSchema as it contains affordances
 * for better user experience.
 *
 * This type is a discriminated union where the discriminant property slackHosted
 * property which maps to function_runtime in the underlying ManifestSchema
 */
export type SlackManifestType =
  | ISlackManifestHosted
  | ISlackManifestRemote;

/** ISlackManifestHosted contains the features currently available to
 * ManifestSchema#function_runtime = slack hosted apps. Here, we surface that value
 * to the developer as the slackHosted top-level property.
 */
export interface ISlackManifestHosted {
  slackHosted?: true; // maps to function_runtime = "slack" in ManifestSchema, optional since the apps are slack hosted by default
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

/** ISlackManifestRemote contains the features currently available to
 * ManifestSchema.settings.function_runtime = remote apps. Here we surface that value
 * to the developer as the slackHosted property.
 *
 * A subset of properties overlap with ISlackManifestRemote
 */
export interface ISlackManifestRemote {
  slackHosted: false; // maps to function_runtime = "remote" in ManifestSchema
  name: string;
  backgroundColor?: string;
  description: string;
  displayName?: string;
  icon: string;
  longDescription?: string;
  botScopes: Array<string>;
  functions?: ManifestFunction[];
  workflows?: ManifestWorkflow[];

  // Outgoing domains are not enforced for remote functions
  // outgoingDomains?: Array<string>;
  types?: ICustomType[];
  datastores?: ManifestDatastore[];

  // Features supported in Platform1_0 (Remote) apps only (remote / non-run on Slack)
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

  // oauth
  userScopes?: Array<string>;
  redirectUrls?: Array<string>;
  tokenManagementEnabled?: boolean;

  features?: ISlackManifestRemoteFeaturesSchema;
}

export interface ISlackManifestRemoteFeaturesSchema {
  appHome?: ManifestAppHomeSchema;
  botUser?: Omit<ManifestBotUserSchema, "display_name">;
  shortcuts?: ManifestShortcutsSchema;
  slashCommands?: ManifestSlashCommandsSchema;
  unfurlDomains?: ManifestUnfurlDomainsSchema;
  workflowSteps?: ManifestWorkflowStepsSchema;
}

/** SlackManifestFromType is a type function which takes a parameterT.
 * It looks at the SlackManifestType which is a discriminated union.
 * The function returns the type whose discriminant property (slackHosted) matches T
 */
export type SlackManifestFromType<T extends boolean> = Extract<
  SlackManifestType,
  { slackHosted: T }
>;

export type ManifestDatastore = ISlackDatastore;

// This is typed liberally at this level but more specifically down further
// This is to work around an issue TS has with resolving the generics across the hierarchy
// deno-lint-ignore no-explicit-any
export type ManifestFunction = ISlackFunction<any, any, any, any>;

export type ManifestWorkflow = ISlackWorkflow;

// ----------------------------------------------------------------------------
// Invocation
// ----------------------------------------------------------------------------

// This is the schema received from the runtime
// TODO: flush this out as we add support for other payloads
export type InvocationPayload<Body> = {
  // TODO: type this out to handle multiple body types
  body: Body;
  context: {
    "bot_access_token": string;
    "variables": Record<string, string>;
  };
};

// ----------------------------------------------------------------------------
// Env
// ----------------------------------------------------------------------------
export type Env = Record<string, string>;

// ----------------------------------------------------------------------------
// Manifest Schema Types
// These types should reflect exactly what we expect in the manifest schema
// and are what are exported from other parts of the app
// ----------------------------------------------------------------------------

// These map directly to our internal types, basically a pass-through

export type RequiredParameters = {
  [index: number]: string | number | symbol;
};
export type ManifestFunctionParameters = {
  required?: RequiredParameters;
  properties: ParameterSetDefinition;
};
export type ManifestFunctionSchema = {
  //title and description is optional ->source file does not exists
  title?: string;
  description?: string;
  "source_file": string;
  "input_parameters": ManifestFunctionParameters;
  "output_parameters": ManifestFunctionParameters;
};

export type ManifestCustomTypeSchema = ParameterDefinition;

export type ManifestDatastoreSchema = {
  "primary_key": string;
  attributes: {
    [key: string]: {
      type: string | ICustomType;
      items?: ManifestCustomTypeSchema;
      properties?: {
        [key: string]: ManifestCustomTypeSchema;
      };
    };
  };
};

export type ManifestWorkflowStepSchema = {
  id: string;
  "function_id": string;
  inputs: {
    [name: string]: unknown;
  };
};

export type ManifestWorkflowSchema = {
  title?: string;
  description?: string;
  "input_parameters"?: ManifestFunctionParameters;
  steps: ManifestWorkflowStepSchema[];
};

export type ManifestMetadataSchema = {
  "major_version"?: number;
  "minor_version"?: number;
};

// Features
export type ManifestBotUserSchema = {
  "display_name": string;
  "always_online"?: boolean;
};

export type ManifestAppHomeSchema = {
  "home_tab_enabled"?: boolean;
  "messages_tab_enabled"?: boolean;
  "messages_tab_read_only_enabled"?: boolean;
};

export type ManifestShortcutSchema = {
  name: string;
  type: "message" | "global";
  "callback_id": string;
  description: string;
};

export type ManifestShortcutsSchema = [
  ManifestShortcutSchema,
  ...ManifestShortcutSchema[],
];

export type ManifestSlashCommandSchema = {
  command: string;
  url?: string;
  description: string;
  "usage_hint"?: string;
  "should_escape"?: boolean;
};

export type ManifestSlashCommandsSchema = [
  ManifestSlashCommandSchema,
  ...ManifestSlashCommandSchema[],
];

export type ManifestUnfurlDomainsSchema = [string, ...string[]];

export type ManifestWorkflowStep = {
  name: string;
  "callback_id": string;
};

export type ManifestWorkflowStepsSchema = [
  ManifestWorkflowStep,
  ...ManifestWorkflowStep[],
];

export interface ManifestFeaturesRemote {
  appHome?: ManifestAppHomeSchema;
  botUser?: ManifestBotUserSchema;
  shortcuts?: ManifestShortcutsSchema;
  slashCommands?: ManifestSlashCommandsSchema;
  unfurlDomains?: ManifestUnfurlDomainsSchema;
  workflowSteps?: ManifestWorkflowStepsSchema;
}

// App Directory
export type ManifestAppDirectorySchema = {
  "app_directory_categories"?: string[];
  "use_direct_install"?: boolean;
  "direct_install_url"?: string;
  "installation_landing_page": string;
  "privacy_policy_url": string;
  "support_url": string;
  "support_email": string;
  "supported_languages": [string, ...string[]];
  pricing: string;
};

// Settings
export type ManifestInteractivitySchema = {
  "is_enabled": boolean;
  "request_url"?: string;
  "message_menu_options_url"?: string;
};

export type ManifestEventSubscriptionsSchema = {
  "request_url"?: string;
  "user_events"?: string[];
  "bot_events"?: string[];
  "metadata_subscriptions"?: [
    {
      "app_id": string;
      "event_type": string;
    },
    ...{
      "app_id": string;
      "event_type": string;
    }[],
  ];
};

export type ManifestSiwsLinksSchema = {
  "initiate_uri"?: string;
};

export type ManifestSettingsSchema = {
  "allowed_ip_address_ranges"?: [string, ...string[]];
  "event_subscriptions"?: ManifestEventSubscriptionsSchema;
  "incoming_webhooks"?: boolean;
  interactivity?: ManifestInteractivitySchema;
  "org_deploy_enabled"?: boolean;
  "socket_mode_enabled"?: boolean;
  "token_rotation_enabled"?: boolean;
  "siws_links"?: ManifestSiwsLinksSchema;
  "function_runtime"?: string;
};

// Display Information
export type ManifestDisplayInformationSchema = {
  "background_color"?: string;
  name: string;
  "long_description"?: string;
  "description": string;
};
//Oauth Config
export type ManifestOauthConfigSchema = {
  scopes: {
    bot?: string[];
    user?: string[];
  };
  "redirect_urls"?: string[];
  "token_management_enabled"?: boolean;
};

export type ManifestSchema = {
  "_metadata"?: ManifestMetadataSchema;
  settings: ManifestSettingsSchema;
  "app_directory"?: ManifestAppDirectorySchema;
  "display_information": ManifestDisplayInformationSchema;
  icon: string;
  "oauth_config": ManifestOauthConfigSchema;
  features: {
    "app_home"?: ManifestAppHomeSchema;
    "bot_user"?: ManifestBotUserSchema;
    "shortcuts"?: ManifestShortcutsSchema;
    "slash_commands"?: ManifestSlashCommandsSchema;
    "unfurl_domains"?: ManifestUnfurlDomainsSchema;
    "workflow_steps"?: ManifestWorkflowStepsSchema;
  };
  functions?: {
    [key: string]: ManifestFunctionSchema;
  };
  workflows?: {
    [key: string]: ManifestWorkflowSchema;
  };
  "outgoing_domains"?: string[];
  types?: {
    [key: string]: ManifestCustomTypeSchema;
  };
  datastores?: {
    [key: string]: ManifestDatastoreSchema;
  };
};
