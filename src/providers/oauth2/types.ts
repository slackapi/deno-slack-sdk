import {
  OAuth2ProviderTypeValues,
} from "../../schema/providers/oauth2/types.ts";

/** Http Method types that are currently supported by identity config */
export type IdentityUrlHttpMethodTypes = "GET" | "POST";
export type OAuth2ProviderIdentitySchema = {
  /** url that is used to identify the authed user */
  "url": string;
  /** A field name that is returned in response to invoking the identity config url that
   * can be used as the account identifier of the authed user */
  "account_identifier": string;
  /** Extra headers that the identity url might expect.
   * Note: It adds `Authorization` header automatically so no need to specify this. */
  "headers"?: {
    [key: string]: string;
  };
  /** static body parameters that the identity url expects. This is nullable since only POST methods use this */
  "body"?: {
    [key: string]: string;
  };
  /** method type of the identity url configured above. By default it is considered GET. */
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
