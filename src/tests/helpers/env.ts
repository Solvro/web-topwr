/**
 * This needs to be in a separate helper so it is executed before
 * other files that use environment variables are imported.
 */
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
