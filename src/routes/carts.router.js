const { Router } = require('express');
const CartManager = require('../managers/CartManager');
const ProductManager = require('../managers/ProductManager');
const path = require('path');

const router = Router();
const cm = new CartManager(path.resolve(__dirname, '../../data/carts.json'));
const pm = new ProductManager(path.resolve(__dirname, '../../data/products.json'));

router.post('/', async (req, res) => {
  try {
    const cart = await cm.createCart();
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error creando carrito', details: err.message });
  }
});

router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  const cart = await cm.getById(cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart.products);
});

router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const product = await pm.getById(pid);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  const cart = await cm.addProductToCart(cid, pid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart);
});

module.exports = router;
