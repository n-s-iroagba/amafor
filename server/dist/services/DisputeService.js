"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisputeService = void 0;
const DisputeRepository_1 = require("../repositories/DisputeRepository");
const utils_1 = require("../utils");
class DisputeService {
    constructor() {
        this.disputeRepository = new DisputeRepository_1.DisputeRepository();
    }
    async createDispute(data) {
        return utils_1.tracer.startActiveSpan('service.DisputeService.createDispute', async (span) => {
            try {
                return await this.disputeRepository.create(data);
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getDisputesByAdvertiser(advertiserId) {
        return await this.disputeRepository.findByAdvertiser(advertiserId);
    }
    async getDisputeById(id) {
        return await this.disputeRepository.findById(id);
    }
}
exports.DisputeService = DisputeService;
//# sourceMappingURL=DisputeService.js.map