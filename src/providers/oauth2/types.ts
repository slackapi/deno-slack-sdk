import {
  OAuth2ProviderTypeValues,
} from "../../schema/providers/oauth2/types.ts";

export type IdentityUrlHttpMethodTypes = "GET" | "POST";
export type OAuth2ProviderIdentitySchema = {
  "url": string;
  "account_identifier": string;
  "headers"?: {
    [key: string]: string;
  };
  "body"?: {
    [key: string]: string;
  };
  "http_method_type"?: IdentityUrlHttpMethodTypes;
};

export type tokenUrlConfigSchema = {
  /** Default value is false */
  "use_basic_authentication_scheme"?: boolean;
};

export type OAuth2ProviderOptions = {
  /** Client id for your provider */
  "client_id": string;
  /** Scopes for your provider */
  "scope": string[];
  /** Display name for your provider. Required for CUSTOM provider types. */
  "provider_name"?: string;
  /** Authorization url for your provider. Required for CUSTOM provider types. */
  "authorization_url"?: string;
  /** Token url for your provider. Required for CUSTOM provider types. */
  "token_url"?: string;
  /** Optional configs for token url. Required for CUSTOM provider types. */
  "token_url_config"?: tokenUrlConfigSchema;
  /** Identity configuration for your provider. Required for CUSTOM provider types.
   * If token_url_config is not present, use_basic_authentication_scheme value is false by default. */
  "identity_config"?: OAuth2ProviderIdentitySchema;
  /** Optional extras dict for authorization url for your provider. Required for CUSTOM provider types. */
  "authorization_url_extras"?: { [key: string]: string };
  /** Optional boolean flag to specify if the provider uses PKCE. by default it is considered false. Required for CUSTOM provider types. */
  "use_pkce"?: boolean;
};

export type OAuth2ProviderDefinitionArgs = {
  /** A unique name for your provider */
  provider_key: string;
  /** Type of your provider */
  provider_type: OAuth2ProviderTypeValues;
  /** OAuth2 Configuration options for your provider */
  options: OAuth2ProviderOptions;
};
