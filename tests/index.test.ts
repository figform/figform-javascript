import { FigForm } from "../src/index";
import { resolveOptions } from "../src/options";
import { createScript } from "../src/script";

jest.mock("../src/options");
jest.mock("../src/script");

const mockResolveOptions = jest.mocked(resolveOptions);
const mockCreateScript = jest.mocked(createScript);

describe("index", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("form", () => {
    it("should resolve options and create script with default baseUrl", () => {
      const id = "test-form-id";
      const options = { parentId: "test-parent" };
      const mockParent = {} as HTMLElement;
      mockResolveOptions.mockReturnValueOnce({
        baseUrl: "https://figform.com",
        parent: mockParent,
      });

      FigForm.form(id, options);

      expect(mockResolveOptions).toHaveBeenCalledTimes(1);
      expect(mockResolveOptions).toHaveBeenCalledWith(options);
      expect(mockCreateScript).toHaveBeenCalledTimes(1);
      expect(mockCreateScript).toHaveBeenCalledWith(`https://figform.com/f/${id}`, mockParent);
    });

    it("should resolve options and create script with custom baseUrl", () => {
      const id = "custom-form-id";
      const options = { baseUrl: "https://custom.example.com" };
      const mockParent = {} as HTMLElement;
      mockResolveOptions.mockReturnValueOnce({
        baseUrl: "https://custom.example.com",
        parent: mockParent,
      });

      FigForm.form(id, options);

      expect(mockResolveOptions).toHaveBeenCalledTimes(1);
      expect(mockResolveOptions).toHaveBeenCalledWith(options);
      expect(mockCreateScript).toHaveBeenCalledTimes(1);
      expect(mockCreateScript).toHaveBeenCalledWith(`https://custom.example.com/f/${id}`, mockParent);
    });

    it("should resolve options and create script with empty options object", () => {
      const id = "empty-options-form";
      const options = {};
      const mockParent = {} as HTMLElement;
      mockResolveOptions.mockReturnValueOnce({
        baseUrl: "https://figform.com",
        parent: mockParent,
      });

      FigForm.form(id, options);

      expect(mockResolveOptions).toHaveBeenCalledTimes(1);
      expect(mockResolveOptions).toHaveBeenCalledWith(options);
      expect(mockCreateScript).toHaveBeenCalledTimes(1);
      expect(mockCreateScript).toHaveBeenCalledWith(`https://figform.com/f/${id}`, mockParent);
    });
  });
});
