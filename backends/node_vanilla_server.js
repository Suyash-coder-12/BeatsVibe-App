const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const RAZORPAY_KEY_ID = "rzp_test_TU6zzd7qlXCLZs";
const RAZORPAY_KEY_SECRET = "UPYyQwzaQrNEixYnB1xS0yc4";

const ROOT_DIR = path.join(__dirname, '..');

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const routes = {
    '/': 'index.html',
    '/dashboard': 'dashboard.html',
    '/course-details': 'course-details.html',
    '/login': 'login.html',
    '/register': 'register.html',
    '/programs': 'programs.html',
    '/admin': 'admin.html'
};

const server = http.createServer((req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/api/payment/create-order') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const amount = (parseInt(data.amount) || 0) * 100;
                const studentId = data.studentId || 'unknown';

                const payload = JSON.stringify({
                    amount: amount,
                    currency: "INR",
                    receipt: `rcpt_${studentId}_${Date.now()}`
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
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, order: JSON.parse(rzpBody) }));
                    });
                });

                rzpReq.on('error', (e) => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: e.message }));
                });

                rzpReq.write(payload);
                rzpReq.end();
            } catch (err) {
                res.writeHead(400);
                res.end(JSON.stringify({ success: false, message: "Invalid JSON" }));
            }
        });
        return;
    }

    // Static file serving
    let filePath = req.url;
    
    if (routes[req.url]) {
        filePath = '/' + routes[req.url];
    } else if (req.url.endsWith('/') && req.url !== '/') {
        filePath = req.url.slice(0, -1);
    }

    filePath = path.join(ROOT_DIR, filePath);
    if (filePath === path.join(ROOT_DIR, '/')) {
        filePath = path.join(ROOT_DIR, 'index.html');
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                res.writeHead(404);
                res.end("404 Not Found");
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`[SYS] BeatsVibe Node (Vanilla) Server active on port ${PORT}`);
});
