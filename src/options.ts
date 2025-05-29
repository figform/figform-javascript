export interface FormOptions {
  baseUrl?: string;
  parent?: HTMLElement;
  parentId?: string;
}

interface ResolvedFormOptions {
  baseUrl: string;
  parent: HTMLElement;
}

function resolveParent(options: FormOptions | undefined): HTMLElement {
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

  return document.body;
}

export function resolveOptions(options: FormOptions | undefined): ResolvedFormOptions {
  return {
    baseUrl: options?.baseUrl ?? "https://figform.com",
    parent: resolveParent(options),
  };
}
