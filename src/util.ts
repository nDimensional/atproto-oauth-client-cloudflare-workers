// eslint-disable-next-line @typescript-eslint/ban-types
export type Simplify<T> = { [K in keyof T]: T[K] } & {};
export type Override<T, V> = Simplify<V & Omit<T, keyof V>>;

export interface SystemError extends Error {
  code: string;
}

export function isSystemError(error: any): error is SystemError {
  return (
    typeof error === "object" &&
    typeof error.code === "string" &&
    error instanceof Error
  );
}
