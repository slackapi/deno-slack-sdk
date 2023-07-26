import {
  createDuplicateCustomEventError,
  createDuplicateCustomTypeError,
  createDuplicateDataStoreError,
  createDuplicateFunctionError,
  createDuplicateProviderError,
  createDuplicateWorkflowError,
} from "./errors.ts";
import {
  ManifestCustomEventSchema,
  ManifestCustomTypeSchema,
  ManifestDatastoreSchema,
  ManifestFunctionSchema,
  ManifestOAuth2ProviderSchema,
  ManifestWorkflowSchema,
} from "./manifest_schema.ts";
import { assertStringIncludes } from "../dev_deps.ts";
import { Schema } from "../mod.ts";

const OLD_SCHEMA_TITLE = "old";
const OLD_SCHEMA_DESCRIPTION = "This is an old schema";
const CURRENT_SCHEMA_TITLE = "current";
const CURRENT_SCHEMA_DESCRIPTION = "This is a current schema";

Deno.test(createDuplicateWorkflowError.name, async (t) => {
  const old: ManifestWorkflowSchema = {
    title: OLD_SCHEMA_TITLE,
    description: OLD_SCHEMA_DESCRIPTION,
    steps: [],
  };

  await t.step(
    "returns proper Error when populated objects are passed",
    () => {
      const current: ManifestWorkflowSchema = {
        title: CURRENT_SCHEMA_TITLE,
        description: CURRENT_SCHEMA_DESCRIPTION,
        steps: [],
      };

      const actual = createDuplicateWorkflowError({ id: "test", current, old });

      assertStringIncludes(actual.message, `callback_id: "test"`);
      assertStringIncludes(actual.message, "Workflow");
      assertStringIncludes(actual.message, `"title": "${OLD_SCHEMA_TITLE}"`);
      assertStringIncludes(
        actual.message,
        `"title": "${CURRENT_SCHEMA_TITLE}"`,
      );
      assertStringIncludes(
        actual.message,
        `"description": "${OLD_SCHEMA_DESCRIPTION}"`,
      );
      assertStringIncludes(
        actual.message,
        `"description": "${CURRENT_SCHEMA_DESCRIPTION}"`,
      );
    },
  );

  await t.step(
    "return proper Error when objects are passed with missing data",
    () => {
      const current: ManifestWorkflowSchema = {
        steps: [],
      };

      const actual = createDuplicateWorkflowError({ id: "test", current, old });

      assertStringIncludes(actual.message, `callback_id: "test"`);
      assertStringIncludes(actual.message, `"title": ""`);
      assertStringIncludes(actual.message, `"description": ""`);
    },
  );
});

Deno.test(createDuplicateFunctionError.name, async (t) => {
  const old: ManifestFunctionSchema = {
    title: OLD_SCHEMA_TITLE,
    description: OLD_SCHEMA_DESCRIPTION,
    source_file: "test.ts",
    input_parameters: { properties: {} },
    output_parameters: { properties: {} },
  };

  await t.step(
    "returns proper Error when populated objects are passed",
    () => {
      const current: ManifestFunctionSchema = {
        title: CURRENT_SCHEMA_TITLE,
        description: CURRENT_SCHEMA_DESCRIPTION,
        source_file: "test.ts",
        input_parameters: { properties: {} },
        output_parameters: { properties: {} },
      };

      const actual = createDuplicateFunctionError({ id: "test", current, old });

      assertStringIncludes(actual.message, `callback_id: "test"`);
      assertStringIncludes(actual.message, "Function");
      assertStringIncludes(actual.message, `"title": "${OLD_SCHEMA_TITLE}"`);
      assertStringIncludes(
        actual.message,
        `"title": "${CURRENT_SCHEMA_TITLE}"`,
      );
      assertStringIncludes(
        actual.message,
        `"description": "${CURRENT_SCHEMA_DESCRIPTION}"`,
      );
      assertStringIncludes(
        actual.message,
        `"description": "${OLD_SCHEMA_DESCRIPTION}"`,
      );
      assertStringIncludes(actual.message, `"source_file": "test.ts"`);
    },
  );

  await t.step(
    "return proper Error when objects are passed with missing data",
    () => {
      const current: ManifestFunctionSchema = {
        source_file: "test.ts",
        input_parameters: { properties: {} },
        output_parameters: { properties: {} },
      };

      const actual = createDuplicateFunctionError({ id: "test", current, old });

      assertStringIncludes(actual.message, `callback_id: "test"`);
      assertStringIncludes(actual.message, `"title": ""`);
      assertStringIncludes(actual.message, `"description": ""`);
    },
  );
});

Deno.test(createDuplicateCustomTypeError.name, async (t) => {
  const old: ManifestCustomTypeSchema = {
    type: "string",
    title: OLD_SCHEMA_TITLE,
    description: OLD_SCHEMA_DESCRIPTION,
  };

  await t.step(
    "returns proper Error when populated objects are passed",
    () => {
      const current: ManifestCustomTypeSchema = {
        type: "string",
        title: CURRENT_SCHEMA_TITLE,
        description: CURRENT_SCHEMA_DESCRIPTION,
      };

      const actual = createDuplicateCustomTypeError({
        id: "test",
        current,
        old,
      });

      assertStringIncludes(actual.message, `name: "test"`);
      assertStringIncludes(actual.message, "CustomType");
      assertStringIncludes(actual.message, `"title": "${OLD_SCHEMA_TITLE}"`);
      assertStringIncludes(
        actual.message,
        `"title": "${CURRENT_SCHEMA_TITLE}"`,
      );
      assertStringIncludes(
        actual.message,
        `"description": "${OLD_SCHEMA_DESCRIPTION}"`,
      );
      assertStringIncludes(
        actual.message,
        `"description": "${CURRENT_SCHEMA_DESCRIPTION}"`,
      );
      assertStringIncludes(actual.message, `"type": "string"`);
    },
  );

  await t.step(
    "return proper Error when objects are passed with missing data",
    () => {
      const current: ManifestCustomTypeSchema = {
        type: "string",
      };

      const actual = createDuplicateCustomTypeError({
        id: "test",
        current,
        old,
      });

      assertStringIncludes(actual.message, `name: "test"`);
      assertStringIncludes(actual.message, `"title": ""`);
      assertStringIncludes(actual.message, `"description": ""`);
    },
  );
});

Deno.test(createDuplicateDataStoreError.name, async (t) => {
  const old: ManifestDatastoreSchema = {
    primary_key: OLD_SCHEMA_TITLE,
    attributes: {
      old: {
        type: "string",
      },
    },
  };

  await t.step(
    "returns proper Error when populated objects are passed",
    () => {
      const current: ManifestDatastoreSchema = {
        primary_key: CURRENT_SCHEMA_TITLE,
        attributes: {
          current: {
            type: "string",
          },
        },
      };

      const actual = createDuplicateDataStoreError({
        name: "test",
        current,
        old,
      });

      assertStringIncludes(actual.message, `name: "test"`);
      assertStringIncludes(actual.message, "DataStore");
      assertStringIncludes(
        actual.message,
        `"primary_key":"${OLD_SCHEMA_TITLE}"`,
      );
      assertStringIncludes(
        actual.message,
        `"primary_key":"${CURRENT_SCHEMA_TITLE}"`,
      );
      assertStringIncludes(actual.message, `"attributes":["old"]`);
      assertStringIncludes(actual.message, `"attributes":["current"]`);
    },
  );

  await t.step(
    "return proper Error when objects are passed with missing data",
    () => {
      const current: ManifestDatastoreSchema = {
        primary_key: CURRENT_SCHEMA_TITLE,
        attributes: {},
      };

      const actual = createDuplicateDataStoreError({
        name: "test",
        current,
        old,
      });

      assertStringIncludes(actual.message, `name: "test"`);
      assertStringIncludes(actual.message, `"attributes":[]`);
    },
  );
});

Deno.test(createDuplicateCustomEventError.name, async (t) => {
  const old: ManifestCustomEventSchema = {
    type: "string",
    title: OLD_SCHEMA_TITLE,
    description: OLD_SCHEMA_DESCRIPTION,
  };

  await t.step(
    "returns proper Error when populated objects are passed",
    () => {
      const current: ManifestCustomEventSchema = {
        type: "string",
        title: CURRENT_SCHEMA_TITLE,
        description: CURRENT_SCHEMA_DESCRIPTION,
      };

      const actual = createDuplicateCustomEventError({
        id: "test",
        current,
        old,
      });

      assertStringIncludes(actual.message, `name: "test"`);
      assertStringIncludes(actual.message, "CustomEvent");
      assertStringIncludes(actual.message, `"title": "${OLD_SCHEMA_TITLE}"`);
      assertStringIncludes(
        actual.message,
        `"title": "${CURRENT_SCHEMA_TITLE}"`,
      );
      assertStringIncludes(
        actual.message,
        `"description": "${OLD_SCHEMA_DESCRIPTION}"`,
      );
      assertStringIncludes(
        actual.message,
        `"description": "${CURRENT_SCHEMA_DESCRIPTION}"`,
      );
      assertStringIncludes(actual.message, `"type": "string"`);
    },
  );

  await t.step(
    "return proper Error when objects are passed with missing data",
    () => {
      const current: ManifestCustomEventSchema = {
        type: "string",
      };

      const actual = createDuplicateCustomEventError({
        id: "test",
        current,
        old,
      });

      assertStringIncludes(actual.message, `name: "test"`);
      assertStringIncludes(actual.message, `"title": ""`);
      assertStringIncludes(actual.message, `"description": ""`);
    },
  );
});

Deno.test(createDuplicateProviderError.name, async (t) => {
  const old: ManifestOAuth2ProviderSchema = {
    provider_type: Schema.providers.oauth2.CUSTOM,
    options: { old: "test" },
  };

  await t.step(
    "returns proper Error when populated objects are passed",
    () => {
      const current: ManifestOAuth2ProviderSchema = {
        provider_type: Schema.providers.oauth2.CUSTOM,
        options: { current: "test" },
      };

      const actual = createDuplicateProviderError({
        id: "test",
        current,
        old,
      });

      assertStringIncludes(actual.message, `provider_key: "test"`);
      assertStringIncludes(actual.message, "OAuth2Provider");
      assertStringIncludes(
        actual.message,
        `"provider_type":"${Schema.providers.oauth2.CUSTOM}"`,
      );
      assertStringIncludes(actual.message, `"options":["old"]`);
      assertStringIncludes(actual.message, `"options":["current"]`);
    },
  );

  await t.step(
    "return proper Error when objects are passed with missing data",
    () => {
      const current: ManifestOAuth2ProviderSchema = {
        provider_type: Schema.providers.oauth2.CUSTOM,
        options: {},
      };

      const actual = createDuplicateProviderError({
        id: "test",
        current,
        old,
      });

      assertStringIncludes(actual.message, `provider_key: "test"`);
      assertStringIncludes(
        actual.message,
        `"provider_type":"${Schema.providers.oauth2.CUSTOM}"`,
      );
      assertStringIncludes(actual.message, `"options":[]`);
    },
  );
});
