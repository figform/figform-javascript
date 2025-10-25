import * as React from "react";
import { cleanup, render } from "@testing-library/react";
import * as optionsModule from "../src/options";
import * as scriptModule from "../src/script";
import { FigForm, FigFormProps } from "../src/react";

const mockResolveOptions = jest.spyOn(optionsModule, "resolveOptions");
const mockCreateScript = jest.spyOn(scriptModule, "createScript");
const mockExistsScript = jest.spyOn(scriptModule, "existsScript");
const mockUnmountScript = jest.spyOn(scriptModule, "unmountScript");

const mockSpanRemove = jest.fn<ReturnType<HTMLSpanElement["remove"]>, Parameters<HTMLSpanElement["remove"]>>();

Object.defineProperty(HTMLSpanElement.prototype, "remove", {
  value: mockSpanRemove,
  writable: true,
});

describe("react.tsx", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockResolveOptions.mockImplementation((options, fallback) => ({
      baseUrl: options?.baseUrl ?? "https://figform.io",
      parent: fallback ?? document.createElement("div"),
      preview: false,
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
    it("should render span element and call remove when it has a parent", () => {
      const props: FigFormProps = {
        id: "test-form",
      };

      render(<FigForm {...props} />);

      expect(mockSpanRemove).toHaveBeenCalledTimes(1);
    });

    it("should call resolveOptions with parent element from RTL container", () => {
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
        preview: false,
      });

      render(<FigForm {...props} />);

      expect(mockResolveOptions).toHaveBeenCalledTimes(1);
      expect(mockResolveOptions).toHaveBeenCalledWith(options, expect.any(HTMLElement));
    });

    it("should resolve options using empty options when only id is provided", () => {
      const props: FigFormProps = {
        id: "test-form",
      };

      render(<FigForm {...props} />);

      expect(mockResolveOptions).toHaveBeenCalledTimes(1);
      expect(mockResolveOptions).toHaveBeenCalledWith({}, expect.any(HTMLElement));
    });

    it("should create script when script does not exist", () => {
      const mockParent = document.createElement("div");
      const resolvedOptions = {
        baseUrl: "https://figform.io",
        parent: mockParent,
        preview: false,
      };

      mockResolveOptions.mockReturnValueOnce(resolvedOptions);
      mockExistsScript.mockReturnValueOnce(false);

      const props: FigFormProps = {
        id: "test-form",
      };

      render(<FigForm {...props} />);

      expect(mockExistsScript).toHaveBeenCalledTimes(1);
      expect(mockExistsScript).toHaveBeenCalledWith("test-form", `https://figform.io/f/${props.id}`, mockParent);
      expect(mockCreateScript).toHaveBeenCalledTimes(1);
      expect(mockCreateScript).toHaveBeenCalledWith(`https://figform.io/f/${props.id}`, mockParent);
    });

    it("should not create script when script already exists", () => {
      const mockParent = document.createElement("div");
      const resolvedOptions = {
        baseUrl: "https://figform.io",
        parent: mockParent,
        preview: false,
      };

      mockResolveOptions.mockReturnValueOnce(resolvedOptions);
      mockExistsScript.mockReturnValueOnce(true);

      const props: FigFormProps = {
        id: "existing-form",
      };

      render(<FigForm {...props} />);

      expect(mockExistsScript).toHaveBeenCalledTimes(1);
      expect(mockExistsScript).toHaveBeenCalledWith("existing-form", `https://figform.io/f/${props.id}`, mockParent);
      expect(mockCreateScript).not.toHaveBeenCalled();
    });

    it("should create script with custom baseUrl", () => {
      const mockParent = document.createElement("div");
      const resolvedOptions = {
        baseUrl: "https://custom.figform.io",
        parent: mockParent,
        preview: false,
      };

      mockResolveOptions.mockReturnValueOnce(resolvedOptions);
      mockExistsScript.mockReturnValueOnce(false);

      const props: FigFormProps = {
        id: "custom-form",
        baseUrl: "https://custom.figform.io",
      };

      render(<FigForm {...props} />);

      expect(mockExistsScript).toHaveBeenCalledTimes(1);
      expect(mockExistsScript).toHaveBeenCalledWith("custom-form", `${props.baseUrl}/f/${props.id}`, mockParent);
      expect(mockCreateScript).toHaveBeenCalledTimes(1);
      expect(mockCreateScript).toHaveBeenCalledWith(`${props.baseUrl}/f/${props.id}`, mockParent);
    });

    it("should call unmountScript on component unmount", () => {
      const mockFormId = "unmount-test";
      const mockParent = document.createElement("div");
      const resolvedOptions = {
        baseUrl: "https://figform.io",
        parent: mockParent,
        preview: false,
      };

      mockResolveOptions.mockReturnValueOnce(resolvedOptions);
      mockExistsScript.mockReturnValueOnce(false);

      const props: FigFormProps = {
        id: mockFormId,
      };

      const { unmount } = render(<FigForm {...props} />);
      unmount();

      expect(mockUnmountScript).toHaveBeenCalledTimes(1);

      expect(mockUnmountScript).toHaveBeenCalledWith(
        mockFormId,
        `${resolvedOptions.baseUrl}/f/${props.id}`,
        mockParent,
      );
    });

    it("should call unmountScript with custom baseUrl on component unmount", () => {
      const mockFormId = "custom-unmount-test";
      const mockParent = document.createElement("div");
      const resolvedOptions = {
        baseUrl: "https://custom.example.com",
        parent: mockParent,
        preview: false,
      };

      mockResolveOptions.mockReturnValueOnce(resolvedOptions);
      mockExistsScript.mockReturnValueOnce(false);

      const props: FigFormProps = {
        id: mockFormId,
        baseUrl: "https://custom.example.com",
      };

      const { unmount } = render(<FigForm {...props} />);
      unmount();

      expect(mockUnmountScript).toHaveBeenCalledTimes(1);
      expect(mockUnmountScript).toHaveBeenCalledWith(mockFormId, `${props.baseUrl}/f/${props.id}`, mockParent);
    });

    it("should handle prop changes by resolving options again", () => {
      const mockParent1 = document.createElement("div");
      const mockParent2 = document.createElement("div");
      const resolvedOptions1 = {
        baseUrl: "https://figform.io",
        parent: mockParent1,
        preview: false,
      };
      const resolvedOptions2 = {
        baseUrl: "https://custom.figform.io",
        parent: mockParent2,
        preview: false,
      };

      mockResolveOptions.mockReturnValueOnce(resolvedOptions1);
      mockResolveOptions.mockReturnValueOnce(resolvedOptions2);
      mockExistsScript.mockReturnValue(false);

      const props1: FigFormProps = {
        id: "change-test",
      };

      const ParentComponent = ({ formProps }: { formProps: FigFormProps }) => <FigForm {...formProps} />;

      const { rerender } = render(<ParentComponent formProps={props1} />);

      const props2: FigFormProps = {
        id: "change-test",
        baseUrl: "https://custom.figform.io",
      };

      rerender(<ParentComponent formProps={props2} />);

      expect(mockResolveOptions).toHaveBeenCalledTimes(2);
      expect(mockResolveOptions).toHaveBeenNthCalledWith(1, {}, expect.any(HTMLElement));
      expect(mockResolveOptions).toHaveBeenNthCalledWith(2, { baseUrl: props2.baseUrl }, expect.any(HTMLElement));
    });

    it("should handle all FigFormOptions properties", () => {
      const mockParent = document.createElement("div");
      const resolvedOptions = {
        baseUrl: "https://custom.figform.io",
        parent: mockParent,
        preview: false,
      };

      mockResolveOptions.mockReturnValueOnce(resolvedOptions);
      mockExistsScript.mockReturnValueOnce(false);

      const customParentElement = document.createElement("section");
      const props: FigFormProps = {
        id: "full-options-test",
        baseUrl: "https://custom.figform.io",
        parent: customParentElement,
        parentId: "should-be-ignored-when-parent-provided",
      };

      render(<FigForm {...props} />);

      expect(mockResolveOptions).toHaveBeenCalledTimes(1);
      expect(mockResolveOptions).toHaveBeenCalledWith(
        {
          baseUrl: props.baseUrl,
          parent: customParentElement,
          parentId: props.parentId,
        },
        expect.any(HTMLElement),
      );
      expect(mockExistsScript).toHaveBeenCalledTimes(1);
      expect(mockExistsScript).toHaveBeenCalledWith(props.id, `${props.baseUrl}/f/${props.id}`, mockParent);
      expect(mockCreateScript).toHaveBeenCalledTimes(1);
      expect(mockCreateScript).toHaveBeenCalledWith(`${props.baseUrl}/f/${props.id}`, mockParent);
    });

    it("should handle parentId option", () => {
      const mockParent = document.createElement("div");
      const resolvedOptions = {
        baseUrl: "https://figform.io",
        parent: mockParent,
        preview: false,
      };

      mockResolveOptions.mockReturnValueOnce(resolvedOptions);
      mockExistsScript.mockReturnValueOnce(false);

      const props: FigFormProps = {
        id: "parent-id-test",
        parentId: "custom-parent-id",
      };

      render(<FigForm {...props} />);

      expect(mockResolveOptions).toHaveBeenCalledTimes(1);
      expect(mockResolveOptions).toHaveBeenCalledWith({ parentId: props.parentId }, expect.any(HTMLElement));
      expect(mockCreateScript).toHaveBeenCalledTimes(1);
      expect(mockCreateScript).toHaveBeenCalledWith(`https://figform.io/f/${props.id}`, mockParent);
    });

    it("should handle parent element option", () => {
      const customParent = document.createElement("div");
      const resolvedOptions = {
        baseUrl: "https://figform.io",
        parent: customParent,
        preview: false,
      };

      mockResolveOptions.mockReturnValueOnce(resolvedOptions);
      mockExistsScript.mockReturnValueOnce(false);

      const props: FigFormProps = {
        id: "parent-element-test",
        parent: customParent,
      };

      render(<FigForm {...props} />);

      expect(mockResolveOptions).toHaveBeenCalledTimes(1);
      expect(mockResolveOptions).toHaveBeenCalledWith({ parent: customParent }, expect.any(HTMLElement));
      expect(mockCreateScript).toHaveBeenCalledTimes(1);
      expect(mockCreateScript).toHaveBeenCalledWith(`https://figform.io/f/${props.id}`, customParent);
    });

    it("should handle preview option", () => {
      const mockParent = document.createElement("div");
      const resolvedOptions = {
        baseUrl: "https://figform.io",
        parent: mockParent,
        preview: true,
      };

      mockResolveOptions.mockReturnValueOnce(resolvedOptions);
      mockExistsScript.mockReturnValueOnce(false);

      const props: FigFormProps = {
        id: "parent-id-test",
        preview: true,
      };

      render(<FigForm {...props} />);

      expect(mockResolveOptions).toHaveBeenCalledTimes(1);
      expect(mockResolveOptions).toHaveBeenCalledWith({ preview: true }, expect.any(HTMLElement));
      expect(mockCreateScript).toHaveBeenCalledTimes(1);
      expect(mockCreateScript).toHaveBeenCalledWith(`https://figform.io/f/${props.id}?preview=true`, mockParent);
    });

    it("should handle changes to id prop", () => {
      const mockParent = document.createElement("div");

      mockResolveOptions.mockReturnValue({
        baseUrl: "https://figform.io",
        parent: mockParent,
        preview: false,
      });
      mockExistsScript.mockReturnValue(false);

      const TestComponent = ({ id }: { id: string }) => <FigForm id={id} />;

      const { rerender } = render(<TestComponent id="initial-id" />);

      expect(mockExistsScript).toHaveBeenCalledWith("initial-id", "https://figform.io/f/initial-id", mockParent);

      rerender(<TestComponent id="changed-id" />);

      expect(mockExistsScript).toHaveBeenCalledWith("changed-id", "https://figform.io/f/changed-id", mockParent);
      expect(mockExistsScript).toHaveBeenCalledTimes(2);
    });

    it("should handle useLayoutEffect behavior", () => {
      const props: FigFormProps = {
        id: "layout-effect-test",
      };

      render(<FigForm {...props} />);

      expect(mockSpanRemove).toHaveBeenCalledTimes(1);
      expect(mockResolveOptions).toHaveBeenCalledTimes(1);
      expect(mockResolveOptions).toHaveBeenCalledWith({}, expect.any(HTMLElement));
    });
  });
});
