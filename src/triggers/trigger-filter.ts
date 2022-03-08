export const TRIGGER_FILTER_VERSION_DEFAULT = 1;
export type TriggerFilter = {
  version?: number;
  root: TriggerFilterDefinition;
};

export type TriggerFilterDefinition =
  | TriggerFilterBooleanLogic
  | TriggerFilterComparator;

export const TriggerFilterOperatorType = {
  AND: "AND",
  OR: "OR",
  NOT: "NOT",
} as const;

type TriggerFilterOperatorTypeValues =
  typeof TriggerFilterOperatorType[keyof typeof TriggerFilterOperatorType];

type TriggerFilterBooleanLogic = {
  operator: TriggerFilterOperatorTypeValues;
  inputs: TriggerFilterDefinition[];
};

type TriggerFilterComparator = {
  statement: string;
};

export const normalizeTriggerFilterDefinition = (
  filter: TriggerFilter | TriggerFilterDefinition,
): TriggerFilter => {
  // This might be a fully-wrapped trigger definition, or the root
  // for ease-of use we let devs just pass back the root, and wrap it for them w/ a default version
  let normalizedFilter: TriggerFilter | null = null;

  // Full filter was provided
  if ("root" in filter) {
    normalizedFilter = filter as TriggerFilter;
    // just the root was provided, wrap it w/ full definition
  } else {
    normalizedFilter = {
      root: filter as TriggerFilterDefinition,
    };
  }

  // Ensure a version is set
  if (!normalizedFilter.version) {
    normalizedFilter.version = TRIGGER_FILTER_VERSION_DEFAULT;
  }

  return normalizedFilter;
};
