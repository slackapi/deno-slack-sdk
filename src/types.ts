import { ISlackFunction } from "./functions/types.ts";
import {
  ParameterDefinition,
  ParameterSetDefinition,
} from "./parameters/mod.ts";
import { ICustomType } from "./types/types.ts";

// SlackManifestType is the top level type that imports all resources for the app
// An app manifest is generated based on what this has defined in it

export type SlackManifestType = {
  name: string;
  backgroundColor?: string;
  description: string;
  displayName?: string;
  icon: string;
  longDescription?: string;
  runtime: string;
  botScopes: Array<string>;
  functions?: ManifestFunction[];
  outgoingDomains?: Array<string>;
  types?: ICustomType[];
};

// Both of these are typed liberally at this level but more specifically down further
// This is to work around an issue TS has with resolving the generics across the hierarchy
// deno-lint-ignore no-explicit-any
export type ManifestFunction = ISlackFunction<any, any, any, any>;

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
  title?: string;
  description?: string;
  source_file: string;
  "input_parameters": ManifestFunctionParameters;
  "output_parameters": ManifestFunctionParameters;
};

export type ManifestCustomTypeSchema = ParameterDefinition;

export type ManifestMetadata = {
  "major_version"?: number;
  "minor_version"?: number;
};

export type ManifestSchema = {
  "_metadata"?: ManifestMetadata;
  "display_information": {
    "background_color"?: string;
    name: string;
    "long_description"?: string;
    "short_description": string;
  };
  icon: string;
  "oauth_config": {
    scopes: {
      bot: string[];
    };
  };
  features: {
    "bot_user": {
      "display_name": string;
    };
  };
  runtime?: string;
  functions?: {
    [key: string]: ManifestFunctionSchema;
  };
  "outgoing_domains"?: string[];
  types?: {
    [key: string]: ManifestCustomTypeSchema;
  };
};
