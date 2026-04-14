const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Auth
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const user = await prisma.user.create({
      data: { email, password, name } // In a real app, hash password!
    });
    res.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && user.password === password) {
    res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, phone: user.phone, timezone: user.timezone } });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

app.put('/api/auth/user/:id', async (req, res) => {
  const { name, email, phone, timezone } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { name, email, phone, timezone }
    });
    res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, phone: user.phone, timezone: user.timezone } });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Update failed' });
  }
});

// Orders History
app.get('/api/orders/:userId', async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: parseInt(req.params.userId) },
    include: {
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
});

// Addresses
app.get('/api/addresses/:userId', async (req, res) => {
  const addresses = await prisma.address.findMany({
    where: { userId: parseInt(req.params.userId) }
  });
  res.json(addresses);
});

app.post('/api/addresses', async (req, res) => {
  const { userId, name, line1, city, pinCode, label, isDefault } = req.body;
  try {
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }
    const address = await prisma.address.create({
      data: { userId, name, line1, city, pinCode, label, isDefault }
    });
    res.json(address);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add address' });
  }
});

app.delete('/api/addresses/:id', async (req, res) => {
  await prisma.address.delete({
    where: { id: parseInt(req.params.id) }
  });
  res.json({ success: true });
});

// Products
app.get('/api/products', async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

app.get('/api/products/:slug', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug }
  });
  if (product) res.json(product);
  else res.status(404).json({ error: 'Product not found' });
});

// Cart
app.get('/api/cart/:userId', async (req, res) => {
  const cart = await prisma.cartItem.findMany({
    where: { userId: parseInt(req.params.userId) },
    include: { product: true }
  });
  res.json(cart);
});

app.post('/api/cart', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const existing = await prisma.cartItem.findFirst({
      where: { userId, productId }
    });
    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity }
      });
      res.json(updated);
    } else {
      const created = await prisma.cartItem.create({
        data: { userId, productId, quantity }
      });
      res.json(created);
    }
  } catch (error) {
    res.status(400).json({ error: 'Failed to add to cart' });
  }
});

app.delete('/api/cart/:id', async (req, res) => {
  await prisma.cartItem.delete({
    where: { id: parseInt(req.params.id) }
  });
  res.json({ success: true });
});

// Orders
app.post('/api/orders', async (req, res) => {
  const { userId, items, total } = req.body;
  try {
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        }
      }
    });
    // Clear cart after order
    await prisma.cartItem.deleteMany({ where: { userId } });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: 'Order failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
