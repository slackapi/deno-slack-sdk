import { OAuth2ProviderTypeValues } from "../../schema/providers/oauth2/types.ts";

export type OAuth2ProviderIdentitySchema = {
  "url": string;
  "account_identifier": string;
  "headers"?: {
    [key: string]: string;
  };
};

export type OAuth2ProviderOptions = {
  /** Client id for your provider */
  "client_id": string;
  /** Client secret for your provider */
  "client_secret": string;
  /** Scopes for your provider */
  "scope": string[];
  /** Display name for your provider. Required for CUSTOM provider types. */
  "provider_name"?: string;
  /** Authorization url for your provider. Required for CUSTOM provider types. */
  "authorization_url"?: string;
  /** Token url for your provider. Required for CUSTOM provider types. */
  "token_url"?: string;
  /** Identity configuration for your provider. Required for CUSTOM provider types. */
  "identity_config"?: OAuth2ProviderIdentitySchema;
  /** Optional extras dict for authorization url for your provider. Required for CUSTOM provider types. */
  "authorization_url_extras"?: { [key: string]: string };
};

export type OAuth2ProviderDefinitionArgs = {
  /** A unique name for your provider */
  provider_key: string;
  /** Type of your provider */
  provider_type: OAuth2ProviderTypeValues;
  /** OAuth2 Configuration options for your provider */
  options: OAuth2ProviderOptions;
};
