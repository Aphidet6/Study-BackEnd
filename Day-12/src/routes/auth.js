const { Router } = require('express');
const { PrismaClient } = require('../../generated/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const router = Router();
const prisma = new PrismaClient();

function generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(403);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

router.post('/register', async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword }
        });
        return res.json({ message: 'User registered successfully', user: { email: user.email} });
    });

    router.post('/login', async (req, res) => {
        const { email, password, token } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
        if (user.twoFactorEnabled) {
            if (!token) return res.status(400).json({ message: '2FA token is required' });
            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token: token
            });
            if (!verified) return res.status(401).json({ message: 'Invalid 2FA token' });
        }
        const accessToken = generateToken({ userId: user.id, roles: user.roles });
        return res.json({ accessToken });
    });

    router.post('/enable-2fa', authenticateToken, async (req, res) => {
        const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
        if (!user) return res.status(404);
        if (user.twoFactorEnabled) return res.status(400).json({ message: '2FA is already enabled' });
        const secret = speakeasy.generateSecret({ length: 20, name: "Demo_Authen_Author" });
        await prisma.user.update({
            where: { id: user.id },
            data: { twoFactorEnabled: true, twoFactorSecret: secret.base32 }
        });
        const otpauth_url = secret.otpauth_url;
        if (!otpauth_url) return res.status(500).json({ message: 'Cannot generate OTP auth URL' });
        QRCode.toDataURL(otpauth_url, (err, data_url) => {
            if (err) return res.status(500).json({ message: 'Cannot generate QR code' });
            res.json({ message: '2FA enabled successfully', qrCode: data_url, secret: secret.base32 });
        });
    });

    router.post('/disable-2fa', authenticateToken, async (req, res) => {
        const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
        if (!user) return res.status(404);
        if (!user.twoFactorEnabled) return res.status(400).json({ message: '2FA is not enabled' });
        await prisma.user.update({
            where: { id: user.id },
            data: { twoFactorEnabled: false, twoFactorSecret: null }
        });
        res.json({ message: '2FA disabled successfully' });
    });

module.exports = router;