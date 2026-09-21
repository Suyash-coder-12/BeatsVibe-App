const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https'); // Used for direct HTTP call since we don't assume razorpay SDK is globally installed

const app = express();
const PORT = 5000;
const ROOT_DIR = path.join(__dirname, '..');

const RAZORPAY_KEY_ID = "rzp_test_TU6zzd7qlXCLZs";
const RAZORPAY_KEY_SECRET = "UPYyQwzaQrNEixYnB1xS0yc4";

app.use(cors());
app.use(express.json());
app.use(express.static(ROOT_DIR));

const htmlRoutes = [
    { path: '/', file: 'index.html' },
    { path: '/index.html', file: 'index.html' },
    { path: '/dashboard', file: 'dashboard.html' },
    { path: '/dashboard.html', file: 'dashboard.html' },
    { path: '/course-details', file: 'course-details.html' },
    { path: '/course-details.html', file: 'course-details.html' },
    { path: '/login', file: 'login.html' },
    { path: '/login.html', file: 'login.html' },
    { path: '/register', file: 'register.html' },
    { path: '/register.html', file: 'register.html' },
    { path: '/programs', file: 'programs.html' },
    { path: '/programs.html', file: 'programs.html' },
    { path: '/admin', file: 'admin.html' },
    { path: '/admin.html', file: 'admin.html' }
];

htmlRoutes.forEach(route => {
    app.get(route.path, (req, res) => {
        res.sendFile(path.join(ROOT_DIR, route.file));
    });
});

app.post('/api/payment/create-order', (req, res) => {
    try {
        const { amount, studentId } = req.body;
        const amountPaise = (amount || 0) * 100;
        
        const payload = JSON.stringify({
            amount: amountPaise,
            currency: "INR",
            receipt: `rcpt_${studentId || 'unknown'}_${Date.now()}`
        });

        const auth = 'Basic ' + Buffer.from(RAZORPAY_KEY_ID + ':' + RAZORPAY_KEY_SECRET).toString('base64');
        
        const options = {
            hostname: 'api.razorpay.com',
            port: 443,
            path: '/v1/orders',
            method: 'POST',
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json',
                'Content-Length': payload.length
            }
        };

        const rzpReq = https.request(options, (rzpRes) => {
            let rzpBody = '';
            rzpRes.on('data', (d) => { rzpBody += d; });
            rzpRes.on('end', () => {
                res.json({ success: true, order: JSON.parse(rzpBody) });
            });
        });

        rzpReq.on('error', (e) => {
            console.error("Order Creation Error:", e);
            res.status(500).json({ success: false, message: "Something went wrong with Razorpay!" });
        });

        rzpReq.write(payload);
        rzpReq.end();
        
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ success: false, message: "Something went wrong with Razorpay!" });
    }
});

app.listen(PORT, () => {
    console.log(`[SYS] BeatsVibe Express Server active on port ${PORT}`);
    console.log(`[SYS] Access the platform at: http://localhost:${PORT}`);
});
