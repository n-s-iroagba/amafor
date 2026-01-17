"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdZoneModel = exports.AdZoneType = exports.AdZoneStatus = void 0;
// models/AdZone.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
var AdZoneStatus;
(function (AdZoneStatus) {
    AdZoneStatus["ACTIVE"] = "active";
    AdZoneStatus["INACTIVE"] = "inactive";
    AdZoneStatus["MAINTENANCE"] = "maintenance";
})(AdZoneStatus = exports.AdZoneStatus || (exports.AdZoneStatus = {}));
var AdZoneType;
(function (AdZoneType) {
    AdZoneType["BANNER"] = "banner";
    AdZoneType["SIDEBAR"] = "sidebar";
    AdZoneType["INLINE"] = "inline";
    AdZoneType["FOOTER"] = "footer";
})(AdZoneType = exports.AdZoneType || (exports.AdZoneType = {}));
// Main AdZone model
class AdZoneModel extends sequelize_1.Model {
    // Instance methods and Static methods remain the same...
    getFormattedPrice() {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
        }).format(this.pricePerView / 100);
    }
}
exports.AdZoneModel = AdZoneModel;
// Model initialization
AdZoneModel.init({
    id: {
        type: sequelize_1.DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    pricePerView: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'price_per_view'
    },
    type: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(AdZoneType)),
        allowNull: false,
    },
    dimensions: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    maxSize: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
        defaultValue: '1MB',
        field: 'max_size'
    },
    tags: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(AdZoneStatus)),
        allowNull: false,
        defaultValue: AdZoneStatus.ACTIVE,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'created_at'
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'updated_at'
    }
}, {
    tableName: 'ad_zones',
    sequelize: database_1.default,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    // ... indexes
});
exports.default = AdZoneModel;
//# sourceMappingURL=AdZones.js.map