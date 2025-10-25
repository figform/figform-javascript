import { createScript, existsScript, unmountScript } from "../src/script";

const mockDocumentCreateElement = jest.fn<
  ReturnType<Document["createElement"]>,
  Parameters<Document["createElement"]>
>();
const mockElementAppendChild = jest.fn<
  ReturnType<HTMLElement["appendChild"]>,
  Parameters<HTMLElement["appendChild"]>
>();
const mockElementRemoveChild = jest.fn<
  ReturnType<HTMLElement["removeChild"]>,
  Parameters<HTMLElement["removeChild"]>
>();
const mockQuerySelector = jest.fn<ReturnType<Document["querySelector"]>, Parameters<Document["querySelector"]>>();

Object.defineProperty(document, "createElement", {
  writable: true,
  value: mockDocumentCreateElement,
});

Object.defineProperty(document, "querySelector", {
  writable: true,
  value: mockQuerySelector,
});

describe("script", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("createScript", () => {
    it("should create a script element and append it to parent", () => {
      const mockScript = { src: "" } as unknown as HTMLScriptElement;
      const src = "https://example.com/script.js";

      mockDocumentCreateElement.mockReturnValueOnce(mockScript);

      const result = createScript(src, { appendChild: mockElementAppendChild } as unknown as HTMLElement);

      expect(result).toBe(mockScript);
      expect(mockDocumentCreateElement).toHaveBeenCalledTimes(1);
      expect(mockDocumentCreateElement).toHaveBeenCalledWith("script");
      expect(mockElementAppendChild).toHaveBeenCalledTimes(1);
      expect(mockElementAppendChild).toHaveBeenCalledWith(mockScript);
    });
  });

  describe("existsScript", () => {
    it("should return true when script with src exists", () => {
      const id = "test-form";
      const mockScript = { src: "https://example.com/script.js" } as unknown as HTMLScriptElement;
      const mockParent = {
        querySelector: mockQuerySelector,
      } as unknown as HTMLElement;

      mockQuerySelector.mockReturnValueOnce(mockScript);
      mockQuerySelector.mockReturnValueOnce(null);

      const result = existsScript(id, mockScript.src, mockParent);

      expect(result).toBe(true);
      expect(mockQuerySelector).toHaveBeenCalledTimes(1);
      expect(mockQuerySelector).toHaveBeenCalledWith(`script[src="${mockScript.src}"]`);
    });

    it("should return true when div with figform class exists", () => {
      const id = "test-form";
      const mockScript = { src: "https://example.com/script.js" };
      const mockParent = {
        querySelector: mockQuerySelector,
      } as unknown as HTMLElement;

      mockQuerySelector.mockReturnValueOnce(null);
      mockQuerySelector.mockReturnValueOnce({} as HTMLElement);

      const result = existsScript(id, mockScript.src, mockParent);

      expect(result).toBe(true);
      expect(mockQuerySelector).toHaveBeenCalledTimes(2);
      expect(mockQuerySelector).toHaveBeenNthCalledWith(1, `script[src="${mockScript.src}"]`);
      expect(mockQuerySelector).toHaveBeenNthCalledWith(2, `div[class*="figform_${id}-"][class^="figform_${id}-"]`);
    });

    it("should return false when neither script nor div exists", () => {
      const id = "test-form";
      const mockScript = { src: "https://example.com/script.js" };
      const mockParent = {
        querySelector: mockQuerySelector,
      } as unknown as HTMLElement;

      mockQuerySelector.mockReturnValueOnce(null);
      mockQuerySelector.mockReturnValueOnce(null);

      const result = existsScript(id, mockScript.src, mockParent);

      expect(result).toBe(false);
      expect(mockQuerySelector).toHaveBeenCalledTimes(2);
      expect(mockQuerySelector).toHaveBeenNthCalledWith(1, `script[src="${mockScript.src}"]`);
      expect(mockQuerySelector).toHaveBeenNthCalledWith(2, `div[class*="figform_${id}-"][class^="figform_${id}-"]`);
    });
  });

  describe("unmountScript", () => {
    it("should remove script element when it exists", () => {
      const mockScriptId = "test-form";
      const mockScript = { src: "https://example.com/script.js" };
      const mockParent = {
        querySelector: mockQuerySelector,
        removeChild: mockElementRemoveChild,
      } as unknown as HTMLElement;

      mockQuerySelector.mockReturnValueOnce({} as unknown as HTMLElement);

      unmountScript(mockScriptId, mockScript.src, mockParent);

      expect(mockQuerySelector).toHaveBeenCalledTimes(2);
      expect(mockQuerySelector).toHaveBeenCalledWith(`script[src="${mockScript.src}"]`);
      expect(mockQuerySelector).toHaveBeenCalledWith(
        `div[class*="figform_${mockScriptId}-"][class^="figform_${mockScriptId}-"]`,
      );
      expect(mockElementRemoveChild).toHaveBeenCalledTimes(2);
    });

    it("should not remove script when script does not exist", () => {
      const mockScriptId = "test-form";
      const mockScript = { src: "https://example.com/script.js" };
      const mockParent = {
        querySelector: mockQuerySelector,
        removeChild: mockElementRemoveChild,
      } as unknown as HTMLElement;

      mockQuerySelector.mockReturnValueOnce(null);
      mockQuerySelector.mockReturnValueOnce({} as unknown as HTMLElement);

      unmountScript(mockScriptId, mockScript.src, mockParent);

      expect(mockQuerySelector).toHaveBeenCalledTimes(2);
      expect(mockQuerySelector).toHaveBeenCalledWith(`script[src="${mockScript.src}"]`);
      expect(mockQuerySelector).toHaveBeenCalledWith(
        `div[class*="figform_${mockScriptId}-"][class^="figform_${mockScriptId}-"]`,
      );
      expect(mockElementRemoveChild).toHaveBeenCalledTimes(1);
    });

    it("should not remove form when form does not exist", () => {
      const mockScriptId = "test-form";
      const mockScript = { src: "https://example.com/script.js" };
      const mockParent = {
        querySelector: mockQuerySelector,
        removeChild: mockElementRemoveChild,
      } as unknown as HTMLElement;

      mockQuerySelector.mockReturnValueOnce({} as unknown as HTMLElement);
      mockQuerySelector.mockReturnValueOnce(null);

      unmountScript(mockScriptId, mockScript.src, mockParent);

      expect(mockQuerySelector).toHaveBeenCalledTimes(2);
      expect(mockQuerySelector).toHaveBeenCalledWith(`script[src="${mockScript.src}"]`);
      expect(mockQuerySelector).toHaveBeenCalledWith(
        `div[class*="figform_${mockScriptId}-"][class^="figform_${mockScriptId}-"]`,
      );
      expect(mockElementRemoveChild).toHaveBeenCalledTimes(1);
    });
  });
});
