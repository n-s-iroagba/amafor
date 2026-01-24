"use strict";
// src/seeders/seeders/ad-zone-seeder.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdZoneSeeder = void 0;
const logger_1 = __importDefault(require("@utils/logger"));
const AdZones_1 = __importStar(require("@models/AdZones"));
const base_seeder_1 = require("./base-seeder");
class AdZoneSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(AdZones_1.default, 'ad-zones');
    }
    async getData(environment) {
        logger_1.default.info(`Loading ${this.name} data for ${environment} environment`);
        // Ad zones are the same for all environments since they're predefined
        return this.getPredefinedZones();
    }
    getPredefinedZones() {
        return [
            {
                id: 'TP_BAN',
                name: 'Top Page Banner',
                dimensions: '970x250',
                maxSize: '2MB',
                type: AdZones_1.AdZoneType.BANNER,
                description: 'Top of content pages across the site for maximum visibility',
                pricePerView: 500,
                status: AdZones_1.AdZoneStatus.ACTIVE,
                tags: ['general', 'sports'],
            },
            {
                id: 'SIDEBAR',
                name: 'Sidebar',
                dimensions: '300x250',
                maxSize: '1MB',
                type: AdZones_1.AdZoneType.SIDEBAR,
                description: 'Persistent sidebar placement on content pages for sustained exposure',
                pricePerView: 250,
                status: AdZones_1.AdZoneStatus.ACTIVE,
                tags: ['news', 'features'],
            },
            {
                id: 'ART_FOOT',
                name: 'Article Footer',
                dimensions: '728x90',
                maxSize: '1.5MB',
                type: AdZones_1.AdZoneType.FOOTER,
                description: 'Banner at the bottom of article pages after content',
                pricePerView: 150,
                status: AdZones_1.AdZoneStatus.ACTIVE,
                tags: ['editorial'],
            },
            {
                id: 'MID_ART',
                name: 'Mid-Article Banner',
                dimensions: '640x360',
                maxSize: '2MB',
                type: AdZones_1.AdZoneType.INLINE,
                description: 'Video ad embedded within article content after first 100 words',
                pricePerView: 400,
                status: AdZones_1.AdZoneStatus.ACTIVE,
                tags: ['video', 'engagement'],
            }
        ];
    }
    // Override seed method to ensure zones are only seeded if table is empty
    async seed(options = {}) {
        // Check if zones already exist
        const existingCount = await this.model.count();
        if (existingCount > 0) {
            logger_1.default.info(`Skipping ${this.name} seeder - ${existingCount} zones already exist`);
            return 0;
        }
        logger_1.default.info('Seeding predefined ad zones...');
        return super.seed(options);
    }
    // Override clear method to prevent accidental deletion
    async clear(transaction) {
        logger_1.default.warn('Ad zones are predefined and should not be cleared');
        return 0;
    }
    // Method to update prices if needed
    async updateZonePrices(newPrices) {
        let updatedCount = 0;
        for (const [type, price] of Object.entries(newPrices)) {
            const adZone = await this.model.findOne({ where: { type } });
            if (adZone) {
                await adZone.update({ pricePerView: price });
                updatedCount++;
                logger_1.default.info(`Updated price for zone ${type} to ${price} kobo`);
            }
        }
        return updatedCount;
    }
    // Method to reset all zones to default prices
    async resetToDefaultPrices() {
        const defaultZones = this.getPredefinedZones();
        let updatedCount = 0;
        for (const zoneData of defaultZones) {
            const adZone = await this.model.findOne({ where: { type: zoneData.type } });
            if (adZone && adZone.pricePerView !== zoneData.pricePerView) {
                await adZone.update({ pricePerView: zoneData.pricePerView });
                updatedCount++;
            }
        }
        logger_1.default.info(`Reset ${updatedCount} zones to default prices`);
        return updatedCount;
    }
}
exports.AdZoneSeeder = AdZoneSeeder;
//# sourceMappingURL=ad-zone-seeder.js.map