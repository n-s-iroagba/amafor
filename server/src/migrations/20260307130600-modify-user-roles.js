const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // 1. Add new JSON column
    await queryInterface.addColumn('users', 'roles', {
      type: DataTypes.JSON,
      allowNull: true,
    });

    // 2. Migrate existing data (wrap existing 'role' in an array)
    await queryInterface.sequelize.query(`
      UPDATE users 
      SET roles = JSON_ARRAY(role);
    `);

    // 3. Make roles column not nullable after migration
    await queryInterface.changeColumn('users', 'roles', {
      type: DataTypes.JSON,
      allowNull: false,
    });

    // 4. Remove old enum column
    await queryInterface.removeColumn('users', 'role');
  },

  down: async (queryInterface) => {
    // 1. Re-add old ENUM column
    await queryInterface.addColumn('users', 'role', {
      type: DataTypes.ENUM('admin', 'scout', 'advertiser', 'academy_staff', 'commercial_manager', 'sports_admin', 'finance_officer', 'it_security', 'fan'),
      allowNull: true,
    });

    // 2. Migrate data back (extract first role from JSON array)
    await queryInterface.sequelize.query(`
      UPDATE users 
      SET role = JSON_UNQUOTE(JSON_EXTRACT(roles, '$[0]'));
    `);

    // 3. Make role column not nullable again
    await queryInterface.changeColumn('users', 'role', {
      type: DataTypes.ENUM('admin', 'scout', 'advertiser', 'academy_staff', 'commercial_manager', 'sports_admin', 'finance_officer', 'it_security', 'fan'),
      allowNull: false,
    });

    // 4. Remove new roles JSON column
    await queryInterface.removeColumn('users', 'roles');
  }
};

