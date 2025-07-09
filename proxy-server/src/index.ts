const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const targetUrl = 'https://api.backpack.exchange';
const allowedOrigins = ['https://cryptex-exchange-xi.vercel.app'];

app.use((req: any, res: any, next: any) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin); // NOT '*'
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use('/', createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
}));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Proxy server running on http://localhost:${port}`);
});
