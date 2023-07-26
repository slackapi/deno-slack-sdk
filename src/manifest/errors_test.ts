import {
  DuplicateCustomEventError,
  DuplicateCustomTypeError,
  DuplicateDatastoreError,
  DuplicateFunctionError,
  DuplicateProviderError,
  DuplicateWorkflowError,
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

Deno.test(DuplicateWorkflowError.name, async (t) => {
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

      const actual = new DuplicateWorkflowError("test", current, old);

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

      const actual = new DuplicateWorkflowError("test", current, old);

      assertStringIncludes(actual.message, `callback_id: "test"`);
      assertStringIncludes(actual.message, `"title": ""`);
      assertStringIncludes(actual.message, `"description": ""`);
    },
  );
});

Deno.test(DuplicateFunctionError.name, async (t) => {
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

      const actual = new DuplicateFunctionError("test", current, old);

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

      const actual = new DuplicateFunctionError("test", current, old);

      assertStringIncludes(actual.message, `callback_id: "test"`);
      assertStringIncludes(actual.message, `"title": ""`);
      assertStringIncludes(actual.message, `"description": ""`);
    },
  );
});

Deno.test(DuplicateCustomTypeError.name, async (t) => {
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

      const actual = new DuplicateCustomTypeError("test", current, old);

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

      const actual = new DuplicateCustomTypeError("test", current, old);

      assertStringIncludes(actual.message, `name: "test"`);
      assertStringIncludes(actual.message, `"title": ""`);
      assertStringIncludes(actual.message, `"description": ""`);
    },
  );
});

Deno.test(DuplicateDatastoreError.name, async (t) => {
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

      const actual = new DuplicateDatastoreError("test", current, old);

      assertStringIncludes(actual.message, `name: "test"`);
      assertStringIncludes(actual.message, "Datastore");
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

      const actual = new DuplicateDatastoreError("test", current, old);

      assertStringIncludes(actual.message, `name: "test"`);
      assertStringIncludes(actual.message, `"attributes":[]`);
    },
  );
});

Deno.test(DuplicateCustomEventError.name, async (t) => {
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

      const actual = new DuplicateCustomEventError("test", current, old);

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

      const actual = new DuplicateCustomEventError("test", current, old);

      assertStringIncludes(actual.message, `name: "test"`);
      assertStringIncludes(actual.message, `"title": ""`);
      assertStringIncludes(actual.message, `"description": ""`);
    },
  );
});

Deno.test(DuplicateProviderError.name, async (t) => {
  const old: ManifestOAuth2ProviderSchema = {
    provider_type: Schema.providers.oauth2.CUSTOM,
    options: {
      provider_name: OLD_SCHEMA_TITLE,
      authorization_url: OLD_SCHEMA_DESCRIPTION,
      client_id: OLD_SCHEMA_TITLE,
      scope: [],
    },
  };

  await t.step(
    "returns proper Error when populated objects are passed",
    () => {
      const current: ManifestOAuth2ProviderSchema = {
        provider_type: Schema.providers.oauth2.CUSTOM,
        options: {
          provider_name: CURRENT_SCHEMA_TITLE,
          authorization_url: CURRENT_SCHEMA_DESCRIPTION,
          client_id: CURRENT_SCHEMA_TITLE,
          scope: [],
        },
      };

      const actual = new DuplicateProviderError("test", current, old);

      assertStringIncludes(actual.message, `provider_key: "test"`);
      assertStringIncludes(actual.message, "OAuth2Provider");
      assertStringIncludes(
        actual.message,
        `"provider_type": "${Schema.providers.oauth2.CUSTOM}"`,
      );
      assertStringIncludes(
        actual.message,
        `"provider_name": "${CURRENT_SCHEMA_TITLE}"`,
      );
      assertStringIncludes(
        actual.message,
        `"provider_name": "${OLD_SCHEMA_TITLE}"`,
      );
      assertStringIncludes(
        actual.message,
        `"authorization_url": "${OLD_SCHEMA_DESCRIPTION}"`,
      );
      assertStringIncludes(
        actual.message,
        `"authorization_url": "${CURRENT_SCHEMA_DESCRIPTION}"`,
      );
    },
  );

  await t.step(
    "return proper Error when objects are passed with missing data",
    () => {
      const current: ManifestOAuth2ProviderSchema = {
        provider_type: Schema.providers.oauth2.CUSTOM,
        options: {
          client_id: CURRENT_SCHEMA_TITLE,
          scope: [],
        },
      };

      const actual = new DuplicateProviderError("test", current, old);

      assertStringIncludes(actual.message, `provider_key: "test"`);
      assertStringIncludes(actual.message, `"provider_name": ""`);
      assertStringIncludes(actual.message, `"authorization_url": ""`);
    },
  );
});
