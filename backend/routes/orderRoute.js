import express from 'express'
import {placeOrder, placeOrderVnpay, allOrders, userOrders, updateStatus, verifyVnpay, vnpayIpn} from '../controllers/orderController.js'
import adminAuth  from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

// Payment Features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/vnpay',authUser,placeOrderVnpay)

// User Feature
orderRouter.post('/userorders',authUser,userOrders)

// verify payment
orderRouter.post('/verifyVnpay',authUser, verifyVnpay)

// VNPay IPN (server-to-server, called by VNPay)
orderRouter.get('/vnpay-ipn', vnpayIpn)

export default orderRouter
