import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import { cors } from '@elysiajs/cors';
import { join } from 'path';

const PORT = 5000;
const RAZORPAY_KEY_ID = "rzp_test_TU6zzd7qlXCLZs";
const RAZORPAY_KEY_SECRET = "UPYyQwzaQrNEixYnB1xS0yc4";

const ROOT_DIR = join(import.meta.dir, '..');

const app = new Elysia()
    .use(cors())
    .use(staticPlugin({
        assets: ROOT_DIR,
        prefix: '/'
    }));

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
    app.get(route.path, () => Bun.file(join(ROOT_DIR, route.file)));
});

app.post('/api/payment/create-order', async ({ body }: any) => {
    try {
        const amount = (body.amount || 0) * 100;
        const studentId = body.studentId || 'unknown';
        
        const authString = `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`;
        const encodedAuth = Buffer.from(authString).toString('base64');
        
        const payload = {
            amount: amount,
            currency: 'INR',
            receipt: `rcpt_${studentId}_${Date.now()}`
        };
        
        const response = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${encodedAuth}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        
        const orderData = await response.json();
        
        return { success: true, order: orderData };
        
    } catch (error) {
        console.error("Order Creation Error:", error);
        return new Response(JSON.stringify({ success: false, message: "Something went wrong with Razorpay!" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

app.listen(PORT);
console.log(`[SYS] BeatsVibe Bun Server active on port ${PORT}`);
