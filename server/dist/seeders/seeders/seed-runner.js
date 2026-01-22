"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedRunner = void 0;
// src/seeders/seed-runner.ts
const logger_1 = __importDefault(require("../../utils/logger"));
class SeedRunner {
    constructor() {
        this.seeders = new Map();
        this.dependencies = new Map();
    }
    register(name, seeder, deps = []) {
        this.seeders.set(name, seeder);
        this.dependencies.set(name, deps);
    }
    async runAll() {
        const seeded = new Set();
        while (seeded.size < this.seeders.size) {
            let seededThisRound = false;
            for (const [name, seeder] of this.seeders) {
                if (seeded.has(name))
                    continue;
                const deps = this.dependencies.get(name) || [];
                const allDepsSeeded = deps.every(dep => seeded.has(dep));
                if (allDepsSeeded) {
                    logger_1.default.info(`Running seeder: ${name}`);
                    await seeder.seed();
                    seeded.add(name);
                    seededThisRound = true;
                }
            }
            if (!seededThisRound && seeded.size < this.seeders.size) {
                throw new Error('Circular dependency detected in seeders');
            }
        }
    }
    async run(name) {
        const seeder = this.seeders.get(name);
        if (!seeder) {
            throw new Error(`Seeder ${name} not found`);
        }
        await seeder.seed();
    }
}
exports.SeedRunner = SeedRunner;
//# sourceMappingURL=seed-runner.js.map