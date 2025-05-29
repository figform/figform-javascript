# Official FigForm SDK for JavaScript

Feel the power of Figma when creating customized forms and surveys for free.

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
