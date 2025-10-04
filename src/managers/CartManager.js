const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      return JSON.parse(data || '[]');
    } catch (err) {
      if (err.code === 'ENOENT') return [];
      throw err;
    }
  }

  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this._readFile();
    const newCart = { id: uuidv4(), products: [] };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  async getById(id) {
    const carts = await this._readFile();
    return carts.find(c => String(c.id) === String(id)) || null;
  }

  async addProductToCart(cid, pid) {
    const carts = await this._readFile();
    const idx = carts.findIndex(c => String(c.id) === String(cid));
    if (idx === -1) return null;
    const cart = carts[idx];
    const prodIdx = cart.products.findIndex(p => String(p.product) === String(pid));
    if (prodIdx === -1) {
      cart.products.push({ product: pid, quantity: 1 });
    } else {
      cart.products[prodIdx].quantity += 1;
    }
    carts[idx] = cart;
    await this._writeFile(carts);
    return cart;
  }
}

module.exports = CartManager;
