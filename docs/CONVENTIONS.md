# Project Conventions

This document outlines the coding conventions, architectural patterns, and best practices established in this project.

## Table of Contents

- [Import Conventions](#import-conventions)
- [File Naming](#file-naming)
- [Feature-Based Architecture](#feature-based-architecture)
- [Component Organization](#component-organization)
- [Type Definitions](#type-definitions)
- [Testing Conventions](#testing-conventions)
- [Route Structure](#route-structure)
- [Error Handling](#error-handling)
- [Environment Variables](#environment-variables)

---

## Import Conventions

### Absolute Imports

**Always use absolute imports with the `@/` alias** instead of relative imports.

```typescript
// ✅ Good
import { Button } from "@/components/ui/button";
import { Resource } from "@/features/resources";

// ❌ Bad
import { Button } from "../../components/ui/button";
import { Resource } from "../../../features/resources";
```

**Exception**: One level up is allowed, if not importing from a [global file or directory](FILE_STRUCTURE.md#global-files-and-directories):

```typescript
// ✅ Acceptable
import { helper } from "../utils/helper";
```

### Feature Import Restrictions

**Do not import deeply from features**. Only import from the feature root or its top-level files.

```typescript
// ✅ Good - Import from feature root
import { Resource, getResourceMetadata } from "@/features/resources";
import { AbstractResourceForm } from "@/features/abstract-resource-form";

// ✅ Good - Import from feature entry point files
import { getAuthStateServer } from "@/features/authentication/server";
import { getResourceMetadata } from "@/features/resources/node";

// ❌ Bad - Deep imports into feature internals
import { ResourceMetadata } from "@/features/resources/types/metadata";
import { FormInputs } from "@/features/abstract-resource-form/components/inputs";
```

Features are free to define internal types, utilities and structures, and will only re-export the code they consider "public-facing", that is suitable to be imported from outside of the feature, in one of the feature top-level files.

### UI Component Imports

**Always use absolute imports for shadcn/ui components** to ensure files are relocation-proof.

```typescript
// ✅ Good
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

// ❌ Bad - Relative imports for UI components
import { Button } from "../ui/button";
```

---

## File Naming

### General Rules

- **Use kebab-case** for all file and directory names: `user-profile.tsx`, `abstract-resource-form/`

### Feature Entry Points

Each feature must have clear entry points:

- **`index.ts`**: Client-side exports (React Client Components, hooks, utilities)
- **`server.ts`**: Server-side exports (React Server Components, server actions)
- **`node.ts`**: Node.js environment exports (for tests, scripts, build tools)

```typescript
// features/authentication/index.ts
export { LoginPage } from "./components/login-page";
export { useAuth } from "./hooks/use-auth";

// features/authentication/server.ts
export { getAuthStateServer } from "./utils/get-auth-state-server";
export { PrivateLayout } from "./components/private-layout";

// features/authentication/node.ts
export { AUTH_STATE_COOKIE_NAME } from "./constants";
export { parseAuthCookie } from "./utils/parse-auth-cookie";
```

Exporting strategy: when creating a new feature, start with re-exporting the files needed outside of it inside of `index.ts` using it as a barrel file. Next.js does not produce errors with files exported in this manner because it uses Turbopack, which performs tree-shaking and does not actually execute each import when importing from a barrel file. On the other hand, test environments such as Vitest or Playwright do not use bundlers, so when encountering a barrel file like `index.ts` they will import all re-exported code. Sometimes you will re-export files that are only supposed to be used in specific environments, such as [server-only code](https://nextjs.org/docs/app/getting-started/server-and-client-components#keeping-server-only-code-out-of-the-client-environment), and hence they will fail to load in these environments. In this case, you will need to define separate barrel files for the different environments.

The most common points of issue are:

- `next/image` - This component is mocked in vitest, but Playwright cannot resolve Next.js's `<Image>` component when running spec files. Ensure you are not importing from a barrel file which exposes a component that directly or indirectly uses `next/image`.
- `server-only` - Files or components marked as server-only will fail to be imported in both Vitest and Playwright. If a test file imports from a feature exposing server-only code, it's best to separate the non-React files in a barrel called `node.ts` which will then be used by test files.

---

## Feature-Based Architecture

### Feature Structure

Each feature is a self-contained module with its own components, types, and utilities:

```txt
features/
  <feature-name>/
    api/                # Feature-specific functions which access the API
    components/         # Feature-specific React components
    data/               # Feature-specific JSON-like data
    schemas/            # Feature-specific Zod schemas
    types/              # Feature-specific types
    utils/              # Feature-specific utilities
    constants.ts        # Feature-specific constant values
    enums.ts            # Feature-specific enums
    index.ts            # Client exports
    server.ts           # Server exports
    node.ts             # Node.js exports
```

> [!Note]
> Features need not include all of these files and directories, but only those which will actually be used.

### Public API Surface

**Features expose a public API** through their entry point files. Internal implementation details should not be imported directly.

```typescript
// ✅ Good - Use public API
import { Resource, getResourceMetadata } from "@/features/resources";
// ❌ Bad - Import internal implementation
import { RESOURCE_METADATA } from "@/features/resources/data/resource-metadata";
```

### Cross-Feature Dependencies

Features can depend on each other, but should do so through public APIs:

```typescript
// ✅ Good
import { Bouncer } from "@/features/authentication/server";

// ❌ Bad
import { Bouncer } from "@/features/authentication/components/bouncer";
```

---

## Component Organization

### Component Categories

Components are organized by their role and reusability:

1. **`core/`**: Generic, highly reusable components (buttons, links, spinners)
2. **`inputs/`**: Form input components (text, checkbox, date, file uploads)
3. **`presentation/`**: Display/presentational components specific to the ToPWR Admin Panel (navbar, error messages, logos)
4. **`ui/`**: Third-party UI library components (shadcn/ui)
5. **`providers/`**: Global context and API providers meant to wrap the entire application

### Component File Structure

For simple components:

```txt
component-name.tsx
component-name.test.tsx
```

For complex components with multiple files:

```txt
component-name/
  index.tsx           # Main component export
  client.tsx          # Client component logic
  server.tsx          # Server component logic
  component-name.test.tsx
```

### Component Prop Types

Define prop types inline if they are only used once. Separate them into a type or interface only if used elsewhere.

---

## Type Definitions

### Type Organization

- **Shared types**: `src/types/` (components.ts, helpers.ts, schemas.ts)
- **Feature types**: `src/features/<feature>/types/`

### Type Naming Conventions

- **Interfaces**: PascalCase, descriptive names: `UserProfile`, `ResourceMetadata`
- **Type aliases**: PascalCase: `ResourceFormValues`, `SearchParameters`
- **Generics**: Single uppercase letter or rarely PascalCase: `T`, `R`

### Type Exports

Export types from feature public APIs:

```typescript
// features/resources/index.ts
export type { Resource } from "./enums";
export type { ResourceMetadata, ResourceFormValues } from "./types";
```

---

## Testing Conventions

### Test Organization

- **Unit tests**: `src/tests/unit/` + co-located `*.test.tsx` files
- **E2E tests**: `src/tests/e2e/specs/`
- **Shared utilities**: `src/tests/shared/`

### Unit Test Setup

- **Test framework**: Vitest
- **Setup file**: `src/tests/unit/setup.ts`
- **Timeout**: 10,000ms
- **Environment**: jsdom

### E2E Test Setup

- **Test framework**: Playwright
- **Test location**: `src/tests/e2e/specs/`
- **Auth setup**: `src/tests/e2e/auth.setup.ts`
- **Test helpers**: `src/tests/e2e/utils/`

### Test File Naming

```txt
component-name.test.tsx       # Unit test
resource-name.spec.ts         # E2E test
```

### Test Utilities

Reusable test utilities are organized:

```txt
tests/
  shared/                # Used by both unit and e2e
    mocks/
    utils/
  unit/                  # Unit test specific
    utils/
    providers/
  e2e/                   # E2E specific
    utils/
    api/
```

### Mock Service Worker (MSW)

MSW is used for mocking API requests in unit tests:

```typescript
// tests/unit/config/handlers.ts
export const handlers = [
  http.post(`${API_URL}/resource`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ ...body, id: "mock-id" });
  }),
];
```

---

## Route Structure

### Next.js App Router

Routes use the App Router with route groups:

```txt
app/
  (private)/          # Protected routes
    (resources)/      # Resource management
  (public)/           # Public routes
```

### Resource Routes

Each resource follows a consistent pattern:

```txt
<resource_name>/
  page.tsx           # List view
  layout.tsx         # Layout wrapper
  create/
    page.tsx         # Create form
  edit/
    [id]/
      page.tsx       # Edit form
```

### Layout Hierarchy

```txt
app/layout.tsx                    # Root layout
  ├─ (private)/layout.tsx         # Private layout (auth required)
  │   └─ (resources)/<resource>/layout.tsx  # Resource layout
  └─ (public)/layout.tsx          # Public layout (guest only)
```

### Route Permissions

Routes are protected using the `Bouncer` component:

```typescript
export default async function PrivateLayout({ children }: WrapperProps) {
  return (
    <>
      <Navbar />
      <MainContent>
        <Bouncer route="/">{children}</Bouncer>
      </MainContent>
    </>
  );
}
```

---

## Error Handling

### Error Messages

Centralized error messages in `src/data/`:

```typescript
// data/form-error-messages.ts
export const FORM_ERROR_MESSAGES = {
  REQUIRED: "To pole jest wymagane",
  INVALID_EMAIL: "Nieprawidłowy adres email",
  // ...
} as const;

// data/application-error-messages.ts
export const APPLICATION_ERROR_MESSAGES = {
  [ApplicationError.NotFound]: "Nie znaleziono strony",
  // ...
} as const;
```

### Error Boundaries

Each route group has error boundaries:

```txt
(private)/
  error.tsx           # Client error boundary
  forbidden.tsx       # 403 page
```

### API Error Handling

API errors are handled in the `backend` feature:

```typescript
// features/backend/index.ts
export class FetchError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: unknown,
  ) {
    super(message);
  }
}
```

---

## Environment Variables

### Validation

Environment variables are validated using Zod in `src/config/env.ts`:

```typescript
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_ENV: z.enum(["development", "staging", "production"]),
  // ...
});

export const env = envSchema.parse(process.env);
```

### Usage

Import validated env variables:

```typescript
import { env } from "@/config/env";

const apiUrl = env.NEXT_PUBLIC_API_URL;
```

### Naming Convention

- **Public variables**: `NEXT_PUBLIC_*` (accessible in browser)
- **Server-only variables**: No prefix (only accessible server-side)

---

## Constants Organization

### Location

- **App-wide constants**: `src/config/constants.ts`
- **Feature-specific constants**: `src/features/<feature>/constants.ts`

### Naming

Constants use CONSTANT_CASE:

```typescript
export const DEFAULT_INPUT_COLOR = "#ffffff";
export const AUTH_STATE_COOKIE_NAME = "authState";
export const LIST_RESULTS_PER_PAGE = 10;
```

---

## Schema Conventions

### Zod Schemas

- **Shared schemas**: `src/schemas/`
- **Resource schemas**: `src/features/resources/schemas/`
- **Feature schemas**: `src/features/<feature>/schemas/`

### Schema Naming

Schemas use PascalCase with "Schema" suffix:

```typescript
export const RequiredStringSchema = z.string().trim().min(1);
export const ColorValueSchema = z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/);
export const IsoTimestampSchema = z.string().datetime({ offset: true });
```

### Schema Exports

Export from feature public APIs:

```typescript
// features/resources/index.ts
export { BannerSchema, GuideArticleSchema } from "./schemas";
```

---

## Data vs Utils

### `src/data/`

Static data and constants:

- Error messages
- Configuration objects
- Predefined options/choices

### `src/utils/`

Pure utility functions:

- Data transformations
- Validation helpers
- Type guards
- Formatting functions

```typescript
// data/form-error-messages.ts - Static data
export const FORM_ERROR_MESSAGES = { ... };

// utils/is-empty-value.ts - Pure function
export const isEmptyValue = (value: unknown): boolean => { ... };
```
