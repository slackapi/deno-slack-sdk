import { JWTProviderDefinitionArgs, JWTProviderOptions } from "./types.ts";

import { JWTProviderTypeValues } from "../../schema/providers/jwt/types.ts";
import { ManifestJWTProviderSchema } from "../../manifest/manifest_schema.ts";

export const DefineJWTProvider = (
  definition: JWTProviderDefinitionArgs,
): JWTProvider => {
  return new JWTProvider(definition);
};

export class JWTProvider {
  public id: string;
  private provider_type: JWTProviderTypeValues;
  private options: JWTProviderOptions;

  constructor(
    public definition: JWTProviderDefinitionArgs,
  ) {
    this.id = definition.provider_key;
    this.provider_type = definition.provider_type;
    this.options = definition.options;
  }

  export(): ManifestJWTProviderSchema {
    return {
      provider_type: this.provider_type,
      options: this.options,
    };
  }
}
