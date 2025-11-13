# File Structure

This document describes the project's file structure, which is based on the [bulletproof-react](https://github.com/alan2207/bulletproof-react/tree/master/apps/nextjs-app) software architecture.

## Root Directory

```txt
web-topwr/
├── public/                 # Static assets (not imported in code)
├── docs/                   # Project documentation
├── LICENSES/               # Third-party license files
├── src/                    # Source code
└── README.md               # Project overview
```

## Source Directory (`src/`)

### High-Level Structure

```txt
src/
├── app/                    # Next.js App Router pages
├── assets/                 # Static assets (imported in components)
├── components/             # Shared React components
├── config/                 # App configuration and constants
├── data/                   # Static JSON-like data
├── features/               # Feature-based modules
├── hooks/                  # Shared React hooks
├── lib/                    # Globally-reusable complex logic (and utils.ts, due to shadcn/ui convention)
├── schemas/                # Shared Zod validation schemas
├── stores/                 # Global state management (Jotai)
├── tests/                  # Test utilities and setup
├── types/                  # Shared TypeScript type definitions
├── utils/                  # Pure utility functions
└── proxy.ts                # Middleware proxy configuration
```

#### Global files and directories

These folders are intended to contain _globally-shareable files_.

- `assets/`
- `config/`
- `data/`
- `hooks/`
- `lib/`
- `schemas/`
- `stores/`
- `types/`
- `utils/`

That means they should not include feature- or component-specific code.

#### `lib/` vs `utils/`

The utilities folder (`utils/`) should contain files where each file consists of exactly one pure function. The file should be named the same as the function, but using the appropriate casing. Utilities are getters, checkers, transformers and other highly-reusable small sections of logic.

Library code (in the `lib/` folder) is anything that includes more complex sections of code to perform its function, and if it were to be separated into single functions, they would not serve any use by themselves as opposed to the library as a whole. Library code usually makes extensive use of utilities in the `utils/` folder. Library code can also be the utilities considered a main or integral part of a feature.

Another use case for library code are custom functions which wrap a third-party dependency. This is done in order to safeguard against breaking API changes during dependency updates, which would not require modifications in all usages of said tool, but rather only in the "wrapper" library code.

This distinction also applies to feature code. For a good example look at the [Polish Language feature](/src/features/polish/).

### Resource Routes Pattern

Each resource follows a consistent structure:

```txt
<resource_name>/
├── page.tsx                # Collection view (Abstract Resource List or Calendar)
├── layout.tsx              # Resource-specific layout (Abstract Resource Layout)
├── create/
│   └── page.tsx            # Creation form (Abstract Resource Form)
└── edit/
    └── [id]/
        └── page.tsx        # Edit form (Abstract Resource Edit Form)
```

For singletons, there is no `[id]` subfolder, and the edit page is at `edit/page.tsx`. There is also no creation page at all.

> [!Note]
> Not all resources need to have each of these pages. For some resources it might not make sense to have a creation page, for example, so this is more of a general guideline.

### Components Directory (`src/components/`)

Organized by component type and usage:

```txt
components/
├── core/                   # Core reusable components
│   ├── counter.tsx
│   ├── link.tsx
│   ├── spinner.tsx
│   └── theme-toggle.tsx
├── inputs/                 # Form input components
├── presentation/           # Presentation/display components
├── providers/              # Global React context providers
├── ui/                     # shadcn/ui components (auto-generated)
├── analytics.tsx           # Analytics component
└── main-content.tsx        # Main content wrapper
```

### Features Directory (`src/features/`)

Feature-based architecture with domain-driven organization:

```txt
features/
├── abstract-resource-collection/   # Resource list/collection logic
│   ├── components/                 # Collection-specific components
│   ├── node.ts                     # Node.js/server exports
│   ├── types/                      # Collection type definitions
│   └── index.ts                    # Public API
├── abstract-resource-form/         # Resource form logic
│   ├── components/                 # Form-specific components
│   ├── types/                      # Form type definitions
│   └── index.ts                    # Public API
├── authentication/                 # Auth feature
│   ├── components/                 # Auth UI components
│   ├── server.ts                   # Server-side auth utilities
│   ├── types/                      # Auth types
│   └── index.ts                    # Public API
├── backend/                        # Backend API integration
│   ├── types/                      # API response types
│   └── index.ts                    # API client functions
├── polish/                         # Polish language utilities
│   └── index.ts                    # Declension and formatting
└── resources/                      # Resource metadata and types
    ├── components/                 # Resource-specific UI
    ├── data/                       # Resource metadata
    ├── schemas/                    # Resource validation schemas
    ├── types/                      # Resource type definitions
    ├── utils/                      # Resource utilities
    ├── server.ts                   # Server-side exports
    ├── node.ts                     # Node.js exports
    └── index.ts                    # Public API
```

The conventions on feature folders is explained more in-depth in [CONVENTIONS.md](CONVENTIONS.md#feature-based-architecture)

### Configuration Directory (`src/config/`)

```txt
config/
├── constants.ts            # App-wide constants
├── enums.ts                # Shared enumerations
└── env.ts                  # Environment variable validation
```

### Data Directory (`src/data/`)

```txt
data/
├── application-error-messages.ts   # UI error messages
└── form-error-messages.ts          # Form validation messages
```

### Schemas Directory (`src/schemas/`)

Shared validation schemas:

```txt
schemas/
├── color-value-schema.ts   # HEX color validation
├── iso-timestamp-schema.ts # ISO date validation
├── numeric-id-schema.ts    # Numeric ID validation
├── positive-integer-schema.ts  # Positive int validation
├── required-string-schema.ts   # Required string validation
├── unix-timestamp-schema.ts    # Unix timestamp validation
└── index.ts                # Re-exports
```

### Types Directory (`src/types/`)

```txt
types/
├── components.ts           # Component prop types
├── helpers.ts              # Utility types
└── schemas.ts              # Schema-related types
```

### Utils Directory (`src/utils/`)

Pure utility functions:

```txt
utils/
├── get-rounded-date.ts     # Date utilities
├── is-empty-value.ts       # Value validation
├── is-unset-enum-field.ts  # Enum validation
├── transformations.ts      # Data transformations
├── typescript.ts           # TypeScript helpers
└── index.ts                # Re-exports
```

### Tests Directory (`src/tests/`)

```txt
tests/
├── e2e/                    # End-to-end tests
│   ├── api/                # API test helpers
│   ├── specs/              # Test specifications
│   ├── utils/              # E2E utilities
│   ├── types.ts            # Test types
│   ├── constants.ts        # Test constants
│   └── auth.setup.ts       # Auth setup
├── shared/                 # Shared test utilities
│   ├── mocks/              # Mock data and functions
│   └── utils/              # Shared test utils
└── unit/                   # Unit tests
    ├── components/         # Test components
    ├── config/             # Test configuration
    ├── mocks/              # Unit test mocks
    ├── providers/          # Test providers
    ├── utils/              # Unit test utilities
    ├── setup.ts            # Vitest setup
    └── index.ts            # Test exports
```

## Key Patterns

### Feature Structure

Each feature follows a consistent pattern:

- **`index.ts`**: Public API exports (client-side)
- **`server.ts`**: Server-side exports (React Server Components)
- **`node.ts`**: Node.js environment exports (for tests, build scripts)
- **`components/`**: Feature-specific UI components
- **`types/`**: Feature-specific TypeScript types
- **`utils/`**: Feature-specific utility functions

### Component Organization

Components are organized by their role:

- **`core/`**: Generic reusable components
- **`inputs/`**: Form input components
- **`presentation/`**: Website-specific display/presentational components
- **`ui/`**: Third-party UI library components (shadcn/ui)

### Test Organization

Tests are separated by type:

- **`e2e/`**: Playwright end-to-end tests
- **`unit/`**: Vitest unit tests
- **`shared/`**: Utilities shared across test types

Co-located test files use the pattern: `<component-name>.test.tsx`
