import { ISlackDatastore } from "../datastore/types.js";
import { ISlackFunction } from "../functions/types.js";
import type {
  ParameterDefinition,
  ParameterSetDefinition,
} from "../parameters/mod.js";
import { OAuth2ProviderTypeValues } from "../schema/providers/oauth2/types.js";
import type { ICustomType } from "../types/types.js";
import { ISlackWorkflow } from "../workflows/types.js";

// ----------------------------------------------------------------------------
// Manifest Schema Types
// These types should map directly to internal types, basically a pass through
// ----------------------------------------------------------------------------
export type ManifestSchema = {
  _metadata?: ManifestMetadataSchema;
  settings: ManifestSettingsSchema;
  app_directory?: ManifestAppDirectorySchema;
  display_information: ManifestDisplayInformationSchema;
  icon: string;
  oauth_config: ManifestOauthConfigSchema;
  features: ManifestFeaturesSchema;
  functions?: ManifestFunctionsSchema;
  workflows?: ManifestWorkflowsSchema;
  outgoing_domains?: string[];
  types?: ManifestCustomTypesSchema;
  datastores?: ManifestDataStoresSchema;
  external_auth_providers?: ManifestExternalAuthProviders;
};

// ---------------------------------------------------------------------------
// Manifest: _metadata
// ---------------------------------------------------------------------------
export type ManifestMetadataSchema = {
  major_version?: number;
  minor_version?: number;
};

// ---------------------------------------------------------------------------
// Manifest: Settings
// ---------------------------------------------------------------------------
export type ManifestSettingsSchema = {
  allowed_ip_address_ranges?: [string, ...string[]];
  event_subscriptions?: ManifestEventSubscriptionsSchema;
  incoming_webhooks?: ManifestIncomingWebhooks;
  interactivity?: ManifestInteractivitySchema;
  org_deploy_enabled?: boolean;
  socket_mode_enabled?: boolean;
  token_rotation_enabled?: boolean;
  siws_links?: ManifestSiwsLinksSchema;
  function_runtime?: ManifestFunctionRuntime;
};

// Settings: Event Subscriptions
export type ManifestEventSubscriptionsSchema = {
  request_url?: string;
  user_events?: string[];
  bot_events?: string[];
  metadata_subscriptions?: [
    {
      app_id: string;
      event_type: string;
    },
    ...{
      app_id: string;
      event_type: string;
    }[],
  ];
};

// Settings: Incoming Webhooks
export type ManifestIncomingWebhooks = {
  incoming_webhooks_enabled?: boolean;
};

// Settings Interactivity
export type ManifestInteractivitySchema = {
  is_enabled: boolean;
  request_url?: string;
  message_menu_options_url?: string;
};

// Settings: SIWS
export type ManifestSiwsLinksSchema = {
  initiate_uri?: string;
};

// Settings: Function Runtime
export type ManifestFunctionRuntime = "slack" | "remote" | "local";

// ---------------------------------------------------------------------------
// Manifest: App Directory
// ---------------------------------------------------------------------------
export type ManifestAppDirectorySchema = {
  app_directory_categories?: string[];
  use_direct_install?: boolean;
  direct_install_url?: string;
  installation_landing_page: string;
  privacy_policy_url: string;
  support_url: string;
  support_email: string;
  supported_languages: [string, ...string[]];
  pricing: string;
};

// ---------------------------------------------------------------------------
// Manifest: Display Information
// ---------------------------------------------------------------------------
export type ManifestDisplayInformationSchema = {
  name: string;
  description?: string;
  background_color?: string;
  long_description?: string;
};

// ---------------------------------------------------------------------------
// Manifest: Oauth Config
// ---------------------------------------------------------------------------
export type ManifestOauthConfigSchema = {
  scopes: {
    bot?: string[];
    user?: string[];
  };
  redirect_urls?: string[];
  token_management_enabled?: boolean;
};

// ---------------------------------------------------------------------------
// Manifest: Features
// ---------------------------------------------------------------------------
export interface ManifestFeaturesSchema {
  bot_user?: ManifestBotUserSchema;
  app_home: ManifestAppHomeSchema;
  shortcuts?: ManifestShortcutsSchema;
  slash_commands?: ManifestSlashCommandsSchema;
  unfurl_domains?: ManifestUnfurlDomainsSchema;
  workflow_steps?: ManifestWorkflowStepsSchemaLegacy;
}

// Features: Bot User
export type ManifestBotUserSchema = {
  display_name: string;
  always_online?: boolean;
};

// Features: App Home
export type ManifestAppHomeSchema = AppHomeMessagesTab & {
  home_tab_enabled?: boolean;
};

type AppHomeMessagesTab = {
  /** @default true */
  messages_tab_enabled?: true;
  /** @default true */
  messages_tab_read_only_enabled?: boolean;
} | {
  /** @default true */
  messages_tab_enabled: false;
  /** @default true */
  messages_tab_read_only_enabled: false;
};

// Features: Shortcuts
export type ManifestShortcutSchema = {
  name: string;
  type: "message" | "global";
  callback_id: string;
  description: string;
};

export type ManifestShortcutsSchema = PopulatedArray<ManifestShortcutSchema>;

// Features: Slash Commands
export type ManifestSlashCommandsSchema = PopulatedArray<
  ManifestSlashCommandSchema
>;

export type ManifestSlashCommandSchema = {
  command: string;
  url?: string;
  description: string;
  usage_hint?: string;
  should_escape?: boolean;
};

// Features: Workflow Step (To be deprecated)
// Not to be confused with 2.0 ManifestWorkflowStepSchema
export type ManifestWorkflowStepLegacy = {
  name: string;
  callback_id: string;
};

export type ManifestWorkflowStepsSchemaLegacy = PopulatedArray<
  ManifestWorkflowStepLegacy
>;

// Features: Unfurl Domains
export type ManifestUnfurlDomainsSchema = [string, ...string[]];

// ---------------------------------------------------------------------------
// Manifest: Functions
// ---------------------------------------------------------------------------

// This is typed liberally at this level but more specifically down further
// This is to work around an issue TS has with resolving the generics across the hierarchy
// deno-lint-ignore no-explicit-any
export type ManifestFunction = ISlackFunction<any, any, any, any>;

export type ManifestFunctionsSchema = { [key: string]: ManifestFunctionSchema };

export type ManifestFunctionSchema = {
  title?: string;
  description?: string;
  source_file: string;
  input_parameters: ManifestFunctionParameters;
  output_parameters: ManifestFunctionParameters;
};

export type ManifestFunctionParameters = {
  required?: RequiredParameters;
  properties: ParameterSetDefinition;
};

export type RequiredParameters = {
  [index: number]: string | number | symbol;
};

// ---------------------------------------------------------------------------
// Manifest: Workflows
// Not to be confused with ManifestWorkflowStepsSchemaLegacy
// ---------------------------------------------------------------------------
export type ManifestWorkflow = ISlackWorkflow;

export type ManifestWorkflowsSchema = { [key: string]: ManifestWorkflowSchema };
export type ManifestWorkflowSchema = {
  title?: string;
  description?: string;
  input_parameters?: ManifestFunctionParameters;
  steps: ManifestWorkflowStepSchema[];
};
export type ManifestWorkflowStepSchema = {
  id: string;
  function_id: string;
  inputs: {
    [name: string]: unknown;
  };
};

// ---------------------------------------------------------------------------
// Manifest: Custom Types
// ---------------------------------------------------------------------------

export type ManifestCustomTypeSchema = ParameterDefinition;
export type ManifestCustomTypesSchema = {
  [key: string]: ManifestCustomTypeSchema;
};

// ---------------------------------------------------------------------------
// Manifest: Datastores
// ---------------------------------------------------------------------------
export type ManifestDatastore = ISlackDatastore;
export type ManifestDatastoreSchema = {
  primary_key: string;
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

export type ManifestDataStoresSchema = {
  [key: string]: ManifestDatastoreSchema;
};

// -------------------------------------------------------------------------
// Manifest: OAuth2 Provider
// -------------------------------------------------------------------------
export type ManifestOAuth2Schema = {
  [key: string]: ManifestOAuth2ProviderSchema;
};

export type ManifestOAuth2ProviderSchema = {
  provider_type: OAuth2ProviderTypeValues;
  options: {
    // deno-lint-ignore no-explicit-any
    [key: string]: any;
  };
};

export interface ManifestExternalAuthProviders {
  oauth2?: ManifestOAuth2Schema;
}

// -------------------------------------------------------------------------
// Utilities
// -------------------------------------------------------------------------

// Utility type for the array types which requires minumum one subtype in it.
export type PopulatedArray<T> = [T, ...T[]];
