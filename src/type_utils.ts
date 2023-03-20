/** @description Defines accepted recursion depth values */
export type RecursionDepthLevel = 0 | 1 | 2 | 3 | 4 | 5;

/** @description Defines the maximum number of times we allow for recursion */
export type MaxRecursionDepth = 5;

/** @description Increases the recursion depth value one at a time */
export type IncreaseDepth<Depth extends RecursionDepthLevel = 0> = Depth extends
  0 ? 1
  : Depth extends 1 ? 2
  : Depth extends 2 ? 3
  : Depth extends 3 ? 4
  : Depth extends 4 ? 5
  : Depth extends 5 ? MaxRecursionDepth
  : MaxRecursionDepth;

// deno-lint-ignore no-explicit-any
export type UnknownRuntimeType = any;
