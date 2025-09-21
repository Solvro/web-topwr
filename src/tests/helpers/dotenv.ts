import nextEnv from "@next/env";

// For some reason using the named export fails at runtime, so we have to import the whole module
nextEnv.loadEnvConfig(process.cwd());
