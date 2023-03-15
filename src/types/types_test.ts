import { DefineType } from "./mod.ts";
import { assertEquals } from "../dev_deps.ts";
import { CustomType } from "./types.ts";

Deno.test("DefineType test against id using the name parameter", () => {
  const Type = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: "string",
  });

  assertEquals(Type.id, "Name");
});

Deno.test("DefineType test toString using the name parameter", () => {
  const Type = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: "object",
  });

  const typeJson = Type.toJSON();

  assertEquals(typeJson, "#/types/Name");
});

Deno.test("DefineType test export using the name parameter", () => {
  const Type = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: "string",
  });

  const exportType = Type.export();

  assertEquals(exportType, {
    title: "Title",
    description: "Description",
    type: "string",
  });
});

Deno.test("CustomType applied to DefineType object should provide a proper type", () => {
  const Type = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: "object",
    properties: {
      id: {
        type: "string",
        minLength: 3,
      },
      name: {
        type: "string",
      },
      field: {
        type: "object",
        properties: {
          name2: {
            type:"string"
          }
        },
        required: []
      },
    },
    required: []
  });

  type mytype = CustomType<typeof Type>;

  const test = (thing: mytype) => {
    thing.field.;
  };
});

Deno.test("CustomType applied to DefineType object should provide a proper type", () => {
  const Type = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: "array",
    items: {
      type: "object",
      properties: {
        id: {
          type: "string",
          minLength: 3,
        },
        name: {
          type: "string",
        },
      },
    },
  });

  type mytype = CustomType<typeof Type>;

  const test = (thing: mytype) => {
    thing;
  };
});

Deno.test("CustomType applied to DefineType object should provide a proper type", () => {
  const Type = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: "string",
  });

  type mytype = CustomType<typeof Type>;

  const test = (thing: mytype) => {
    thing.type;
  };
});
