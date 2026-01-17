"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdCampaign = exports.PaymentStatus = exports.CampaignStatus = exports.AdZone = void 0;
const database_1 = __importDefault(require("@config/database"));
const sequelize_1 = require("sequelize");
var AdZone;
(function (AdZone) {
    AdZone["HOMEPAGE_BANNER"] = "homepage_banner";
    AdZone["TOP_PAGE_BANNER"] = "top_page_banner";
    AdZone["SIDEBAR"] = "sidebar";
    AdZone["ARTICLE_FOOTER"] = "article_footer";
    AdZone["MID_ARTICLE"] = "mid_article";
})(AdZone = exports.AdZone || (exports.AdZone = {}));
var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["DRAFT"] = "draft";
    CampaignStatus["PENDING_PAYMENT"] = "pending_payment";
    CampaignStatus["ACTIVE"] = "active";
    CampaignStatus["PAUSED"] = "paused";
    CampaignStatus["COMPLETED"] = "completed";
    CampaignStatus["CANCELLED"] = "cancelled";
})(CampaignStatus = exports.CampaignStatus || (exports.CampaignStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PAID"] = "paid";
    PaymentStatus["REFUNDED"] = "refunded";
    PaymentStatus["FAILED"] = "failed";
})(PaymentStatus = exports.PaymentStatus || (exports.PaymentStatus = {}));
class AdCampaign extends sequelize_1.Model {
}
exports.AdCampaign = AdCampaign;
AdCampaign.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    advertiserId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(CampaignStatus)),
        allowNull: false,
        defaultValue: CampaignStatus.DRAFT
    },
    budget: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0
    },
    spent: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0
    },
    viewsDelivered: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    uniqueViews: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    targeting: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
    },
    paymentStatus: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(PaymentStatus)),
        allowNull: false,
        defaultValue: PaymentStatus.PENDING
    },
    paymentReference: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true
    },
    cpv: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },
    startDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    endDate: {
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
    }
}, {
    sequelize: database_1.default,
    tableName: 'ad_campaigns',
    timestamps: true,
    paranoid: true,
    indexes: [
        { fields: ['advertiserId'] },
        { fields: ['status'] },
        { fields: ['paymentStatus'] },
        { fields: ['createdAt'] }
    ]
});
exports.default = AdCampaign;
//# sourceMappingURL=AdCampaign.js.map