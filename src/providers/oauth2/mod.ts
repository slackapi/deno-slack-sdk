import { OAuth2ProviderDefinitionArgs } from "./types.ts";
import { OAuth2ProviderTypeValues } from "../../schema/providers/oauth2/types.ts";
import {
  ManifestOAuth2ProviderSchema,
  OAuth2ProviderOptionsSchema,
} from "../../manifest/manifest_schema.ts";

export const DefineOAuth2Provider = (
  definition: OAuth2ProviderDefinitionArgs,
): OAuth2Provider => {
  return new OAuth2Provider(definition);
};

export class OAuth2Provider {
  public id: string;
  private provider_type: OAuth2ProviderTypeValues;
  private options: OAuth2ProviderOptionsSchema;

  constructor(
    public definition: OAuth2ProviderDefinitionArgs,
  ) {
    this.id = definition.provider_key;
    this.provider_type = definition.provider_type;
    this.options = definition.options;
  }

  export(): ManifestOAuth2ProviderSchema {
    return {
      provider_type: this.provider_type,
      options: this.options,
    };
  }
}
