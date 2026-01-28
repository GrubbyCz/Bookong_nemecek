const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Zobrazit všechny sklady
exports.getAll = async (req, res) => {
    try {
        const warehouses = await prisma.warehouse.findMany();
        // Pokud předáváme chybu (např. z redirectu), můžeme ji načíst z query parametru, 
        // ale pro jednoduchost ji očekáváme v req objektu nebo render datech
        const error = req.query.error || null;
        res.render('warehouses', { warehouses, error });
    } catch (error) {
        console.error(error);
        res.status(500).send("Chyba serveru");
    }
};

// Vytvořit sklad
exports.create = async (req, res) => {
    try {
        const { name, address } = req.body;
        await prisma.warehouse.create({
            data: { name, address }
        });
        res.redirect('/warehouses');
    } catch (error) {
        console.error(error);
        res.status(500).send("Chyba při vytváření skladu");
    }
};

// Smazat sklad
exports.delete = async (req, res) => {
    try {
        const id = parseInt(req.body.id || req.params.id);

        const itemsCount = await prisma.bookItem.count({
            where: { warehouseId: id }
        });

        if (itemsCount > 0) {
            // Nemůžeme smazat - sklad není prázdný
            const warehouses = await prisma.warehouse.findMany();
            return res.render('warehouses', { 
                warehouses, 
                error: `Sklad nelze smazat, obsahuje ${itemsCount} položek.` 
            });
        }

        await prisma.warehouse.delete({
            where: { id: id }
        });
        
        res.redirect('/warehouses');
    } catch (error) {
        console.error(error);
        res.status(500).send("Chyba při mazání skladu");
    }
};
