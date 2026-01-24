"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoutApplication = exports.ApplicationStatus = void 0;
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["PENDING"] = "pending";
    ApplicationStatus["APPROVED"] = "approved";
    ApplicationStatus["REJECTED"] = "rejected";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
class ScoutApplication extends sequelize_1.Model {
}
exports.ScoutApplication = ScoutApplication;
ScoutApplication.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true }
    },
    organization: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    socialUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    reason: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(ApplicationStatus)),
        defaultValue: ApplicationStatus.PENDING
    },
    reviewedBy: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true
    },
    reviewedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize: database_1.default,
    tableName: 'scout_applications',
    timestamps: true
});
exports.default = ScoutApplication;
//# sourceMappingURL=ScoutApplication.js.map