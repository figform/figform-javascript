import { FigFormOptions } from "./options";

export function buildUrl(baseUrl: string, id: string, options: FigFormOptions): string {
  const searchParams = new URLSearchParams();
  if (options.preview) {
    searchParams.set("preview", "true");
  }
  const search = searchParams.size > 0 ? `?${searchParams.toString()}` : "";
  return `${baseUrl}/f/${id}${search}`;
}
