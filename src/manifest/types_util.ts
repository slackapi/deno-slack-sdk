/** Utility types to enable conversion of type properties to camelCase
 *
 * This is a shameless lift from sindresorhus's awesome type-fest project
 *
 * https://github.com/sindresorhus/type-fest
 *
 * Imported simply because it hasn't been distributed to deno.land yet
 * Please support this project!
 */

type Split<
  S extends string,
  Delimiter extends string,
> = S extends `${infer Head}${Delimiter}${infer Tail}`
  ? [Head, ...Split<Tail, Delimiter>]
  : S extends Delimiter ? []
  : [S];

//deno-fmt-ignore
type CamelCase<K> = K extends string ? CamelCaseStringArray<
  Split<K extends Uppercase<K> ? Lowercase<K> : K, "-" | "_" | " ">
>
  : K;
//deno-fmt-ignore
type CamelCaseStringArray<Parts extends readonly string[]> = Parts extends
  [`${infer FirstPart}`, ...infer RemainingParts] ? Uncapitalize<
  `${FirstPart}${InnerCamelCaseStringArray<RemainingParts, FirstPart>}`
>
  : never;

// deno-lint-ignore no-explicit-any
type InnerCamelCaseStringArray<Parts extends readonly any[], PreviousPart> =
  Parts extends [`${infer FirstPart}`, ...infer RemainingParts]
    ? FirstPart extends undefined ? ""
    : FirstPart extends ""
      ? InnerCamelCaseStringArray<RemainingParts, PreviousPart>
    : `${PreviousPart extends "" ? FirstPart
      : Capitalize<FirstPart>}${InnerCamelCaseStringArray<
      RemainingParts,
      FirstPart
    >}`
    : "";

// deno-lint-ignore ban-types
export type CamelCasedPropertiesDeep<Value> = Value extends Function ? Value
  : Value extends Array<infer U> ? Array<CamelCasedPropertiesDeep<U>>
  : Value extends Set<infer U> ? Set<CamelCasedPropertiesDeep<U>>
  : {
    [K in keyof Value as CamelCase<K>]: CamelCasedPropertiesDeep<Value[K]>;
  };
