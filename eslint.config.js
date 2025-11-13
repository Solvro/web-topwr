import { solvro } from "@solvro/config/eslint";

export default solvro(
  {
    ignores: [
      "src/components/ui/*.ts?(x)",
      "src/components/ui/**/*.ts?(x)",
      "postcss.config.json",
    ],
  },
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            /**
             * Disallow deep imports in features — only allow:
             *   @/features/<feature>
             *   @/features/<feature>/<file>
             */
            {
              // Block everything under @/features/<feature>/ deeper than 1 level
              group: ["@/features/*/*/*"],
              message:
                "Do not import from deep inside a feature. Only import from the feature root or its top-level files.",
            },
            /** Disallow imports including '/ui/', except those starting with @/components. */
            {
              regex: "(?<!^@/components)/ui/",
              message:
                "Do not use relative imports for shadcn/ui components. Use the @/components/ui alias so your file is relocation-proof.",
            },
            {
              group: ["../../*"],
              message:
                "Do not use relative imports going up more than one level. Use absolute imports instead. If you need to go up multiple levels this probably indicates a wrong file structure.",
            },
          ],
        },
      ],
      "import/no-duplicates": "error",
    },
  },
);
