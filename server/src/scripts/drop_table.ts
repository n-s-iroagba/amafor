
import sequelize from '../config/database';

const dropTable = async () => {
    try {
        await sequelize.getQueryInterface().dropTable('third_party_articles');
        console.log('Dropped third_party_articles table');
    } catch (e) {
        console.error('Error dropping table:', e);
    } finally {
        await sequelize.close();
    }
};

dropTable();
