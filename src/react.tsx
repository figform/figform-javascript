import * as React from "react";
import { FigFormOptions, resolveOptions } from "./options";
import { useShallowMemo } from "./react-hooks";
import { createScript, existsScript, unmountScript } from "./script";
import { buildUrl } from "./utils";

export type { FigFormOptions };

export type FigFormProps = FigFormOptions & {
  id: string;
};

/**
 * FigForm React component that dynamically loads and manages a form script.
 *
 * @param props - The component props
 * @returns A hidden span element used as a mount reference
 *
 * @example
 * ```tsx
 * <FigForm id="FORM_ID" />
 * ```
 */
export function FigForm({ id, ...options }: Readonly<FigFormProps>): React.ReactNode {
  const mountRef = React.useRef<HTMLSpanElement>(null);
  const parentRef = React.useRef<HTMLElement | null>(null);
  const memoizedOptions = useShallowMemo(options);

  React.useLayoutEffect(() => {
    if (mountRef.current !== null && mountRef.current.parentElement !== null) {
      parentRef.current = mountRef.current.parentElement;
      mountRef.current.remove();
    }
  }, []);

  React.useEffect(() => {
    const resolvedOptions = resolveOptions(memoizedOptions, parentRef.current);
    const url = buildUrl(resolvedOptions.baseUrl, id, resolvedOptions);

    if (!existsScript(id, url, resolvedOptions.parent)) {
      createScript(url, resolvedOptions.parent);
    }

    return () => {
      unmountScript(id, url, resolvedOptions.parent);
    };
  }, [id, memoizedOptions]);

  return <span aria-hidden="true" id={`figform-${id}`} ref={mountRef} style={{ display: "none" }} />;
}
