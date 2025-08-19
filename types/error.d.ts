interface ErrorConstructor {
  new (message?: string, options?: unknown): Error;
  new (message?: string, cause?: Error): Error;
  new (message?: string, fileName?: string, lineNumber?: number): Error;
}

interface AbortController {
  [Symbol.dispose](): void;
}
