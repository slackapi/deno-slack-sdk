## Types
Custom Types provide a way to introduce reusable, sharable types to Apps.

### Defining a Type

Types can be defined with the top level `DefineType` export. Below is an example of setting up a Custom Type object that usable for incidents.

```ts
const IncidentType = DefineType({
  callback_id: 'incident',
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
}
```

### Registering a Type to the App
To register the newly defined type, add it to the array assigned to the `types` parameter while defining the [`Manifest`][manifest].

Note: All Custom Types **must** be registered to the [Manifest][manifest] in order for them to be used.

```ts
Manifest({
  ...
  types: [IncidentType],
});

```

### Referencing Types
To use a type as a [function][functions] parameter, set the parameter's `type` property to the Type it should reference.

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
