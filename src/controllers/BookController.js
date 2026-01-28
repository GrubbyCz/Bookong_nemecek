const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Zobrazení formuláře
exports.getAddBookForm = async (req, res) => {
    try {
        // Získáme seznam skladů pro výběr ve formuláři
        let warehouses = await prisma.warehouse.findMany();

        // Pokud žádný sklad neexistuje, vytvoříme defaultní, aby bylo kam knihy dávat
        if (warehouses.length === 0) {
            await prisma.warehouse.create({
                data: {
                    name: 'Hlavní sklad',
                    address: 'Místnost 101'
                }
            });
            warehouses = await prisma.warehouse.findMany();
        }

        res.render('add_book', { warehouses });
    } catch (error) {
        console.error(error);
        res.status(500).send("Chyba při načítání formuláře.");
    }
};

// Vytvoření knihy a kusů (items)
exports.createBook = async (req, res) => {
    try {
        const { title, author, isbn, quantity, warehouseId } = req.body;

        // 1. Vytvoření titulu knihy
        const newBook = await prisma.book.create({
            data: {
                title,
                author,
                isbn,
                is_virtual: false
            }
        });

        // 2. Vytvoření fyzických kusů (BookItems)
        const itemsCount = parseInt(quantity);
        const whId = parseInt(warehouseId);

        // Vytvoříme pole objektů pro hromadný insert (pokud by DB podporovala createMany v plné síle, 
        // u SQLite v Prismě musíme opatrně, ale Prisma client už createMany pro SQLite podporuje)
        const itemsData = [];
        for (let i = 0; i < itemsCount; i++) {
            itemsData.push({
                bookId: newBook.id,
                warehouseId: whId,
                status: 'available'
            });
        }

        if (itemsData.length > 0) {
            await prisma.bookItem.createMany({
                data: itemsData
            });
        }

        console.log(`Vytvořena kniha ${newBook.title} a ${itemsCount} kusů.`);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send("Chyba při ukládání knihy.");
    }
};
