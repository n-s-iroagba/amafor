// src/seeders/seed-runner.ts
import logger from "../../utils/logger";

export interface Seeder {
  seed(options?: any): Promise<number>;
  getName(): string;
}

export class SeedRunner {
  private seeders: Map<string, Seeder> = new Map();
  private dependencies: Map<string, string[]> = new Map();
  
  register(name: string, seeder: Seeder, deps: string[] = []) {
    this.seeders.set(name, seeder);
    this.dependencies.set(name, deps);
  }
  
  async runAll(): Promise<void> {
    const seeded = new Set<string>();
    
    while (seeded.size < this.seeders.size) {
      let seededThisRound = false;
      
      for (const [name, seeder] of this.seeders) {
        if (seeded.has(name)) continue;
        
        const deps = this.dependencies.get(name) || [];
        const allDepsSeeded = deps.every(dep => seeded.has(dep));
        
        if (allDepsSeeded) {
          logger.info(`Running seeder: ${name}`);
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
  
  async run(name: string): Promise<void> {
    const seeder = this.seeders.get(name);
    if (!seeder) {
      throw new Error(`Seeder ${name} not found`);
    }
    await seeder.seed();
  }
}