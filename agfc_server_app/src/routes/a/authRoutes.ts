import express from 'express'


import { authenticateToken } from '../middleware/auth'

import { AuthController } from '../controllers/AuthController'

const authController = new AuthController()
const router = express.Router()

router.post('/signup', authController.signupAdvertiser)
router.post('/signup/admin',authController.signupAdmin)
router.post('/signup/sports-admin',authController.createSportsAdmin)

router.post('/login', authController.login)
router.post('/forgot-password', authController.forgotPassword)
router.post(
  '/reset-password', authController.resetPassword
)
router.post('/verify-email',  authController.verifyEmail)
router.post('/resend-verification-code',authController.resendCode)
router.post('/refresh-token', authController.refreshToken)
router.get('/me', authenticateToken, authController.getMe)

export default router

