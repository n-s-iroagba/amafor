"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TrialistController_1 = require("../controllers/TrialistController");
const trialistSchema_1 = require("../validation-schema/trialistSchema");
const validate_1 = require("@middleware/validate");
const router = express_1.default.Router();
// Create trialist (with file upload)
router.post('/', (0, validate_1.validate)(trialistSchema_1.trialistValidationSchemas.createTrialist), TrialistController_1.trialistController.createTrialist);
// Get all trialists with filters
router.get('/', (0, validate_1.validate)(trialistSchema_1.trialistValidationSchemas.filterQuery), TrialistController_1.trialistController.getAllTrialists);
// Get trialist by ID
router.get('/:id', (0, validate_1.validate)(trialistSchema_1.trialistValidationSchemas.trialistIdParam), TrialistController_1.trialistController.getTrialistById);
// Update trialist
router.put('/:id', (0, validate_1.validate)(trialistSchema_1.trialistValidationSchemas.updateTrialist), TrialistController_1.trialistController.updateTrialist);
// Delete trialist
router.delete('/:id', (0, validate_1.validate)(trialistSchema_1.trialistValidationSchemas.trialistIdParam), TrialistController_1.trialistController.deleteTrialist);
// Update trialist status
router.patch('/:id/status', (0, validate_1.validate)(trialistSchema_1.trialistValidationSchemas.updateStatus), TrialistController_1.trialistController.updateStatus);
// Search trialists
router.get('/search', (0, validate_1.validate)(trialistSchema_1.trialistValidationSchemas.searchQuery), TrialistController_1.trialistController.searchTrialists);
// Get statistics
router.get('/stats', TrialistController_1.trialistController.getStatistics);
exports.default = router;
//# sourceMappingURL=trialistRoutes.js.map