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
