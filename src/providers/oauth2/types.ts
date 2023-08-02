import { ManifestOAuth2ProviderSchema } from "../../manifest/manifest_schema.ts";

export type OAuth2ProviderDefinitionArgs = ManifestOAuth2ProviderSchema & {
  /** A unique name for the provider */
  provider_key: string;
};

/**
 * TODO: The type system here could be improved one more then one provider type (CUSTOM) is available
 * provider_name, authorization_url, token_url, identity_config and authorization_url_extras
 * are only required for CUSTOM provider types
 */
export type OAuth2ProviderOptions = {
  /** Client id for the provider */
  client_id: string;
  /** Scopes for the provider */
  scope: string[];
  /** Display name for the provider. Required for CUSTOM provider types. */
  provider_name?: string;
  /** Authorization url for the provider. Required for CUSTOM provider types. */
  authorization_url?: string;
  /** Token url for the provider. Required for CUSTOM provider types. */
  token_url?: string;
  /** Identity configuration for the provider. Required for CUSTOM provider types. */
  identity_config?: OAuth2ProviderIdentity;
  /** Optional extras dict for authorization url for your provider. Required for CUSTOM provider types. */
  authorization_url_extras?: { [key: string]: string };
};

export type OAuth2ProviderIdentity = {
  url: string;
  account_identifier: string;
  headers?: {
    [key: string]: string;
  };
};
