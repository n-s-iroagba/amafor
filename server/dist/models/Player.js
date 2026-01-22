"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = exports.PlayerStatus = exports.PlayerPosition = void 0;
// models/Player.ts
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
var PlayerPosition;
(function (PlayerPosition) {
    PlayerPosition["GK"] = "GK";
    PlayerPosition["DF"] = "DF";
    PlayerPosition["MF"] = "MF";
    PlayerPosition["FW"] = "FW";
})(PlayerPosition = exports.PlayerPosition || (exports.PlayerPosition = {}));
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus["ACTIVE"] = "active";
    PlayerStatus["INJURED"] = "injured";
    PlayerStatus["SUSPENDED"] = "suspended";
    PlayerStatus["TRANSFERRED"] = "transferred";
})(PlayerStatus = exports.PlayerStatus || (exports.PlayerStatus = {}));
class Player extends sequelize_1.Model {
}
exports.Player = Player;
Player.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    dateOfBirth: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false
    },
    position: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(PlayerPosition)),
        allowNull: false
    },
    height: {
        type: sequelize_1.DataTypes.DECIMAL(3, 2),
        allowNull: true,
        comment: 'Height in meters'
    },
    nationality: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true
    },
    biography: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    jerseyNumber: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 99
        }
    },
    imageUrl: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(PlayerStatus)),
        allowNull: false,
        defaultValue: PlayerStatus.ACTIVE
    },
    joinedDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true
    },
    previousClubs: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    contactEmail: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    contactPhone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true
    },
    agentName: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: true
    },
    agentEmail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    metadata: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE
    },
    createdById: {
        type: sequelize_1.DataTypes.UUID
    },
    updatedById: {
        type: sequelize_1.DataTypes.UUID
    }
}, {
    sequelize: database_1.default,
    tableName: 'players',
    timestamps: true,
    paranoid: true,
    indexes: [
        { fields: ['name'] },
        { fields: ['position'] },
        { fields: ['status'] },
        { fields: ['createdAt'] }
    ]
});
exports.default = Player;
//# sourceMappingURL=Player.js.map