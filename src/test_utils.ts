import { assertEquals } from "./dev_deps.ts";

// deno-lint-ignore ban-types
type IsAny<T> = unknown extends T ? T extends {} ? T : never : never;
type NotAny<T> = T extends IsAny<T> ? never : T;

/** @description Prevents a value of type `any` from being passed into `assertEquals` */
export const assertEqualsTypedValues = <T>(
  actual: NotAny<T>,
  expected: NotAny<T>,
  msg?: string,
): void => assertEquals<T>(actual, expected, msg);

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
