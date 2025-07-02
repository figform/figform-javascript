export interface FigFormOptions {
  baseUrl?: string;
  parent?: HTMLElement;
  parentId?: string;
}

interface ResolvedFormOptions {
  baseUrl: string;
  parent: HTMLElement;
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
    baseUrl: options?.baseUrl ?? "https://figform.io",
    parent: resolveParent(options, fallback),
  };
}
