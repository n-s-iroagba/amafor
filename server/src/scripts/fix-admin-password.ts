import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database';

const fixPassword = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB Connected');

        const admin = await User.findOne({ where: { email: 'admin@academy.com' } });
        if (!admin) {
            console.error('Admin user not found!');
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('password123', salt);

        admin.passwordHash = hash;
        await admin.save();
        console.log('Admin password updated successfully to match "password123"');

    } catch (error) {
        console.error('Error updating password:', error);
    } finally {
        await sequelize.close();
    }
};

fixPassword();
