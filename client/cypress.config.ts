import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: "http://localhost:3000",
        defaultCommandTimeout: 60000,
        pageLoadTimeout: 120000,
        responseTimeout: 120000,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
