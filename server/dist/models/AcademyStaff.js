"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/AcademyStaff.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class AcademyStaff extends sequelize_1.Model {
}
AcademyStaff.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 150],
        },
    },
    role: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    bio: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [10, 2000],
        },
    },
    initials: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
    },
    imageUrl: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
        validate: {
            isUrl: true,
        },
    },
    category: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
        validate: {
            isIn: [['coaching', 'medical', 'administrative', 'technical', 'scouting']],
        },
    },
    qualifications: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },
    yearsOfExperience: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
            max: 60,
        },
    },
}, {
    sequelize: database_1.default,
    modelName: 'AcademyStaff',
    tableName: 'academy_staff',
    timestamps: true,
    paranoid: false, // Set to true if you want soft deletes
    indexes: [
        {
            fields: ['name'],
        },
        {
            fields: ['category'],
        },
        {
            fields: ['role'],
        },
    ],
});
// Hook to set initials if not provided
AcademyStaff.beforeCreate((staff) => {
    if (!staff.initials) {
        const nameParts = staff.name.split(' ');
        staff.initials = nameParts
            .map(part => part.charAt(0).toUpperCase())
            .join('')
            .slice(0, 2);
    }
});
exports.default = AcademyStaff;
//# sourceMappingURL=AcademyStaff.js.map