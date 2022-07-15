/**
 * Asserts at compile time that the provided type argument's type resolves to the expected boolean literal type.
 * @param expectTrue - True if the passed in type argument resolved to true.
 */
export declare function assert<T extends true | false>(expectTrue: T): void;
/**
 * Asserts at compile time that the provided type argument's type resolves to true.
 */
export declare type AssertTrue<T extends true> = never;
/**
 * Asserts at compile time that the provided type argument's type resolves to false.
 */
export declare type AssertFalse<T extends false> = never;
/**
 * Asserts at compile time that the provided type argument's type resolves to the expected boolean literal type.
 */
export declare type Assert<T extends true | false, Expected extends T> = never;
/**
 * Checks if type `T` has the specified type `U`.
 */
export declare type Has<T, U> = IsAny<T> extends true ? true : IsAny<U> extends true ? false : Extract<T, U> extends never ? false : true;
/**
 * Checks if type `T` does not have the specified type `U`.
 */
export declare type NotHas<T, U> = Has<T, U> extends false ? true : false;
/**
 * Checks if type `T` is possibly null or undefined.
 */
export declare type IsNullable<T> = Extract<T, null | undefined> extends never ? false : true;
/**
 * Checks if type `T` exactly matches type `U`.
 */
export declare type IsExact<T, U> = TupleMatches<AnyToBrand<T>, AnyToBrand<U>> extends true ? TupleMatches<DeepPrepareIsExact<T>, DeepPrepareIsExact<U>> extends true ? true : false : false;
declare type DeepPrepareIsExact<T, VisitedTypes = never> = {
    [P in keyof T]-?: IsAny<T[P]> extends true ? AnyBrand : DeepPrepareIsExactProp<T[P], T, VisitedTypes>;
};
declare type DeepPrepareIsExactProp<Prop, Parent, VisitedTypes> = Prop extends VisitedTypes ? Prop : DeepPrepareIsExact<Prop, VisitedTypes | Parent>;
/**
 * Checks if type `T` is the `any` type.
 */
export declare type IsAny<T> = 0 extends (1 & T) ? true : false;
/**
 * Checks if type `T` is the `never` type.
 */
export declare type IsNever<T> = [T] extends [never] ? true : false;
/**
 * Checks if type `T` is the `unknown` type.
 */
export declare type IsUnknown<T> = IsNever<T> extends false ? T extends unknown ? unknown extends T ? IsAny<T> extends false ? true : false : false : false : false;
declare type TupleMatches<T, U> = Matches<[T], [U]>;
declare type Matches<T, U> = T extends U ? U extends T ? true : false : false;
declare type AnyToBrand<T> = IsAny<T> extends true ? AnyBrand : T;
declare type AnyBrand = {
    __conditionalTypeChecksAny__: undefined;
};
export {};
