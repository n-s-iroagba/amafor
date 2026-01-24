"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = exports.EntityType = exports.AuditAction = void 0;
const database_1 = __importDefault(require("@config/database"));
const sequelize_1 = require("sequelize");
var AuditAction;
(function (AuditAction) {
    AuditAction["CREATE"] = "create";
    AuditAction["UPDATE"] = "update";
    AuditAction["DELETE"] = "delete";
    AuditAction["LOGIN"] = "login";
    AuditAction["LOGOUT"] = "logout";
    AuditAction["PAYMENT"] = "payment";
    AuditAction["VIEW"] = "view";
    AuditAction["ACCESS"] = "access";
    AuditAction["BULK_IMPORT"] = "bulk_import";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
var EntityType;
(function (EntityType) {
    EntityType["USER"] = "user";
    EntityType["PLAYER"] = "player";
    EntityType["ARTICLE"] = "article";
    EntityType["FIXTURE"] = "fixture";
    EntityType["CAMPAIGN"] = "campaign";
    EntityType["DONATION"] = "donation";
    EntityType["PATRON"] = "patron";
    EntityType["SYSTEM"] = "system";
    EntityType["STAFF"] = "staff";
})(EntityType || (exports.EntityType = EntityType = {}));
class AuditLog extends sequelize_1.Model {
}
exports.AuditLog = AuditLog;
AuditLog.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    timestamp: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    userEmail: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    userType: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false
    },
    action: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(AuditAction)),
        allowNull: false
    },
    entityType: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(EntityType)),
        allowNull: false
    },
    entityId: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    entityName: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: true
    },
    oldValue: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true
    },
    newValue: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true
    },
    ipAddress: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: true
    },
    userAgent: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    changes: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: []
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
    }
}, {
    sequelize: database_1.default,
    tableName: 'audit_logs',
    timestamps: true,
    indexes: [
        { fields: ['timestamp'] },
        { fields: ['userId'] },
        { fields: ['entityType', 'entityId'] },
        { fields: ['action'] },
        { fields: ['userType'] },
        { fields: ['createdAt'] }
    ]
});
exports.default = AuditLog;
//# sourceMappingURL=AuditLog.js.map