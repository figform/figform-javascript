# Official FigForm SDK for JavaScript

[FigForm](https://figform.com) is a full-featured form builder with Figma-like editor, analytics, integrations, and developer-friendly SDKs for React and JS.

## Installation

```sh
npm install figform
```

## Usage

### JavaScript / TypeScript

```ts
import { FigForm } from "figform";

FigForm.form("id", {
  parentId: "parent",
});
```

### React

```tsx
import { FigForm } from "figform/react";

function MyForm() {
  return <FigForm id="your-form-id" parentId="parent" />;
}
```
