## Types

Custom Types provide a way to introduce reusable, sharable types to Apps.

### Defining a Type

Types can be defined with the top level `DefineType` export. Below is an example
of setting up a custom Type used for setting shared boundaries on strings.

```ts
const LimitedStringType = DefineType({
  callback_id: "limited_string",
  title: "String with length restrictions",
  description: "Use this to provide boundaries to your string",
  type: Schema.types.string,
  minLength: 3,
  maxLength: 8
}
```

### Registering a Type to the App

To register the newly defined type, add it to the array assigned to the `types`
parameter while defining the [`Manifest`][manifest].

Note: All Custom Types **must** be registered to the [Manifest][manifest] in
order for them to be used, but any types referenced by existing
[`functions`][functions], [`datastores`][datastores], or other types will be
registered automatically.

```ts
Manifest({
  ...
  types: [IncidentType],
});
```

### Referencing Types

To use a type as a [function][functions] parameter, set the parameter's `type`
property to the Type it should reference.

```js
input_parameters: {
  secret: : {
    title: 'A Special String',
    type: LimitedStringType
  }
   ...
}
```

_In the provided example the title from the Custom Type is being overridden_

[functions]: ./functions.md
[manifest]: ./manifest.md
[datastores]: ./datastores.md
