import {
  ParameterDefinition,
  TypedObjectParameterDefinition,
  TypedObjectProperties,
  TypedObjectRequiredProperties,
} from "../parameters/types.ts";
import { SlackManifest } from "../manifest/mod.ts";
import { ManifestCustomTypeSchema } from "../manifest/manifest_schema.ts";
import { CustomType } from "./mod.ts";

interface ICustomTypeDefinition {
  name: string;
}
export type CustomTypeDefinition =
  & ICustomTypeDefinition
  & ParameterDefinition;

type CustomObjectTypeDefinition<
  Props extends TypedObjectProperties,
  RequiredProps extends TypedObjectRequiredProperties<Props>,
> =
  & ICustomTypeDefinition
  & TypedObjectParameterDefinition<Props, RequiredProps>;

export type DefineTypeFunction = {
  <Def extends CustomTypeDefinition>(definition: Def): CustomType<Def>;
  <
    Props extends TypedObjectProperties,
    RequiredProps extends TypedObjectRequiredProperties<Props>,
    Def extends CustomObjectTypeDefinition<Props, RequiredProps>,
  >(definition: Def): CustomType<Def>;
};

export interface ICustomType {
  id: string;
  definition: CustomTypeDefinition;
  description?: string;
  registerParameterTypes: (manifest: SlackManifest) => void;
  export(): ManifestCustomTypeSchema;
}
