import sequelize from '../config/database';

const checkColumns = async () => {
    try {
        const [results] = await sequelize.query("SHOW COLUMNS FROM trialists;");
        console.log('Columns in trialists table:', results);
        process.exit(0);
    } catch (error) {
        console.error('Error checking columns:', error);
        process.exit(1);
    }
};

checkColumns();
