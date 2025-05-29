import * as React from "react";
import { FormOptions, resolveOptions } from "./options";
import { createScript, existsScript, unmountScript } from "./script";

export interface FigFormProps extends FormOptions {
  id: string;
}

export function FigForm({ id, ...options }: Readonly<FigFormProps>): React.ReactNode {
  const { baseUrl, parent } = React.useMemo(() => resolveOptions(options), [options]);

  React.useEffect(() => {
    const url = `${baseUrl}/f/${id}`;

    if (!existsScript(id, url)) {
      createScript(url, parent);
    }

    return () => {
      unmountScript(url);
    };
  }, [baseUrl, id, parent]);

  return null;
}
