export function getClassName(id: string): string {
  return `figform_${id}-`;
}

export function createScript(src: string, parent: HTMLElement): HTMLScriptElement {
  const script = document.createElement("script");
  script.src = src;
  parent.appendChild(script);
  return script;
}

export function existsScript(id: string, src: string): boolean {
  const className = getClassName(id);

  return (
    document.querySelector(`script[src="${src}"]`) !== null ||
    document.querySelector(`div[class*="${className}"][class^="${className}"]`) !== null
  );
}

export function unmountScript(id: string, src: string, parent: HTMLElement): void {
  const script = parent.querySelector(`script[src="${src}"]`);

  if (script !== null) {
    parent.removeChild(script);
  }

  const className = getClassName(id);
  const form = parent.querySelector(`div[class*="${className}"][class^="${className}"]`);

  if (form !== null) {
    parent.removeChild(form);
  }
}
