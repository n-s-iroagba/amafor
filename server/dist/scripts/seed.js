"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seeders_1 = require("../seeders/seeders");
async function runSeeders() {
    try {
        await seeders_1.seeder.runAll();
        console.log('All seeders completed successfully');
        process.exit(0);
    }
    catch (error) {
        console.error('Failed to run seeders:', error);
        process.exit(1);
    }
}
runSeeders();
//# sourceMappingURL=seed.js.map