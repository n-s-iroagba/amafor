export interface Seeder {
    seed(options?: any): Promise<number>;
    getName(): string;
}
export declare class SeedRunner {
    private seeders;
    private dependencies;
    register(name: string, seeder: Seeder, deps?: string[]): void;
    runAll(): Promise<void>;
    run(name: string): Promise<void>;
}
//# sourceMappingURL=seed-runner.d.ts.map