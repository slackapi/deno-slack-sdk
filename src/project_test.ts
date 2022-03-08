import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { SlackProjectType } from "./types.ts";
import { SlackProject } from "./project.ts";
import { DefineFunction, DefineTable, DefineType, Schema } from "./mod.ts";

Deno.test("SlackProject.export() project definition to manifest property mappings", () => {
  const definition: SlackProjectType = {
    name: "fear and loathing in las vegas",
    backgroundColor: "#FFF",
    description:
      "fear and loathing in las vegas: a savage journey to the heart of the american dream",
    displayName: "fear and loathing",
    icon: "icon.png",
    longDescription:
      "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
    runtime: "deno",
    botScopes: [],
  };
  let project = new SlackProject(definition);
  let manifest = project.export();
  assertEquals(
    manifest.display_information.background_color,
    definition.backgroundColor,
  );
  assertEquals(manifest.display_information.name, definition.name);
  assertEquals(
    manifest.display_information.long_description,
    definition.longDescription,
  );
  assertEquals(
    manifest.display_information.short_description,
    definition.description,
  );
  assertEquals(manifest.icon, definition.icon);
  assertEquals(
    manifest.features.bot_user.display_name,
    definition.displayName,
  );
  // If display_name is not defined on definition, should fall back to name
  delete definition.displayName;
  project = new SlackProject(definition);
  manifest = project.export();
  assertEquals(manifest.features.bot_user.display_name, definition.name);
});

Deno.test("SlackProject.export() project fails due to dup table names", () => {
  const definition: SlackProjectType = {
    name: "fear and loathing in las vegas",
    description:
      "fear and loathing in las vegas: a savage journey to the heart of the american dream",
    displayName: "fear and loathing",
    icon: "icon.png",
    runtime: "deno",
    botScopes: [],
    tables: [
      DefineTable("dup", {
        primary_key: "channel",
        columns: {
          channel: {
            type: Schema.slack.types.channel_id,
          },
        },
      }),
      DefineTable("dup", {
        primary_key: "channel",
        columns: {
          channel: {
            type: Schema.slack.types.channel_id,
          },
        },
      }),
    ],
  };
  const project = new SlackProject(definition);
  assertThrows(
    () => {
      project.export();
    },
    Error,
    "Duplicate entry found for table where name=dup",
  );
});

Deno.test("SlackProject.export() project exports table columns correctly", () => {
  const Dinos = DefineTable("dinos", {
    primary_key: "id",
    columns: {
      id: {
        type: Schema.types.integer,
      },
      related_dinos: {
        type: Schema.types.array,
        items: {
          type: Schema.types.integer,
        },
      },
      dino_metadata: {
        type: Schema.types.object,
        properties: {
          "is_herbivore": {
            type: Schema.types.boolean,
          },
        },
      },
    },
  });
  const definition: SlackProjectType = {
    name: "Dinos",
    description: "Life finds a way",
    displayName: "Jussaric Park Dinos",
    icon: "icon.png",
    runtime: "deno",
    botScopes: [],
    tables: [Dinos],
  };
  const project = new SlackProject(definition);
  const manifest = project.export();
  console.log(manifest.tables, { ["dinos"]: Dinos.export() });
  assertEquals(manifest.tables, { ["dinos"]: Dinos.export() });
});

Deno.test("SlackProject automatically registers types used by function input and output parameters", () => {
  const inputTypeId = "test_input_type";
  const outputTypeId = "test_output_type";
  const stringTypeId = "test_string_type";

  const CustomStringType = DefineType(stringTypeId, {
    type: Schema.types.string,
  });

  const CustomInputType = DefineType(inputTypeId, {
    type: Schema.types.object,
    properties: { aString: { type: CustomStringType } },
  });

  const CustomOutputType = DefineType(outputTypeId, {
    type: Schema.types.boolean,
  });

  const Function = DefineFunction("test_function", {
    title: "Function title",
    input_parameters: {
      properties: { aType: { type: CustomInputType } },
      required: [],
    },
    output_parameters: {
      properties: { aType: { type: CustomOutputType } },
      required: [],
    },
  }, async () => {
    return await {
      outputs: {},
    };
  });

  const definition: SlackProjectType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    longDescription: "LongDescription",
    runtime: "deno",
    botScopes: [],
    functions: [Function],
  };
  const project = new SlackProject(definition);
  const manifest = project.export();
  assertEquals(definition.types, [
    CustomInputType,
    CustomOutputType,
    CustomStringType,
  ]);
  assertEquals(manifest.types, {
    [inputTypeId]: CustomInputType.definition,
    [stringTypeId]: CustomStringType.definition,
    [outputTypeId]: CustomOutputType.definition,
  });
});

Deno.test("SlackProject automatically registers types referenced by other types", () => {
  const objectTypeId = "test_object_type";
  const stringTypeId = "test_string_type";
  const arrayTypeId = "test_array_type";

  const StringType = DefineType(stringTypeId, {
    type: Schema.types.string,
  });

  const ObjectType = DefineType(objectTypeId, {
    type: Schema.types.object,
    properties: {
      aString: { type: StringType },
    },
  });

  const ArrayType = DefineType(arrayTypeId, {
    type: Schema.types.array,
    items: {
      type: ObjectType,
    },
  });

  const definition: SlackProjectType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    longDescription: "LongDescription",
    runtime: "deno",
    botScopes: [],
    types: [ArrayType],
  };
  const project = new SlackProject(definition);
  const manifest = project.export();
  assertEquals(definition.types, [ArrayType, ObjectType, StringType]);
  assertEquals(manifest.types, {
    [arrayTypeId]: ArrayType.definition,
    [objectTypeId]: ObjectType.definition,
    [stringTypeId]: StringType.definition,
  });
});

Deno.test("Project registration functions don't allow duplicates", () => {
  const functionId = "test_function";
  const objectTypeId = "test_object_type";
  const stringTypeId = "test_string_type";

  const CustomStringType = DefineType(stringTypeId, {
    type: Schema.types.string,
  });

  const CustomObjectType = DefineType(objectTypeId, {
    type: Schema.types.object,
    properties: {
      aString: {
        type: CustomStringType,
      },
    },
  });

  const Func = DefineFunction(functionId, {
    title: "Function title",
  }, async () => {
    return await {
      outputs: {},
    };
  });

  const definition: SlackProjectType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    longDescription: "LongDescription",
    runtime: "deno",
    botScopes: [],
    functions: [Func],
    types: [CustomObjectType],
  };
  const project = new SlackProject(definition);
  project.registerFunction(Func);
  project.registerFunction(Func);
  project.registerType(CustomObjectType);
  project.registerType(CustomObjectType);
  project.registerType(CustomStringType);
  const manifest = project.export();

  assertEquals(definition.functions, [Func]);
  assertEquals(manifest.functions, { [functionId]: Func.export() });
  assertEquals(definition.types, [CustomObjectType, CustomStringType]);
  assertEquals(manifest.types, {
    [objectTypeId]: CustomObjectType.definition,
    [stringTypeId]: CustomStringType.definition,
  });
});
