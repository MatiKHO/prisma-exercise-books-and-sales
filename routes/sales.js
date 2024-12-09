const express = require("express");
const prisma = require("../prisma/client");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const sales = await prisma.venta.findMany();
        return res.json(sales);
    } catch (error) { 
        console.error("Error connecting to the database:", error);
        res.status(500).json({ error: 'Error connecting to the database' });
    }

});






router.get("/book/:isbn", async (req, res) => {
    try {
        const { isbn } = req.params;
        const sales = await prisma.venta.findMany({
            where: {
                ISBN: isbn,
            }
        });
        return res.json(sales);
    } catch (error) {
        console.error("Error connecting to the database:", error);
        res.status(500).json({ error: 'Error connecting to the database' });
    }
});

router.get("/date/:date", async (req, res) => {
    try {
        const { date } = req.params;
        const parsedDate = new Date(date);
        const sales = await prisma.venta.findMany({
            where: {
                Fecha_Venta: parsedDate,
            }
        });
        return res.json(sales);
    } catch (error) {
        console.error("Error connecting to the database:", error);
        res.status(500).json({ error: 'Error connecting to the database' });
    }
});

router.get("/top", async (req, res) => {
    try {
        const ventas = await prisma.venta.findMany({
            include: {
                Libro: true, 
            },
        });

        if (!ventas.length) {
            return res.status(404).json({ message: "No hay ventas registradas." });
        }


        const ventasValidas = ventas.filter((venta) => venta.Libro !== null);

        if (!ventasValidas.length) {
            return res.status(404).json({ message: "No hay ventas con libros asociados." });
        }

 
        const ingresosPorLibro = ventasValidas.reduce((acc, venta) => {
            const isbn = venta.ISBN;
            const ingreso = venta.Cantidad * venta.Libro.Precio;

            if (!acc[isbn]) {
                acc[isbn] = { libro: venta.Libro, ingresoTotal: 0 };
            }

            acc[isbn].ingresoTotal += ingreso;

            return acc;
        }, {});


        const topLibro = Object.values(ingresosPorLibro).reduce((max, libro) => {
            return libro.ingresoTotal > max.ingresoTotal ? libro : max;
        }, { ingresoTotal: 0 });

        return res.json(topLibro);
    } catch (error) {
        console.error("Error connecting to the database:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10); 

        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID debe ser un número válido" });
        }

        const sale = await prisma.venta.findUnique({
            where: {
                ID_Venta: id, 
            },
        });

        if (!sale) {
            return res.status(404).json({ error: "Venta no encontrada" });
        }

        return res.json(sale);
    } catch (error) {
        console.error("Error connecting to the database:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});












module.exports = router;
