import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const IMG = {
  skincare: 'https://images.unsplash.com/photo-1771519902689-0a5c7be8efe6?auto=format&fit=crop&w=1200&q=85',
  skincare2: 'https://images.unsplash.com/photo-1741896136288-b04426b65558?auto=format&fit=crop&w=1200&q=85',
  laptop: 'https://images.unsplash.com/photo-1651381921372-8648ace77ec7?auto=format&fit=crop&w=1200&q=85',
  phoneFold: 'https://images.unsplash.com/photo-1787829491983-e74d5a3aecc9?auto=format&fit=crop&w=900&q=85',
  phoneTable: 'https://images.unsplash.com/photo-1658036680390-a9682c5d1a64?auto=format&fit=crop&w=900&q=85',
  phoneXiaomi: 'https://images.unsplash.com/photo-1655802282818-06e80ec3743d?auto=format&fit=crop&w=900&q=85',
  watch: 'https://images.unsplash.com/photo-1625391134693-89cd9891e940?auto=format&fit=crop&w=900&q=85',
  earbuds: 'https://images.unsplash.com/photo-1754142654807-1dfcdc3f7f22?auto=format&fit=crop&w=900&q=85',
  sanitizer: 'https://images.unsplash.com/photo-1642429948123-bb852afcb0f1?auto=format&fit=crop&w=900&q=85',
  chair: 'https://images.unsplash.com/photo-1628910900644-133192e259f9?auto=format&fit=crop&w=900&q=85',
  carCover: 'https://images.unsplash.com/photo-1694420085542-3ff43f4eea54?auto=format&fit=crop&w=1200&q=85',
  handbag: 'https://images.unsplash.com/photo-1657603513821-399e205022cd?auto=format&fit=crop&w=900&q=85',
  bedsheet: 'https://images.unsplash.com/photo-1708013761571-2f92fbe22d26?auto=format&fit=crop&w=900&q=85',
  painting: 'https://images.unsplash.com/photo-1662561558452-acdf7cd19260?auto=format&fit=crop&w=900&q=85'
};

const products = [
  { id: 1, image: IMG.skincare, name: 'Women Essential Kit', price: 1299, category: 'Health', description: 'A practical beauty and self-care bundle for everyday routines.', badge: 'Best seller' },
  { id: 2, image: IMG.carCover, name: 'Premium Car Cover', price: 1499, category: 'Automotive', description: 'Protective all-weather cover with a clean, snug fit.', badge: 'Best seller' },
  { id: 3, image: IMG.laptop, name: 'Everyday Laptop', price: 32999, category: 'Electronics', description: 'Portable laptop for work, study, streaming and everyday productivity.', badge: 'Best seller' },
  { id: 4, image: IMG.phoneTable, name: 'Edge 5G Smartphone', price: 17999, oldPrice: 21999, category: 'Mobiles', description: 'Smooth display, modern camera system and all-day battery.' },
  { id: 5, image: IMG.phoneXiaomi, name: 'Redmi Note Series', price: 13999, oldPrice: 16999, category: 'Mobiles', description: 'A balanced smartphone for everyday entertainment and communication.' },
  { id: 6, image: IMG.phoneFold, name: 'Foldable Smart Phone', price: 59999, oldPrice: 69999, category: 'Mobiles', description: 'Large foldable display with premium multitasking experience.' },
  { id: 7, image: IMG.phoneTable, name: 'Galaxy-style 5G Phone', price: 24999, oldPrice: 29999, category: 'Mobiles', description: 'Bright screen, capable cameras and fast 5G connectivity.' },
  { id: 8, image: IMG.phoneXiaomi, name: 'Redmi Note 7S', price: 11999, oldPrice: 14999, category: 'Mobiles', description: 'Classic value-focused smartphone pick.' },
  { id: 17, image: IMG.phoneTable, name: 'Pixel-style 5G Phone', price: 19999, oldPrice: 24999, category: 'Mobiles', description: 'Clean software, sharp display and everyday 5G performance.' },
  { id: 9, image: IMG.watch, name: 'Smart Watch', price: 3499, oldPrice: 4999, category: 'Electronics', description: 'Track activity, notifications and daily routines.' },
  { id: 10, image: IMG.sanitizer, name: 'Sanitizer', price: 199, category: 'Personal Care', description: 'Everyday hand hygiene essential.', offer: 'Extra 5% Off' },
  { id: 11, image: IMG.skincare2, name: 'Face Masks', price: 299, category: 'Personal Care', description: 'Soft facial care selection.', offer: 'Extra 10% Off' },
  { id: 12, image: IMG.chair, name: 'Accent Chairs', price: 4999, category: 'Home', description: 'Simple furniture pick for modern spaces.', offer: 'Top Picks' },
  { id: 13, image: IMG.bedsheet, name: 'Floral Bedsheets', price: 999, category: 'Home', description: 'Comfortable printed bedding for a quick room refresh.', offer: 'Extra 15% Off' },
  { id: 14, image: IMG.handbag, name: 'Everyday Handbags', price: 1299, category: 'Fashion', description: 'Classic handbags for daily use.', offer: 'Special Offers' },
  { id: 15, image: IMG.painting, name: 'Wall Art', price: 899, category: 'Home', description: 'Decorative art for desks and walls.', offer: 'Extra 5% Off' },
  { id: 16, image: IMG.earbuds, name: 'Wireless Earbuds', price: 2199, category: 'Electronics', description: 'Compact true-wireless audio for calls and music.', offer: 'New arrival' }
];

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/products', (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  const category = String(req.query.category || '').trim().toLowerCase();
  const mode = String(req.query.mode || '').trim().toLowerCase();
  let result = [...products];
  if (q) result = result.filter(p => `${p.name} ${p.category} ${p.description} ${p.offer || ''}`.toLowerCase().includes(q));
  if (category && category !== 'all' && category !== 'best selling') result = result.filter(p => p.category.toLowerCase() === category);
  if (mode === 'best-selling') result = result.filter(p => p.badge);
  if (mode === 'latest') result = result.filter(p => p.category === 'Mobiles');
  if (mode === 'trending') result = result.filter(p => p.offer);
  if (mode === 'deals') result = result.filter(p => p.offer || p.badge);
  res.json(result);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => String(p.id) === String(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  res.json(product);
});

app.get('/api/categories', (_req, res) => res.json(['All', 'Electronics', 'Mobiles', 'Health', 'Automotive', 'Home', 'Fashion', 'Personal Care']));

app.post('/api/newsletter', (req, res) => {
  const email = String(req.body?.email || '').trim();
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' });
  res.json({ message: 'You are subscribed to the weekly newsletter.' });
});

app.post('/api/orders', (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  if (!items.length) return res.status(400).json({ message: 'Cart is empty.' });
  const total = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1), 0);
  res.status(201).json({ orderId: `WM-${Date.now()}`, total, status: 'created' });
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
