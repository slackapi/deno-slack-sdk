import {
  ParameterPropertiesDefinition,
  ParameterSetDefinition,
} from "../parameters/mod.ts";
import { SlackFunction } from "../functions/mod.ts";

type BaseSchemaType = {
  types?: {
    [key: string]: string;
  };
  functions?: {
    [key: string]: SlackFunction<
      ParameterSetDefinition,
      ParameterSetDefinition,
      ParameterPropertiesDefinition<ParameterSetDefinition>,
      ParameterPropertiesDefinition<ParameterSetDefinition>
    >;
  };
};

// Allow for sub-schema, i.e. schema.slack.types...
export type SchemaType = BaseSchemaType & {
  [key: string]: BaseSchemaType;
};
