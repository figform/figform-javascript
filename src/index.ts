import { FigFormOptions, resolveOptions } from "./options";
import { createScript } from "./script";

export const FigForm = {
  form: (id: string, options: FigFormOptions): void => {
    const { baseUrl, parent } = resolveOptions(options);
    createScript(`${baseUrl}/f/${id}`, parent);
  },
};

export type { FigFormOptions } from "./options";
