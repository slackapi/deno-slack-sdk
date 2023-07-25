import {
  createDuplicateFunctionError,
  createDuplicateWorkflowError,
} from "./errors.ts";
import {
  ManifestFunctionSchema,
  ManifestWorkflowSchema,
} from "./manifest_schema.ts";
import { assertStringIncludes } from "../dev_deps.ts";

Deno.test(createDuplicateWorkflowError.name, async (t) => {
  const old: ManifestWorkflowSchema = {
    title: "old",
    description: "This is an old schema",
    steps: [],
  };

  await t.step(
    "returns proper Error when populated workflows are passed",
    () => {
      const current: ManifestWorkflowSchema = {
        title: "current",
        description: "This is a current schema",
        steps: [],
      };

      const actual = createDuplicateWorkflowError({ id: "test", current, old });

      assertStringIncludes(actual.message, `callback_id: "test"`);
      assertStringIncludes(actual.message, "Workflow");
      assertStringIncludes(actual.message, `"title":"current"`);
      assertStringIncludes(actual.message, `"title":"old"`);
      assertStringIncludes(
        actual.message,
        `"description":"This is a current schema"`,
      );
      assertStringIncludes(
        actual.message,
        `"description":"This is an old schema"`,
      );
    },
  );

  await t.step(
    "returns proper Error when partially populated workflows are passed",
    () => {
      const current: ManifestWorkflowSchema = {
        steps: [],
      };

      const actual = createDuplicateWorkflowError({ id: "test", current, old });

      assertStringIncludes(actual.message, `callback_id: "test"`);
      assertStringIncludes(actual.message, `"title":""`);
      assertStringIncludes(actual.message, `"description":""`);
    },
  );
});

Deno.test(createDuplicateFunctionError.name, async (t) => {
  const old: ManifestFunctionSchema = {
    title: "old",
    description: "This is an old schema",
    source_file: "test.ts",
    input_parameters: { properties: {} },
    output_parameters: { properties: {} },
  };

  await t.step(
    "returns proper Error when populated functions are passed",
    () => {
      const current: ManifestFunctionSchema = {
        title: "current",
        description: "This is a current schema",
        source_file: "test.ts",
        input_parameters: { properties: {} },
        output_parameters: { properties: {} },
      };

      const actual = createDuplicateFunctionError({ id: "test", current, old });

      assertStringIncludes(actual.message, `callback_id: "test"`);
      assertStringIncludes(actual.message, "Function");
      assertStringIncludes(actual.message, `"title":"current"`);
      assertStringIncludes(actual.message, `"title":"old"`);
      assertStringIncludes(
        actual.message,
        `"description":"This is a current schema"`,
      );
      assertStringIncludes(
        actual.message,
        `"description":"This is an old schema"`,
      );
      assertStringIncludes(
        actual.message,
        `"source_file":"test.ts"`,
      );
    },
  );

  await t.step(
    "return proper Error when workflows are passed with missing data",
    () => {
      const current: ManifestFunctionSchema = {
        source_file: "test.ts",
        input_parameters: { properties: {} },
        output_parameters: { properties: {} },
      };

      const actual = createDuplicateFunctionError({ id: "test", current, old });

      assertStringIncludes(actual.message, `callback_id: "test"`);
      assertStringIncludes(actual.message, `"title":""`);
      assertStringIncludes(actual.message, `"description":""`);
    },
  );
});
