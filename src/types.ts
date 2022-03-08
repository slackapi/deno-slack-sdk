import { IRunnableSlackFunction } from "./functions/types.ts";
import {
  ParameterDefinition,
  ParameterSetDefinition,
} from "./parameters/mod.ts";
import { ISlackTable, ManifestTableSchema } from "./tables/types.ts";
import { ViewSubmissionDefinition } from "./handlers/types.ts";
import { ICustomType } from "./types/types.ts";
import { IBlockAction } from "./block-actions/types.ts";

// SlackProjectType is the top level type that imports all resources for the project
// An app manifest is generated based on what this project has defined in it
export type SlackProjectType = {
  name: string;
  backgroundColor?: string;
  description: string;
  displayName?: string;
  icon: string;
  longDescription?: string;
  runtime: string;
  botScopes: Array<string>;
  functions?: ProjectFunction[];
  // deno-lint-ignore no-explicit-any
  tables?: ISlackTable<any>[];
  outgoingDomains?: Array<string>;
  _actions?: IBlockAction[];
  _viewSubmissions?: ViewSubmissionDefinition[];
  types?: ICustomType[];
};

// Both of these are typed liberally at this level but more specifically down further
// This is to work around an issue TS has with resolving the generics across the hierarchy
// deno-lint-ignore no-explicit-any
export type ProjectFunction = IRunnableSlackFunction<any, any, any, any>;

export interface ISlackProject {
  runtime(): string;
  export(): ManifestSchema;
}

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
// Tables
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Env
// ----------------------------------------------------------------------------
export type Env = Record<string, string>;

// ----------------------------------------------------------------------------
// Manifest Schema Types
// These types should reflect exactly what we expect in the manifest schema
// and are what are exported from other parts of the project
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
  tables?: {
    [key: string]: ManifestTableSchema;
  };
  "outgoing_domains"?: string[];
  types?: {
    [key: string]: ManifestCustomTypeSchema;
  };
};

export interface ISlackAPIClient {
  /**
   * Calls a Slack API method.
   * @param {string} method The API method name to invoke, i.e. `chat.postMessage`.
   * @param {Object} data Object representing the data you wish to send along to the Slack API method.
   * @returns {Promise<BaseResponse>} A Promise that resolves to the data the API responded with.
   * @throws {Error} Throws an Error if the API response was not OK or a network error occurred.
   */
  call(method: string, data: Record<string, unknown>): Promise<BaseResponse>;
  /**
   * Calls a Slack API method, to be used in conjunction with Slack Events that send a `response_url` property: {@link https://api.slack.com/interactivity/handling#message_responses}.
   *
   * @param {string} url The fully-qualified URL (including protocol, domain and path) of the API to send a request to; typically used for Slack Event API payloads that provide a `response_url` property: {@link https://api.slack.com/interactivity/handling#message_responses}.
   * @param {Object} data Object representing the data you wish to send along to the API method.
   * @returns {Promise<BaseResponse>} A Promise that resolves to the data the API responded with.
   * @throws {Error} Throws an Error if the API response was not OK or a network error occurred.
   */
  response(
    url: string,
    data: Record<string, unknown>,
  ): Promise<BaseResponse>;
}

export type BaseResponse = {
  /** `true` if the response from the server was successful, `false` otherwise. */
  ok: boolean;
  /** Optional error description returned by the server. */
  error?: string;
  /** Optional list of warnings returned by the server. */
  warnings?: Array<string>;
  /** Optional metadata about the response returned by the server. */
  "response_metadata"?: {
    warnings?: Array<string>;
    messages?: Array<string>;
  };
  [otherOptions: string]: unknown;
};
