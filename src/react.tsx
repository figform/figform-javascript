import * as React from "react";
import { FigFormOptions, resolveOptions } from "./options";
import { createScript, existsScript, unmountScript } from "./script";

export interface FigFormProps extends FigFormOptions {
  id: string;
}

export function FigForm({ id, ...options }: Readonly<FigFormProps>): React.ReactNode {
  const mountRef = React.useRef<HTMLSpanElement>(null);
  const parentRef = React.useRef<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    if (mountRef.current !== null && mountRef.current.parentElement !== null) {
      parentRef.current = mountRef.current.parentElement;
      mountRef.current.remove();
    }
  }, []);

  React.useEffect(() => {
    const resolvedOptions = resolveOptions(options, parentRef.current);
    const url = `${resolvedOptions.baseUrl}/f/${id}`;

    if (!existsScript(id, url)) {
      createScript(url, resolvedOptions.parent);
    }

    return () => {
      unmountScript(url);
    };
  }, [id, options]);

  return <span id={`figform-${id}`} ref={mountRef} style={{ display: "none" }} />;
}

export type { FigFormOptions };
