import * as React from "react";

export function useShallowMemo<T extends Record<string, unknown>>(obj: T): T {
  const ref = React.useRef<T>(obj);

  const hasChanged =
    Object.keys(obj).length !== Object.keys(ref.current).length ||
    Object.keys(obj).some((key) => obj[key] !== ref.current[key]);

  if (hasChanged) {
    ref.current = obj;
  }

  return ref.current;
}
