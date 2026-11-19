import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import vnpay from '../config/vnpay.js'

// Placing orders using COD Method
const placeOrder = async (req,res) => {
    
    try {
        
        const { userId, items, amount, address} = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"COD",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success:true,message:"Order Placed"})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Placing orders using VNPay Method
const placeOrderVnpay = async (req,res) => {
    try {

        const { userId, items, amount, address} = req.body
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"VNPay",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        let ipAddr = req.headers['x-forwarded-for'] || req.ip || '127.0.0.1'
        ipAddr = ipAddr.split(',')[0].trim().replace('::ffff:', '')

        const paymentUrl = vnpay.buildPaymentUrl({
            vnp_Amount: amount,
            vnp_IpAddr: ipAddr,
            vnp_TxnRef: newOrder._id.toString(),
            vnp_OrderInfo: `Order_${newOrder._id}`,
            vnp_ReturnUrl: `${origin}/verify`,
            vnp_Locale: 'vn',
        })

        res.json({success:true, payment_url: paymentUrl});

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// Verify VNPay return URL (browser redirect)
const verifyVnpay = async (req,res) => {

    try {

        const vnpParams = {}
        for (const [key, value] of Object.entries(req.body)) {
            if (key.startsWith('vnp_')) vnpParams[key] = value
        }

        const verify = vnpay.verifyReturnUrl(vnpParams)

        if (!verify.isVerified) {
            console.log('VNPay verify FAIL: checksum mismatch', {
                keys: Object.keys(vnpParams),
                vnp_Amount: vnpParams.vnp_Amount,
                vnp_TxnRef: vnpParams.vnp_TxnRef,
                vnp_ResponseCode: vnpParams.vnp_ResponseCode
            })
            return res.json({success:false, message: verify.message || 'Invalid signature'})
        }

        const orderId = req.body.vnp_TxnRef
        const order = await orderModel.findById(orderId)

        if (!order) {
            return res.json({success:false, message:'Order not found'})
        }

        if (order.payment) {
            return res.json({success:true})
        }

        const amountMatch = Number(req.body.vnp_Amount) === Number(order.amount) * 100

        if (verify.isSuccess && amountMatch) {
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            await userModel.findByIdAndUpdate(req.body.userId, {cartData: {}})
            console.log(`VNPay verify OK: order ${orderId} paid, cart cleared`)
            return res.json({success: true});
        }

        if (!verify.isSuccess) {
            console.log('VNPay verify: payment failed at gateway', req.body.vnp_ResponseCode)
            await orderModel.findByIdAndDelete(orderId)
            return res.json({success:false, message: verify.message || 'Payment failed'})
        }

        console.log(`VNPay amount mismatch for order ${orderId}: vnp=${req.body.vnp_Amount} order=${order.amount}`)
        res.json({success:false, message:'Amount mismatch'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// VNPay IPN (server-to-server notification)
const vnpayIpn = async (req,res) => {
    try {

        const verify = vnpay.verifyIpnCall(req.query)

        if (!verify.isVerified) {
            return res.json({RspCode:'07', Message:'Invalid checksum'})
        }

        const orderId = req.query.vnp_TxnRef
        const order = await orderModel.findById(orderId)

        if (!order) {
            return res.json({RspCode:'01', Message:'Order not found'})
        }

        const amountMatch = Number(req.query.vnp_Amount) === Number(order.amount) * 100
        if (!amountMatch) {
            return res.json({RspCode:'04', Message:'Invalid amount'})
        }

        if (verify.isSuccess && !order.payment) {
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            await userModel.findByIdAndUpdate(order.userId, {cartData: {}})
        }

        res.json({RspCode:'00', Message:'success'})

    } catch (error) {
        console.log(error)
        res.json({RspCode:'99', Message:'Unknown error'})
    }
}


// All Orders data for Admin Panel
const allOrders = async (req,res) => {

    try {
        
        const orders = await orderModel.find({})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// User Order Data For Forntend
const userOrders = async (req,res) => {
    try {
        
        const { userId } = req.body

        const orders = await orderModel.find({ userId })
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// update order status from Admin Panel
const updateStatus = async (req,res) => {
    try {
        
        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:true,message:'Status Updated'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {placeOrder, placeOrderVnpay, verifyVnpay, vnpayIpn, allOrders, userOrders, updateStatus}
