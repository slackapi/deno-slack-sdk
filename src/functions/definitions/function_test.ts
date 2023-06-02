import { assertEquals } from "../../dev_deps.ts";
import Schema from "../../schema/mod.ts";
import { FunctionDefinition } from "./function.ts";

import {
  ManifestFunctionSchema,
  ManifestFunctionType,
} from "../../manifest/manifest_schema.ts";
import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../../parameters/types.ts";
import { FunctionDefinitionArgs } from "../types.ts";

export class TestBaseFunctionDefinition<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutput extends PossibleParameterKeys<OutputParameters>,
> extends FunctionDefinition<
  InputParameters,
  OutputParameters,
  RequiredInput,
  RequiredOutput
> {
  type: ManifestFunctionType;
  constructor(
    public definition: FunctionDefinitionArgs<
      InputParameters,
      OutputParameters,
      RequiredInput,
      RequiredOutput
    >,
  ) {
    super(definition);
  }

  export(): ManifestFunctionSchema {
    throw new Error("not Implemented");
  }
}

Deno.test("TestBaseFunctionDefinition with required params", () => {
  const AllTypesFunction = new TestBaseFunctionDefinition({
    callback_id: "my_function",
    title: "All Types Function",
    input_parameters: {
      properties: {
        myString: {
          type: Schema.types.string,
          title: "My string",
          description: "a really neat value",
          hint: "Ex. my neat value",
        },
        myBoolean: {
          type: Schema.types.boolean,
          title: "My boolean",
          hint: "Ex: true/false",
        },
        myInteger: {
          type: Schema.types.integer,
          description: "integer",
          hint: "0-100",
        },
        myNumber: {
          type: Schema.types.number,
          description: "number",
        },
      },
      required: ["myString", "myNumber"],
    },
    output_parameters: {
      properties: {
        out: {
          type: Schema.types.string,
        },
      },
      required: ["out"],
    },
  });

  assertEquals(AllTypesFunction.definition.input_parameters?.required, [
    "myString",
    "myNumber",
  ]);
  assertEquals(AllTypesFunction.definition.output_parameters?.required, [
    "out",
  ]);
  assertEquals(
    AllTypesFunction.definition.input_parameters?.properties.myString.hint,
    "Ex. my neat value",
  );
  assertEquals(
    AllTypesFunction.definition.input_parameters?.properties.myBoolean.hint,
    "Ex: true/false",
  );
});
