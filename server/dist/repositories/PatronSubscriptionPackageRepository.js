"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatronSubscriptionPackageRepository = void 0;
const PatronSubscriptionPackage_1 = __importDefault(require("@models/PatronSubscriptionPackage"));
const BaseRepository_1 = require("./BaseRepository");
class PatronSubscriptionPackageRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(PatronSubscriptionPackage_1.default);
    }
}
exports.PatronSubscriptionPackageRepository = PatronSubscriptionPackageRepository;
//# sourceMappingURL=PatronSubscriptionPackageRepository.js.map