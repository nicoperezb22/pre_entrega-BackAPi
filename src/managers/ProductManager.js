const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

class ProductManager {
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

  async getAll() {
    return await this._readFile();
  }

  async getById(id) {
    const items = await this._readFile();
    return items.find(p => String(p.id) === String(id)) || null;
  }

  async add(product) {
    const items = await this._readFile();
    const newProduct = {
      id: uuidv4(),
      title: product.title || '',
      description: product.description || '',
      code: product.code || '',
      price: Number(product.price) || 0,
      status: product.status === undefined ? true : Boolean(product.status),
      stock: Number(product.stock) || 0,
      category: product.category || '',
      thumbnails: Array.isArray(product.thumbnails) ? product.thumbnails : []
    };
    items.push(newProduct);
    await this._writeFile(items);
    return newProduct;
  }

  async update(id, patch) {
    const items = await this._readFile();
    const idx = items.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return null;
    const existing = items[idx];
    const { id: _ignored, ...restPatch } = patch;
    const updated = { ...existing, ...restPatch };
    items[idx] = updated;
    await this._writeFile(items);
    return updated;
  }

  async delete(id) {
    const items = await this._readFile();
    const idx = items.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return false;
    items.splice(idx, 1);
    await this._writeFile(items);
    return true;
  }
}

module.exports = ProductManager;
