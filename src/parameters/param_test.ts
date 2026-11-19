import { assertEquals } from "../dev_deps.ts";
import { ParamReference } from "./param.ts";

Deno.test(ParamReference.name, async (t) => {
  await t.step("should return a . separated string reference value", () => {
    const actual = ParamReference("hello", "world");

    assertEquals(actual.toString(), "{{hello.world}}");
    assertEquals(actual.toJSON(), "{{hello.world}}");
  });

  await t.step(
    "should filter undefined values from string reference",
    () => {
      const actual = ParamReference("hello", undefined, "world");

      assertEquals(actual.toString(), "{{hello.world}}");
      assertEquals(actual.toJSON(), "{{hello.world}}");
    },
  );
});
