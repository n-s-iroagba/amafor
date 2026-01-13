import { Router } from 'express'
import { PaymentController } from '../controllers/PaymentController'
import { PaymentGatewayController } from '../controllers/PaymentGatewayController'

const router = Router()

router.get('/advertiser', PaymentController.getPaymentsByAdvertiserId)
router.get('/', PaymentController.getAllPayments)

router.post('/initialize', PaymentGatewayController.initializePayment)
router.post('/verify/:reference', PaymentGatewayController.verifyTransaction)
router.post('/webhook', PaymentGatewayController.handleWebhook)

export default router