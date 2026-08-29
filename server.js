const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// ==========================================
// 1. MIDDLEWARE SETUP
// ==========================================
app.use(cors());
app.use(express.json());

// Yeh line tere project folder ki saari HTML, CSS, aur JS files (jaise MERN ya AI ki lab files) ko automatic load hone degi
app.use(express.static(__dirname)); 

// ==========================================
// 2. BULLETPROOF URL ROUTING
// ==========================================
// Home Page
app.get(['/', '/index.html'], (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// Dashboard
app.get(['/dashboard', '/dashboard.html'], (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));

// Course Details Page
app.get(['/course-details', '/course-details.html'], (req, res) => res.sendFile(path.join(__dirname, 'course-details.html')));

// Auth Pages (Login & Register)
app.get(['/login', '/login.html'], (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get(['/register', '/register.html'], (req, res) => res.sendFile(path.join(__dirname, 'register.html')));

// Programs Store
app.get(['/programs', '/programs.html'], (req, res) => res.sendFile(path.join(__dirname, 'programs.html')));

// 🌟 Root Admin Portal 🌟
app.get(['/admin', '/admin.html'], (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));

// ==========================================
// 3. RAZORPAY INITIALIZATION
// ==========================================
// Note: Frontend me hamesha Key ID use hoti hai, Backend me Secret!
const razorpay = new Razorpay({
    key_id: "rzp_test_TU6zzd7qlXCLZs",      
    key_secret: "UPYyQwzaQrNEixYnB1xS0yc4"  
});

// ==========================================
// 4. API ROUTE TO CREATE ORDER
// ==========================================
app.post('/api/payment/create-order', async (req, res) => {
    try {
        const { amount, courseName, studentId } = req.body;
        
        const options = {
            amount: amount * 100, // Amount ko paise me convert karna zaroori hai (₹4999 * 100)
            currency: "INR",
            receipt: `rcpt_${studentId}_${Date.now()}`
        };
        
        const order = await razorpay.orders.create(options);
        
        res.json({ 
            success: true, 
            order: order 
        });

    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ success: false, message: "Something went wrong with Razorpay!" });
    }
});

// ==========================================
// 5. START SERVER
// ==========================================
app.listen(PORT, () => {
    console.log(`[SYS] BeatsVibe Server active on port ${PORT}`);
    console.log(`[SYS] Access the platform at: http://localhost:${PORT}`);
});