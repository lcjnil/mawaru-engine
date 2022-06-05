import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        setupFiles: ["./spec/setup.ts"],
    },
});
