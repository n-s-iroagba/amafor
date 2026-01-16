import { seeder } from "../seeders/seeders";

async function runSeeders() {
  try {
    await seeder.runAll();
    console.log('All seeders completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Failed to run seeders:', error);
    process.exit(1);
  }
}

runSeeders();