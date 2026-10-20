import express from 'express';

const router = express.Router();


router.get('/home', (req, res) => {
    res.send('home');
})

router.get('/login', (req, res) => {
    res.send('login');
})

export default router;