import { resolveOptions } from "../src/options";

const mockGetElementById = jest.fn<ReturnType<Document["getElementById"]>, Parameters<Document["getElementById"]>>();
const mockDocumentBody = document.createElement("body");

Object.defineProperty(document, "getElementById", {
  writable: true,
  value: mockGetElementById,
});

Object.defineProperty(document, "body", {
  writable: true,
  configurable: true,
  value: mockDocumentBody,
});

describe("options", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("resolveOptions", () => {
    it("should return default options when no options provided", () => {
      const result = resolveOptions(undefined);

      expect(result).toEqual({
        baseUrl: "https://figform.com",
        parent: mockDocumentBody,
      });
    });

    it("should return custom baseUrl when provided", () => {
      const result = resolveOptions({
        baseUrl: "https://custom.example.com",
      });

      expect(result).toEqual({
        baseUrl: "https://custom.example.com",
        parent: mockDocumentBody,
      });
    });

    it("should return custom parent when provided", () => {
      const customParent = {} as HTMLElement;
      const result = resolveOptions({ parent: customParent });

      expect(result).toEqual({
        baseUrl: "https://figform.com",
        parent: customParent,
      });
    });

    it("should return parent by id when parentId is provided", () => {
      const customParent = {} as HTMLElement;
      const options = { parentId: "test-parent" };
      mockGetElementById.mockReturnValueOnce(customParent);

      const result = resolveOptions(options);

      expect(result).toEqual({
        baseUrl: "https://figform.com",
        parent: customParent,
      });
      expect(mockGetElementById).toHaveBeenCalledTimes(1);
      expect(mockGetElementById).toHaveBeenCalledWith(options.parentId);
    });

    it("should prefer fallback over document.body", () => {
      const fallbackParent = {} as HTMLElement;
      const result = resolveOptions(undefined, fallbackParent);

      expect(result).toEqual({
        baseUrl: "https://figform.com",
        parent: fallbackParent,
      });
      expect(mockGetElementById).not.toHaveBeenCalled();
    });

    it("should prefer parent over parentId when both are provided", () => {
      const options = {
        parent: {} as HTMLElement,
        parentId: "test-parent",
      };
      mockGetElementById.mockReturnValueOnce(options.parent);

      const result = resolveOptions(options);

      expect(result).toEqual({
        baseUrl: "https://figform.com",
        parent: options.parent,
      });
      expect(mockGetElementById).not.toHaveBeenCalled();
    });

    it("should throw error when parentId element is not found", () => {
      const options = { parentId: "non-existent-parent" };
      mockGetElementById.mockReturnValueOnce(null);

      expect(() => resolveOptions(options)).toThrow(`Parent element with id ${options.parentId} not found`);
      expect(mockGetElementById).toHaveBeenCalledTimes(1);
      expect(mockGetElementById).toHaveBeenCalledWith(options.parentId);
    });
  });
});
