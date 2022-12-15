export {
  assertEquals,
  assertExists,
  assertMatch,
  assertRejects,
  assertStrictEquals,
} from "https://deno.land/std@0.152.0/testing/asserts.ts";
export * as mock from "https://deno.land/std@0.152.0/testing/mock.ts";

export { assert } from "https://deno.land/x/conditional_type_checks@1.0.6/mod.ts";
export type {
  IsAny,
  IsExact,
} from "https://deno.land/x/conditional_type_checks@1.0.6/mod.ts";

/**
 * Checks whether T includes U.
 */
export type CanBe<T, U> = Extract<T, U> extends never ? false : true;
/**
 * Checks whether T can never include U.
 */
export type CannotBe<T, U> = Extract<T, U> extends never ? true : false;
/**
 * Checks whether the provided type parameter allows to be undefined.
 * Useful for checking optionality.
 */
export type CanBeUndefined<T> = CanBe<T, undefined> extends true ? true
  : false;
export type CannotBeUndefined<T> = CannotBe<T, undefined> extends true ? true
  : false;
