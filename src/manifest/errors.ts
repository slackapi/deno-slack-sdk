export class DuplicateCallbackIdError extends Error {
  constructor(
    callbackId: string,
    readableType: "Function" | "Workflow" | "Widget",
  ) {
    super(`Duplicate callback_id: "${callbackId}" found in ${readableType}.`);
  }
}

export class DuplicateNameError extends Error {
  constructor(
    name: string,
    readableType: "CustomType" | "Datastore" | "CustomEvent",
  ) {
    super(`Duplicate name: "${name}" found in ${readableType}.`);
  }
}

export class DuplicateProviderKeyError extends Error {
  constructor(provider_key: string, readableType: "OAuth2Provider") {
    super(
      `Duplicate provider_key: "${provider_key}" found in ${readableType}.`,
    );
  }
}
