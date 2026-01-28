const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/WarehouseController');

router.get('/', warehouseController.getAll);
router.post('/create', warehouseController.create);
router.post('/delete/:id', warehouseController.delete);

module.exports = router;