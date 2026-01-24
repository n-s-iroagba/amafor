"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeagueRepository = void 0;
const League_1 = __importDefault(require("../models/League"));
const BaseRepository_1 = require("./BaseRepository");
class LeagueRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(League_1.default);
    }
}
exports.LeagueRepository = LeagueRepository;
//# sourceMappingURL=LeagueRepository.js.map