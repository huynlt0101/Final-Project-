import { VNPay } from 'vnpay'

const vnpay = new VNPay({
    tmnCode: process.env.VNPAY_TMN_CODE,
    secureSecret: process.env.VNPAY_HASH_SECRET,
    testMode: true,
})

export default vnpay
