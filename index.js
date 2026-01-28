const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Nastavení EJS jako šablonovacího systému
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Statické soubory
app.use(express.static(path.join(__dirname, 'public')));

// Základní routa
app.get('/', (req, res) => {
  res.render('index');
});

// Spuštění serveru
app.listen(port, () => {
  console.log(`Server běží na portu ${port}`);
  console.log(`Otevřete v prohlížeči: http://localhost:${port}`);
});
