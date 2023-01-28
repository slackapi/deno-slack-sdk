import {
  ParameterDefinitionWithGenerics,
  TypedObjectProperties,
  TypedObjectRequiredProperties,
} from "../parameters/types.ts";
import { SlackManifest } from "../manifest/mod.ts";
import { ManifestCustomTypeSchema } from "../manifest/manifest_schema.ts";

export type CustomTypeDefinition<
  Props extends TypedObjectProperties,
  RequiredProps extends TypedObjectRequiredProperties<Props>,
> =
  & { name: string }
  & ParameterDefinitionWithGenerics<Props, RequiredProps>;

export interface ICustomType<
  Props extends TypedObjectProperties = TypedObjectProperties,
  RequiredProps extends TypedObjectRequiredProperties<Props> =
    TypedObjectRequiredProperties<Props>,
> {
  id: string;
  definition: CustomTypeDefinition<Props, RequiredProps>;
  description?: string;
  registerParameterTypes: (manifest: SlackManifest) => void;
  export(): ManifestCustomTypeSchema;
}
