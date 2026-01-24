"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserStatus = exports.UserType = void 0;
const database_1 = __importDefault(require("@config/database"));
const sequelize_1 = require("sequelize");
var UserType;
(function (UserType) {
    UserType["FAN"] = "fan";
    UserType["SCOUT"] = "scout";
    UserType["ADVERTISER"] = "advertiser";
    UserType["PATRON"] = "patron";
    UserType["DONOR"] = "donor";
    UserType["MEDIA_MANAGER"] = "media_manager";
    UserType["SPORTS_ADMIN"] = "sports_admin";
    UserType["DATA_STEWARD"] = "data_steward";
    UserType["COMMERCIAL_MANAGER"] = "commercial_manager";
    UserType["IT_SECURITY"] = "it_security";
    UserType["SUPER_ADMIN"] = "super_admin";
})(UserType || (exports.UserType = UserType = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["PENDING_VERIFICATION"] = "pending_verification";
    UserStatus["SUSPENDED"] = "suspended";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    passwordHash: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true
    },
    avatarUrl: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    userType: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(UserType)),
        allowNull: false,
        defaultValue: UserType.FAN
    },
    roles: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(UserStatus)),
        allowNull: false,
        defaultValue: UserStatus.PENDING_VERIFICATION
    },
    emailVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    verificationToken: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true
    },
    verificationTokenExpires: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    passwordResetToken: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true
    },
    passwordResetExpires: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    metadata: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
    },
    lastLogin: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    loginAttempts: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    lockUntil: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    }, createdAt: {
        type: sequelize_1.DataTypes.DATE
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE
    },
}, {
    sequelize: database_1.default,
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    indexes: [
        { fields: ['email'], unique: true },
        { fields: ['userType'] },
        { fields: ['status'] },
        { fields: ['createdAt'] }
    ]
});
exports.default = User;
//# sourceMappingURL=User.js.map