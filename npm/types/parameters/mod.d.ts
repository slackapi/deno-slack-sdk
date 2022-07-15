import type { CustomTypeParameterDefinition, TypedObjectParameterDefinition, TypedParameterDefinition, UntypedObjectParameterDefinition } from "./types.js";
export declare type ParameterDefinition = TypedParameterDefinition;
export declare type ParameterSetDefinition = {
    [key: string]: ParameterDefinition;
};
export declare type PossibleParameterKeys<ParameterSetInternal extends ParameterSetDefinition> = (keyof ParameterSetInternal)[];
export declare type ParameterPropertiesDefinition<Parameters extends ParameterSetDefinition, Required extends PossibleParameterKeys<Parameters>> = {
    properties: Parameters;
    required: Required;
};
export declare type ParameterVariableType<Def extends ParameterDefinition> = Def extends CustomTypeParameterDefinition ? ParameterVariableType<Def["type"]["definition"]> : Def extends TypedObjectParameterDefinition ? ObjectParameterVariableType<Def> : Def extends UntypedObjectParameterDefinition ? UntypedObjectParameterVariableType : SingleParameterVariable;
declare type SingleParameterVariable = {};
declare type UntypedObjectParameterVariableType = any;
declare type ObjectParameterPropertyTypes<Def extends TypedObjectParameterDefinition> = {
    [name in keyof Def["properties"]]: ParameterVariableType<Def["properties"][name]>;
};
declare type ObjectParameterVariableType<Def extends TypedObjectParameterDefinition> = Def["additionalProperties"] extends true ? ObjectParameterPropertyTypes<Def> & {
    [key: string]: any;
} : ObjectParameterPropertyTypes<Def>;
export declare const ParameterVariable: <P extends TypedParameterDefinition>(namespace: string, paramName: string, definition: P) => ParameterVariableType<P>;
export declare const CreateUntypedObjectParameterVariable: (namespace: string, paramName: string) => UntypedObjectParameterVariableType;
export {};
