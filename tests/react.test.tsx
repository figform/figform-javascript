import * as React from "react";
import { cleanup, render } from "@testing-library/react";
import * as optionsModule from "../src/options";
import * as scriptModule from "../src/script";
import { FigForm, FigFormProps } from "../src/react";

jest.mock("../src/options");
jest.mock("../src/script");

const mockResolveOptions = jest.mocked(optionsModule.resolveOptions);
const mockCreateScript = jest.mocked(scriptModule.createScript);
const mockExistsScript = jest.mocked(scriptModule.existsScript);
const mockUnmountScript = jest.mocked(scriptModule.unmountScript);

describe("react.tsx", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockResolveOptions.mockImplementation((options) => ({
      baseUrl: options?.baseUrl ?? "https://figform.com",
      parent: document.createElement("div"),
    }));

    mockCreateScript.mockImplementation(() => document.createElement("script"));
    mockExistsScript.mockReturnValue(false);
    mockUnmountScript.mockImplementation(() => {
      return;
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe("FigForm", () => {
    it("should render without crashing and return null", () => {
      const props: FigFormProps = {
        id: "test-form",
      };

      const { container } = render(<FigForm {...props} />);
      expect(container.children.length).toBe(0);
    });

    it("should resolve options using provided options", () => {
      const mockParent = document.createElement("div");
      const options = {
        baseUrl: "https://custom.example.com",
        parentId: "custom-parent",
      };
      const props: FigFormProps = {
        id: "test-form",
        ...options,
      };
      mockResolveOptions.mockReturnValueOnce({
        baseUrl: "https://custom.example.com",
        parent: mockParent,
      });

      render(<FigForm {...props} />);

      expect(mockResolveOptions).toHaveBeenCalledTimes(1);
      expect(mockResolveOptions).toHaveBeenCalledWith(options);
    });

    it("should resolve options using empty options when only id is provided", () => {
      const props: FigFormProps = {
        id: "test-form",
      };

      render(<FigForm {...props} />);

      expect(mockResolveOptions).toHaveBeenCalledTimes(1);
      expect(mockResolveOptions).toHaveBeenCalledWith({});
    });

    it("should create script when script does not exist", () => {
      const mockParent = document.createElement("div");
      const resolvedOptions = {
        baseUrl: "https://figform.com",
        parent: mockParent,
      };
      mockResolveOptions.mockReturnValueOnce(resolvedOptions);
      mockExistsScript.mockReturnValueOnce(false);

      const props: FigFormProps = {
        id: "test-form",
      };

      render(<FigForm {...props} />);

      expect(mockExistsScript).toHaveBeenCalledTimes(1);
      expect(mockExistsScript).toHaveBeenCalledWith("test-form", `https://figform.com/f/${props.id}`);
      expect(mockCreateScript).toHaveBeenCalledTimes(1);
      expect(mockCreateScript).toHaveBeenCalledWith(`https://figform.com/f/${props.id}`, mockParent);
    });

    it("should not create script when script already exists", () => {
      const mockParent = document.createElement("div");
      const resolvedOptions = {
        baseUrl: "https://figform.com",
        parent: mockParent,
      };
      mockResolveOptions.mockReturnValueOnce(resolvedOptions);
      mockExistsScript.mockReturnValueOnce(true);

      const props: FigFormProps = {
        id: "existing-form",
      };

      render(<FigForm {...props} />);

      expect(mockExistsScript).toHaveBeenCalledTimes(1);
      expect(mockExistsScript).toHaveBeenCalledWith("existing-form", `https://figform.com/f/${props.id}`);
      expect(mockCreateScript).not.toHaveBeenCalled();
    });

    it("should create script with custom baseUrl", () => {
      const mockParent = document.createElement("div");
      const resolvedOptions = {
        baseUrl: "https://custom.figform.com",
        parent: mockParent,
      };
      mockResolveOptions.mockReturnValueOnce(resolvedOptions);
      mockExistsScript.mockReturnValueOnce(false);

      const props: FigFormProps = {
        id: "custom-form",
        baseUrl: "https://custom.figform.com",
      };

      render(<FigForm {...props} />);

      expect(mockExistsScript).toHaveBeenCalledTimes(1);
      expect(mockExistsScript).toHaveBeenCalledWith("custom-form", `${props.baseUrl}/f/${props.id}`);
      expect(mockCreateScript).toHaveBeenCalledTimes(1);
      expect(mockCreateScript).toHaveBeenCalledWith(`${props.baseUrl}/f/${props.id}`, mockParent);
    });

    it("should call unmountScript on component unmount", () => {
      const mockParent = document.createElement("div");
      const resolvedOptions = {
        baseUrl: "https://figform.com",
        parent: mockParent,
      };
      mockResolveOptions.mockReturnValueOnce(resolvedOptions);
      mockExistsScript.mockReturnValueOnce(false);

      const props: FigFormProps = {
        id: "unmount-test",
      };

      const { unmount } = render(<FigForm {...props} />);
      unmount();

      expect(mockUnmountScript).toHaveBeenCalledTimes(1);
      expect(mockUnmountScript).toHaveBeenCalledWith(`https://figform.com/f/${props.id}`);
    });

    it("should call unmountScript with custom baseUrl on component unmount", () => {
      const mockParent = document.createElement("div");
      const resolvedOptions = {
        baseUrl: "https://custom.example.com",
        parent: mockParent,
      };
      mockResolveOptions.mockReturnValueOnce(resolvedOptions);
      mockExistsScript.mockReturnValueOnce(false);

      const props: FigFormProps = {
        id: "custom-unmount-test",
        baseUrl: "https://custom.example.com",
      };

      const { unmount } = render(<FigForm {...props} />);
      unmount();

      expect(mockUnmountScript).toHaveBeenCalledTimes(1);
      expect(mockUnmountScript).toHaveBeenCalledWith(`${props.baseUrl}/f/${props.id}`);
    });

    it("should handle prop changes by resolving options again", () => {
      const mockParent1 = document.createElement("div");
      const mockParent2 = document.createElement("div");
      const resolvedOptions1 = {
        baseUrl: "https://figform.com",
        parent: mockParent1,
      };
      const resolvedOptions2 = {
        baseUrl: "https://custom.figform.com",
        parent: mockParent2,
      };
      mockResolveOptions.mockReturnValueOnce(resolvedOptions1).mockReturnValueOnce(resolvedOptions2);
      mockExistsScript.mockReturnValue(false);

      const props1: FigFormProps = {
        id: "change-test",
      };

      const { rerender } = render(<FigForm {...props1} />);

      const props2: FigFormProps = {
        id: "change-test",
        baseUrl: "https://custom.figform.com",
      };

      rerender(<FigForm {...props2} />);

      expect(mockResolveOptions).toHaveBeenCalledTimes(2);
      expect(mockResolveOptions).toHaveBeenNthCalledWith(1, {});
      expect(mockResolveOptions).toHaveBeenNthCalledWith(2, { baseUrl: props2.baseUrl });
    });

    it("should handle all FormOptions properties", () => {
      const mockParent = document.createElement("div");
      const resolvedOptions = {
        baseUrl: "https://custom.figform.com",
        parent: mockParent,
      };
      mockResolveOptions.mockReturnValueOnce(resolvedOptions);
      mockExistsScript.mockReturnValueOnce(false);

      const props: FigFormProps = {
        id: "full-options-test",
        baseUrl: "https://custom.figform.com",
        parent: mockParent,
        parentId: "should-be-ignored-when-parent-provided",
      };

      render(<FigForm {...props} />);

      expect(mockResolveOptions).toHaveBeenCalledTimes(1);
      expect(mockResolveOptions).toHaveBeenCalledWith({
        baseUrl: props.baseUrl,
        parent: mockParent,
        parentId: props.parentId,
      });
      expect(mockExistsScript).toHaveBeenCalledTimes(1);
      expect(mockExistsScript).toHaveBeenCalledWith(props.id, `${props.baseUrl}/f/${props.id}`);
      expect(mockCreateScript).toHaveBeenCalledTimes(1);
      expect(mockCreateScript).toHaveBeenCalledWith(`${props.baseUrl}/f/${props.id}`, mockParent);
    });

    it("should handle parentId option", () => {
      const mockParent = document.createElement("div");
      const resolvedOptions = {
        baseUrl: "https://figform.com",
        parent: mockParent,
      };
      mockResolveOptions.mockReturnValueOnce(resolvedOptions);
      mockExistsScript.mockReturnValueOnce(false);

      const props: FigFormProps = {
        id: "parent-id-test",
        parentId: "custom-parent-id",
      };

      render(<FigForm {...props} />);

      expect(mockResolveOptions).toHaveBeenCalledTimes(1);
      expect(mockResolveOptions).toHaveBeenCalledWith({ parentId: props.parentId });
      expect(mockCreateScript).toHaveBeenCalledTimes(1);
      expect(mockCreateScript).toHaveBeenCalledWith(`https://figform.com/f/${props.id}`, mockParent);
    });

    it("should handle parent element option", () => {
      const customParent = document.createElement("div");
      const resolvedOptions = {
        baseUrl: "https://figform.com",
        parent: customParent,
      };
      mockResolveOptions.mockReturnValueOnce(resolvedOptions);
      mockExistsScript.mockReturnValueOnce(false);

      const props: FigFormProps = {
        id: "parent-element-test",
        parent: customParent,
      };

      render(<FigForm {...props} />);

      expect(mockResolveOptions).toHaveBeenCalledTimes(1);
      expect(mockResolveOptions).toHaveBeenCalledWith({ parent: customParent });
      expect(mockCreateScript).toHaveBeenCalledTimes(1);
      expect(mockCreateScript).toHaveBeenCalledWith(`https://figform.com/f/${props.id}`, customParent);
    });
  });
});
