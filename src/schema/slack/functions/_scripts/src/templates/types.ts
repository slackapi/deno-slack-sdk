import { ICustomType } from "../../../../../../types/types.ts";

export type AllowedTypeValue = ICustomType | string;
export type AllowedTypeValueObject = Record<string, AllowedTypeValue>;
