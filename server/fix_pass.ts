import { User } from './src/models/User';
import AuthService from './src/services/AuthService';
import sequelize from './src/config/database';

async function fix() {
  await sequelize.authenticate();
  const auth = new AuthService();
  const newHash = await auth.hashPassword('password123');
  console.log('New hash for password123:', newHash);
  
  await User.update({ passwordHash: newHash }, { where: { email: 'scout@academy.com' } });
  
  const adminHash = await auth.hashPassword('12345678');
  await User.update({ passwordHash: adminHash }, { where: { email: 'nnamdisolomon@gmail.com' } });
  
  console.log('Updated passwords successfully.');
  process.exit(0);
}
fix().catch(err => { console.error(err); process.exit(1); });
