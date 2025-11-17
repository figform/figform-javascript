export interface FigFormOptions {
  baseUrl?: string;
  parent?: HTMLElement;
  parentId?: string;
  preview?: boolean;
}

interface ResolvedFormOptions {
  baseUrl: string;
  parent: HTMLElement;
  preview: boolean;
}

function resolveParent(options: FigFormOptions | undefined, fallback: HTMLElement | null): HTMLElement {
  if (typeof options?.parent !== "undefined") {
    return options.parent;
  }

  if (typeof options?.parentId !== "undefined") {
    const parentElement = document.getElementById(options.parentId);

    if (parentElement === null) {
      throw new Error(`Parent element with id ${options.parentId} not found`);
    }

    return parentElement;
  }

  return fallback ?? document.body;
}

export function resolveOptions(
  options: FigFormOptions | undefined,
  fallback: HTMLElement | null = null,
): ResolvedFormOptions {
  return {
    baseUrl: options?.baseUrl ?? "https://figform.com",
    parent: resolveParent(options, fallback),
    preview: options?.preview ?? false,
  };
}
