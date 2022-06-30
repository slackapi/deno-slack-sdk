import { DefineType } from "./mod.ts";
import { assertEquals } from "../dev_deps.ts";

Deno.test("DefineType test against id using the name parameter", () => {
  const Type = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: "Type",
  });

  assertEquals(Type.id, "Name");
});

Deno.test("DefineType test against id using the callback_id parameter", () => {
  const Type = DefineType({
    title: "Title",
    description: "Description",
    callback_id: "Callback_id",
    type: "Type",
  });

  assertEquals(Type.id, "Callback_id");
});

Deno.test("DefineType test topString using the callback_id parameter", () => {
  const Type = DefineType({
    title: "Title",
    description: "Description",
    callback_id: "Callback_id",
    type: "Type",
  });

  const typeString = Type.toString();

  assertEquals(typeString, "#/types/Callback_id");
});

Deno.test("DefineType test toString using the name parameter", () => {
  const Type = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: "Type",
  });

  const typeJson = Type.toJSON();

  assertEquals(typeJson, "#/types/Name");
});

Deno.test("DefineType test export using the name parameter", () => {
  const Type = DefineType({
    title: "Title",
    description: "Description",
    name: "Name",
    type: "Type",
  });

  const exportType = Type.export();

  assertEquals(exportType, {
    title: "Title",
    description: "Description",
    type: "Type",
  });
});

Deno.test("DefineType test export using the callback_id parameter", () => {
  const Type = DefineType({
    title: "Title",
    description: "Description",
    callback_id: "Callback_id",
    type: "Type",
  });

  const exportType = Type.export();

  assertEquals(exportType, {
    title: "Title",
    description: "Description",
    type: "Type",
  });
});
