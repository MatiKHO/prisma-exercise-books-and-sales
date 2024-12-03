
const express = require('express');
const prisma = require('../prisma/client');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const books = await prisma.books.findMany();
        return res.json(books);
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;
