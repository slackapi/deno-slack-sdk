import { DefineType } from "./mod.ts";
import { assertEquals } from "../dev_deps.ts";

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
    type: "string",
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
