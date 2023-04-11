## Types

Custom Types provide a way to introduce reusable, sharable types to Apps.

### Defining a type

Types can be defined with the top level `DefineType` export. Below is an example
of setting up a custom Type used for incident management.

```ts
const IncidentType = DefineType({
  name: "incident",
  title: "Incident Ticket",
  description: "Use this to enter an Incident Ticket",
  type: Schema.types.object,
  properties: {
    id: {
      type: Schema.types.string,
      minLength: 3,
    },
    title: {
      type: Schema.types.string,
    },
    summary: {
      type: Schema.types.string,
    },
    severity: {
      type: Schema.types.string,
    },
    date_created: {
      type: Schema.types.number,
    },
  },
  required: [],
});
```

### Registering a type with the App

To register the newly defined type, add it to the array assigned to the `types`
parameter while defining the [`Manifest`][manifest].

Note: All Custom Types **must** be registered to the [Manifest][manifest] in
order for them to be used, but any types referenced by existing
[`functions`][functions], [`workflows`][workflows], [`datastores`][datastores], or other types will be
registered automatically.

```ts
Manifest({
  ...
  types: [IncidentType],
});
```

### Referencing types

To use a type as a [function][functions] parameter, set the parameter's `type`
property to the Type it should reference.

```js
input_parameters: {
  incident: : {
    title: 'A Special Incident',
    type: IncidentType
  }
   ...
}
```

_In the provided example the title from the Custom Type is being overridden_

[functions]: ./functions.md
[manifest]: ./manifest.md
[datastores]: ./datastores.md
[workflows]: ./workflows.md
