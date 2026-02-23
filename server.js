const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors()); // Frontend ko backend se baat karne ki permission deta hai
app.use(express.json()); // Data ko JSON format me read karta hai

// Razorpay Setup
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Route 1: Order Create karna (Frontend jab "Enroll" dabayega toh ye chalega)
app.post('/api/payment/create-order', async (req, res) => {
    try {
        const { amount, courseName, studentId } = req.body;

        const options = {
            amount: amount * 100, // Razorpay paise ko paise (currency) me leta hai, toh 100 se multiply karna padta hai
            currency: "INR",
            receipt: `receipt_${studentId}_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        
        res.status(200).json({
            success: true,
            order: order,
        });
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ success: false, message: "Server error during order creation" });
    }
});

// Route 2: Server Check
app.get('/', (req, res) => {
    res.send('BeatsVibe Backend System is Online. NeuroNova Core Active.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[SYS] Backend server running on port ${PORT}`);
});
