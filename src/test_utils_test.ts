import { assertExists } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { assert, fail } from "./dev_deps.ts";
import {
  assertEqualsTypedValues,
  CanBe,
  CanBeUndefined,
  CannotBe,
  CannotBeUndefined,
} from "./test_utils.ts";

Deno.test("CanBe", async (t) => {
  const T = {
    test: "",
    notIncluded: "",
  };

  const U = {
    test: "",
  };

  await t.step(
    `should be true when ${Object(T).name} includes ${Object(U).name}`,
    () => {
      assert<CanBe<typeof T, typeof U>>(true);
    },
  );

  await t.step(
    `should be false when ${Object(U).name} does not include ${Object(T).name}`,
    () => {
      assert<CanBe<typeof U, typeof T>>(false);
    },
  );
});

Deno.test("CannotBe", async (t) => {
  const T = {
    test: "",
    notIncluded: "",
  };

  const U = {
    test: "",
  };

  await t.step(
    `should be true when ${Object(U).name} can never include ${Object(T).name}`,
    () => {
      assert<CannotBe<typeof U, typeof T>>(true);
    },
  );

  await t.step(
    `should be false when ${Object(U).name} does not include ${Object(T).name}`,
    () => {
      assert<CannotBe<typeof T, typeof U>>(false);
    },
  );
});

Deno.test("CanBeUndefined", async (t) => {
  await t.step("should be true when variable can be undefined", () => {
    const canBeUndefined: string | undefined = undefined;
    assert<CanBeUndefined<typeof canBeUndefined>>(true);
  });

  await t.step("should be false when variable cannot be undefined", () => {
    const cannotBeUndefined = "";
    assert<CanBeUndefined<typeof cannotBeUndefined>>(false);
  });
});

Deno.test("CannotBeUndefined", async (t) => {
  await t.step("should be true when variable can not be undefined", () => {
    const cannotBeUndefined = "";
    assert<CannotBeUndefined<typeof cannotBeUndefined>>(true);
  });

  await t.step("should be false when variable cannot be undefined", () => {
    const canBeUndefined: string | undefined = undefined;
    assert<CannotBeUndefined<typeof canBeUndefined>>(false);
  });
});

Deno.test(assertEqualsTypedValues.name, async (t) => {
  type T = {
    output?: {
      out: boolean;
    };
  };

  await t.step(
    "should assert true when object follow the same type and value",
    () => {
      const typedValue: T = {
        output: {
          out: true,
        },
      };
      assertEqualsTypedValues(typedValue, {
        output: {
          out: true,
        },
      });
    },
  );

  await t.step(
    "should raise error when objects do not follow the same type and value",
    () => {
      const typedValue: T = {
        output: {
          out: true,
        },
      };

      try {
        assertEqualsTypedValues(typedValue, {
          output: {
            out: false,
          },
        });
        fail(`${assertEqualsTypedValues} should have raised an exception`);
      } catch (error) {
        assertExists(error);
      }
    },
  );
});
