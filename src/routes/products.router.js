const { Router } = require('express');
const ProductManager = require('../managers/ProductManager');
const path = require('path');

const router = Router();
const pm = new ProductManager(path.resolve(__dirname, '../../data/products.json'));

router.get('/', async (req, res) => {
  const products = await pm.getAll();
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  const product = await pm.getById(pid);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

router.post('/', async (req, res) => {
  try {
    const created = await pm.add(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Error creando producto', details: err.message });
  }
});

router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const updated = await pm.update(pid, req.body);
  if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(updated);
});

router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;
  const ok = await pm.delete(pid);
  if (!ok) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json({ message: 'Producto eliminado' });
});

module.exports = router;
