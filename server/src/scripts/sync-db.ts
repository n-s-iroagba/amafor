
import sequelize from '../config/database';
import { setupAssociations } from '../models/index';

const syncDb = async () => {
    try {
        await setupAssociations();
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error syncing database:', error);
        process.exit(1);
    }
};

syncDb();
