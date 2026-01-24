"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemNotification = exports.NotificationSeverity = exports.NotificationType = void 0;
const database_1 = __importDefault(require("@config/database"));
const sequelize_1 = require("sequelize");
var NotificationType;
(function (NotificationType) {
    NotificationType["SYSTEM"] = "system";
    NotificationType["USER"] = "user";
    NotificationType["PAYMENT"] = "payment";
    NotificationType["CONTENT"] = "content";
    NotificationType["SECURITY"] = "security";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationSeverity;
(function (NotificationSeverity) {
    NotificationSeverity["INFO"] = "info";
    NotificationSeverity["WARNING"] = "warning";
    NotificationSeverity["ERROR"] = "error";
    NotificationSeverity["CRITICAL"] = "critical";
})(NotificationSeverity || (exports.NotificationSeverity = NotificationSeverity = {}));
class SystemNotification extends sequelize_1.Model {
}
exports.SystemNotification = SystemNotification;
SystemNotification.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    type: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(NotificationType)),
        allowNull: false
    },
    severity: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(NotificationSeverity)),
        allowNull: false,
        defaultValue: NotificationSeverity.INFO
    },
    title: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    data: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
    },
    read: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true
    },
    actionUrl: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    expiresAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    metadata: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
    }, createdAt: {
        type: sequelize_1.DataTypes.DATE
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE
    },
}, {
    sequelize: database_1.default,
    tableName: 'system_notifications',
    timestamps: true,
    paranoid: true,
    indexes: [
        { fields: ['userId'] },
        { fields: ['type'] },
        { fields: ['severity'] },
        { fields: ['read'] },
        { fields: ['createdAt'] },
        { fields: ['expiresAt'] }
    ]
});
exports.default = SystemNotification;
//# sourceMappingURL=SystemNotification.js.map