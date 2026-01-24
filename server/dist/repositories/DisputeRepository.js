"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisputeRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const Dispute_1 = require("@models/Dispute");
class DisputeRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Dispute_1.Dispute);
    }
    async findByAdvertiser(advertiserId) {
        return await this.findAll({
            where: { advertiserId },
            order: [['createdAt', 'DESC']]
        });
    }
}
exports.DisputeRepository = DisputeRepository;
//# sourceMappingURL=DisputeRepository.js.map