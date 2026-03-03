import { User } from './src/models/User';
import { PasswordService } from './src/services/PasswordService';
import sequelize from './src/config/database';

async function test() {
  await sequelize.authenticate();
  const user = await User.findOne({ where: { email: 'scout@academy.com' } });
  if (!user) {
    console.log("User not found!");
    process.exit(1);
  }
  
  console.log("DB Hash:", user.passwordHash);
  
  const ps = new PasswordService();
  const match = await ps.comparePasswords('password123', user.passwordHash);
  console.log("Match:", match);
  
  // Try generating a new one and testing it immediately
  const newHash = await ps.hashPassword('password123');
  console.log("New Hash:", newHash);
  const match2 = await ps.comparePasswords('password123', newHash);
  console.log("New Match:", match2);
  
  process.exit(0);
}

test().catch(err => { console.error(err); process.exit(1); });
