const express = require('express');
const path = require('path');
const bookRoutes = require('./src/routes/BookRoutes');
const warehouseRoutes = require('./src/routes/WarehouseRoutes');

const app = express();
const port = 3000;

// Middleware pro parsování formulářů (POST data)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Nastavení EJS jako šablonovacího systému
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Statické soubory
app.use(express.static(path.join(__dirname, 'public')));

// Základní routa
app.get('/', (req, res) => {
  res.render('index');
});

// Registrace rout
app.use('/books', bookRoutes);
app.use('/warehouses', warehouseRoutes);

// Spuštění serveru
app.listen(port, () => {
  console.log(`Server běží na portu ${port}`);
  console.log(`Otevřete v prohlížeči: http://localhost:${port}`);
});
