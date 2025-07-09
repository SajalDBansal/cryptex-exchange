const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const targetUrl = 'https://api.backpack.exchange';
const allowedOrigins = [
    'http://localhost:3000',
    'https://cryptex-exchange-xi.vercel.app'
];

// CORS middleware (must run **before** proxy)
app.use((req: any, res: any, next: any) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range');

    // Preflight response
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

// Proxy middleware
app.use('/', createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    onProxyRes(proxyRes: any, req: any, res: any) {
        // Ensure CORS headers aren't stripped from the proxied response
        const origin = req.headers.origin;
        if (allowedOrigins.includes(origin)) {
            proxyRes.headers['Access-Control-Allow-Origin'] = origin;
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
        }
    }
}));

const port = 8080;
app.listen(port, () => {
    console.log(`Proxy server running on http://localhost:${port}`);
});
