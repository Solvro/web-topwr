/**
 * This needs to be in a separate helper so it is executed before
 * other files that use environment variables are imported.
 */
import nextEnv from "@next/env";

// this needs to be a module import, not a named import, because otherwise
// Playwright's runtime fails to find the function and errors out
nextEnv.loadEnvConfig(process.cwd());
