export function createScript(src: string, parent: HTMLElement): HTMLScriptElement {
  const script = document.createElement("script");
  script.src = src;
  parent.appendChild(script);
  return script;
}

export function existsScript(id: string, src: string): boolean {
  const className = `figform_${id}_`;

  return (
    document.querySelector(`script[src="${src}"]`) !== null ||
    document.querySelector(`div[class*="${className}"] div[class^="${className}"]`) !== null
  );
}

export function unmountScript(src: string): void {
  const script = document.querySelector(`script[src="${src}"]`);

  if (script !== null) {
    script.remove();
  }
}
