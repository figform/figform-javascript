import { FormOptions, resolveOptions } from "./options";
import { createScript } from "./script";

export const FigForm = {
  form: (id: string, options: FormOptions): void => {
    const { baseUrl, parent } = resolveOptions(options);
    createScript(`${baseUrl}/f/${id}`, parent);
  },
};
