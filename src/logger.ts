enum LogLevel {
  NONE = 0,
  DEBUG = 10,
  INFO = 20,
  WARN = 30,
  ERROR = 40,
  FATAL = 50,
}

export function debug<T>(
  msg: (T extends (...args: unknown[]) => unknown ? never : T) | (() => T),
): string {
  return write(msg, LogLevel.DEBUG);
}

export function info<T>(
  msg: (T extends (...args: unknown[]) => unknown ? never : T) | (() => T),
): string {
  return write(msg, LogLevel.INFO);
}

export function warn<T>(
  msg: (T extends (...args: unknown[]) => unknown ? never : T) | (() => T),
): string {
  return write(msg, LogLevel.WARN);
}

export function error<T>(
  msg: (T extends (...args: unknown[]) => unknown ? never : T) | (() => T),
): string {
  return write(msg, LogLevel.ERROR);
}

export function fatal<T>(
  msg: (T extends (...args: unknown[]) => unknown ? never : T) | (() => T),
): string {
  return write(msg, LogLevel.FATAL);
}

function write<T>(
  msg: (T extends (...args: unknown[]) => unknown ? never : T) | (() => T),
  level: LogLevel,
): string {
  let res: T | undefined;
  let logMessage: string;

  if (msg instanceof Function) {
    res = msg();
    logMessage = toString(res);
  } else {
    logMessage = toString(msg);
  }

  const formattedLog =
    `{"loggerName":"slack","msg":"${logMessage}","level":${level},"datetime":"${
      new Date().toISOString()
    }"}`;

  console.log(formattedLog);

  return formattedLog;
}

function toString(obj: unknown): string {
  if (typeof obj === "string") {
    return obj;
  } else if (
    obj === null ||
    typeof obj === "number" ||
    typeof obj === "bigint" ||
    typeof obj === "boolean" ||
    typeof obj === "undefined" ||
    typeof obj === "symbol"
  ) {
    return String(obj);
  } else if (typeof obj === "object") {
    return JSON.stringify(obj);
  }
  return "undefined";
}
