import { DefineEvent } from "./mod.ts";
import { assertEquals } from "../dev_deps.ts";
import { DefineType, Schema } from "../mod.ts";
import { CustomType } from "../types/mod.ts";

Deno.test("DefineEvent accepts object types", () => {
  const TestEvent = DefineEvent({
    name: "test",
    type: Schema.types.object,
    properties: {},
  });

  assertEquals(typeof TestEvent.definition.type, "string");
});

Deno.test("DefineEvent accepts custom types", () => {
  const TestType = DefineType({
    name: "test",
    type: Schema.types.object,
    properties: {},
  });

  const TestEvent = DefineEvent({
    title: "Title",
    description: "Description",
    name: "test",
    type: TestType,
  });

  assertEquals(TestEvent.definition.type instanceof CustomType, true);
});

Deno.test("DefineEvent is properly stringified", () => {
  const TestEvent = DefineEvent({
    name: "test",
    type: Schema.types.object,
    properties: {},
  });

  assertEquals(`${TestEvent}`, TestEvent.id);
  assertEquals(TestEvent.toJSON(), TestEvent.id);
  assertEquals(TestEvent.toString(), TestEvent.id);
});
