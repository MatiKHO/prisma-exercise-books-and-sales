
const express = require('express');
const prisma = require('../prisma/client');
const router = express.Router();

  
router.get('/', async (req, res) => {
    try {
        const books = await prisma.libro.findMany();
        return res.json(books);
    } catch (error) {
        console.error("Error connecting to the database:", error);
        res.status(500).json({ error: 'Error connecting to the database' });
    }
});

router.get('/:isbn', async (req, res) => {
    try {
      const { isbn } = req.params;
      const book = await prisma.libro.findUnique({
        where: { 
            ISBN: isbn,
        }
      });
      return res.json(book);

      
    } catch (error) {
        console.error("Error connecting to the database:", error);
        res.status(500).json({ error: 'Error connecting to the database' });
    }
});

router.get('/author/:author', async (req, res) => {
    try {
      const { author } = req.params;
      const bookAuthor = await prisma.libro.findMany({
        where: {
            Autor: author,
        }
      });
     

      return res.json(bookAuthor);

      
    } catch (error) {
        console.error("Error connecting to the database:", error);
        res.status(500).json({ error: 'Error connecting to the database' });
    }
});


router.get('/price/:price', async (req, res) => {
    try {

      const bookPrice = await prisma.libro.findMany({
        where: {
            Precio: {
                gt: 20,
            },
        }
      });
      return res.json(bookPrice);
      
    } catch (error) {
        console.error("Error connecting to the database:", error);
        res.status(500).json({ error: 'Error connecting to the database' });
    }
});

router.get('/with-sales', async (req, res) => {
    try {

        const booksWithSales = await prisma.libro.findMany({
            include: {
                Ventas: true,  
            },
        });

        return res.json(booksWithSales);
    } catch (error) {
        console.error("Error connecting to the database:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});













module.exports = router;
