import sequelize from './src/config/database';
import { User } from './src/models/User';

async function run() {
  try {
    await sequelize.authenticate();
    const users = await User.findAll({ attributes: ['id', 'email', 'role']});
    console.log('Users found:', users.map(u => u.toJSON()));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
run();
