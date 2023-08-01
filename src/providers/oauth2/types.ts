import { ManifestOAuth2ProviderSchema } from "../../manifest/manifest_schema.ts";

export type OAuth2ProviderDefinitionArgs = ManifestOAuth2ProviderSchema & {
  /** A unique name for the provider */
  provider_key: string;
};
