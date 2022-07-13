import type { ISlackFunction } from "./functions/types.ts";
import type { ISlackWorkflow } from "./workflows/types.ts";
import type { ISlackDatastore } from "./datastore/types.ts";
import { OAuth2Provider } from "./providers/oauth2/mod.ts";
import type {
  ParameterDefinition,
  ParameterSetDefinition,
} from "./parameters/mod.ts";
import { ICustomType } from "./types/types.ts";
import { OAuth2ProviderTypeValues } from "./schema/providers/oauth2/types.ts";

// SlackManifestType is the top level type that imports all resources for the app
// An app manifest is generated based on what this has defined in it

export type {
  BaseSlackFunctionHandler,
  FunctionHandler, // Deprecated
  SlackFunctionHandler,
} from "./functions/types.ts";

export type SlackManifestFeaturesAppHome = AppHomeMessagesTab;

// TODO: Find way to share these defaults
type AppHomeMessagesTab = {
  /** @default true */
  messagesTabEnabled?: true;
  /** @default true */
  messagesTabReadOnlyEnabled?: boolean;
} | {
  /** @default true */
  messagesTabEnabled: false;
  /** @default true */
  messagesTabReadOnlyEnabled: false;
};

export interface SlackManifestFeatures {
  appHome?: SlackManifestFeaturesAppHome;
}

export type SlackManifestType = {
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
  features?: SlackManifestFeatures;
  // In the future, there can be other types of providers
  externalAuthProviders?: (OAuth2Provider /*|OAuth1Provider*/)[];
};

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
    bot_access_token: string;
    variables: Record<string, string>;
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
  title?: string;
  description?: string;
  source_file: string;
  input_parameters: ManifestFunctionParameters;
  output_parameters: ManifestFunctionParameters;
};

export type ManifestFunctionsSchema = { [key: string]: ManifestFunctionSchema };

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

export type ManifestWorkflowStepSchema = {
  id: string;
  function_id: string;
  inputs: {
    [name: string]: unknown;
  };
};

export type ManifestWorkflowSchema = {
  title?: string;
  description?: string;
  input_parameters?: ManifestFunctionParameters;
  steps: ManifestWorkflowStepSchema[];
};

export type ManifestWorkflowsSchema = { [key: string]: ManifestWorkflowSchema };

export type ManifestCustomTypeSchema = ParameterDefinition;

export type ManifestCustomTypesSchema = {
  [key: string]: ManifestCustomTypeSchema;
};

export type ManifestMetadata = {
  major_version?: number;
  minor_version?: number;
};

export interface ManifestFeaturesAppHome {
  messages_tab_enabled?: boolean;
  messages_tab_read_only_enabled?: boolean;
}

export interface ManifestFeaturesSchema {
  bot_user: {
    display_name: string;
  };
  app_home: ManifestFeaturesAppHome;
}

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

export type ManifestSchema = {
  _metadata?: ManifestMetadata;
  display_information: {
    background_color?: string;
    name: string;
    long_description?: string;
    short_description: string;
  };
  icon: string;
  oauth_config: {
    scopes: {
      bot: string[];
    };
  };
  features: ManifestFeaturesSchema;
  functions?: ManifestFunctionsSchema;
  workflows?: ManifestWorkflowsSchema;
  outgoing_domains?: string[];
  types?: ManifestCustomTypesSchema;
  datastores?: ManifestDataStoresSchema;
  "external_auth_providers"?: {
    oauth2?: ManifestOAuth2Schema;
  };
};
