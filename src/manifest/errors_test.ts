import {
  DuplicateCallbackIdError,
  DuplicateNameError,
  DuplicateProviderKeyError,
} from "./errors.ts";
import { assertStringIncludes } from "../dev_deps.ts";

Deno.test(`${DuplicateCallbackIdError.name} returns proper error message`, () => {
  const actual = new DuplicateCallbackIdError("test", "Function");

  assertStringIncludes(actual.message, `callback_id: "test`);
  assertStringIncludes(actual.message, "Function");
});

Deno.test(`${DuplicateNameError.name} returns proper error message`, () => {
  const actual = new DuplicateNameError("test", "CustomType");

  assertStringIncludes(actual.message, `name: "test`);
  assertStringIncludes(actual.message, "CustomType");
});

Deno.test(`${DuplicateProviderKeyError.name} returns proper error message`, () => {
  const actual = new DuplicateProviderKeyError("test", "OAuth2Provider");

  assertStringIncludes(actual.message, `provider_key: "test`);
  assertStringIncludes(actual.message, "OAuth2Provider");
});
