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
app.get(['/', '/index.html', '/index'], (req, res) => res.sendFile(path.join(__dirname, 'frontends/jinja2/index.html')));

// Dynamic Route Resolver for any page (e.g. /about maps to frontends/jinja2/about.html)
app.get('/:page', (req, res, next) => {
    // Skip API routes and actual file requests (like CSS/JS)
    if (req.url.startsWith('/api') || req.params.page.includes('.')) {
        return next();
    }

    const pageName = req.params.page;
    const filePath = path.join(__dirname, 'frontends/jinja2', `${pageName}.html`);
    
    const fs = require('fs');
    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    }
    
    // Check if 404.html exists
    const notFoundPath = path.join(__dirname, 'frontends/jinja2/404.html');
    if (fs.existsSync(notFoundPath)) {
        return res.status(404).sendFile(notFoundPath);
    } else {
        return res.status(404).send("<h2>404 - BeatsVibe Page Not Found</h2>");
    }
});

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