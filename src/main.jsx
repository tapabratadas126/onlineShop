import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

const dealItems = [
  { name: 'Grocery & Essentials', offer: 'Up to 30% Off', sub: 'Everyday value', image: IMG.skincare, query: 'Health' },
  { name: 'Beauty & Care', offer: 'Up to 30% Off', sub: 'Creams & skincare', image: IMG.skincare2, query: 'Health' },
  { name: 'Smart Devices', offer: 'Up to 30% Off', sub: 'Wearables & audio', image: IMG.watch, query: 'Electronics' },
  { name: 'Best Selling Laptops', offer: 'Up to 20% Off', sub: 'Work & study picks', image: IMG.laptop, query: 'Electronics' }
];

const categories = ['All', 'Electronics', 'Mobiles', 'Health', 'Automotive', 'Home', 'Fashion', 'Personal Care'];

function App() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState(() => safeJson(localStorage.getItem('wm-cart'), []));
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [email, setEmail] = useState('');
  const [newsletterState, setNewsletterState] = useState('');

  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash(window.location.hash));
      setMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    localStorage.setItem('wm-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const load = async () => {
      try {
        const params = new URLSearchParams();
        if (route.type === 'search') params.set('q', route.query || '');
        if (route.type === 'collection') {
        if (route.mode === 'category') params.set('category', route.category || 'All');
        if (route.mode && route.mode !== 'category') params.set('mode', route.mode);
        if (route.mode === 'latest') params.set('category', 'Mobiles');
      }
        const res = await fetch(`${API}/products?${params}`);
        if (!res.ok) throw new Error('Product request failed');
        setProducts(await res.json());
      } catch {
        setProducts([]);
      }
    };
    load();
  }, [route]);

  const best = useMemo(() => products.filter(p => p.badge), [products]);
  const mobiles = useMemo(() => products.filter(p => p.category === 'Mobiles'), [products]);
  const trends = useMemo(() => products.filter(p => p.offer), [products]);
  const cartCount = cart.reduce((n, p) => n + p.qty, 0);
  const total = cart.reduce((n, p) => n + p.price * p.qty, 0);

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(window.__wmToast);
    window.__wmToast = window.setTimeout(() => setToast(''), 2600);
  };

  const navigate = (path) => {
    window.location.hash = path;
  };

  const addToCart = (product) => {
    if (!product.price) return notify('This offer is for demonstration only.');
    setCart(prev => {
      const found = prev.find(x => x.id === product.id);
      return found
        ? prev.map(x => x.id === product.id ? { ...x, qty: x.qty + 1 } : x)
        : [...prev, { ...product, qty: 1 }];
    });
    notify(`${product.name} added to cart`);
  };

  const changeQty = (id, delta) => {
    setCart(prev => prev
      .map(x => x.id === id ? { ...x, qty: Math.max(0, x.qty + delta) } : x)
      .filter(x => x.qty));
  };

  const submitNewsletter = async (e) => {
    e.preventDefault();
    setNewsletterState('');
    try {
      const res = await fetch(`${API}/newsletter`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setNewsletterState(data.message);
      setEmail('');
    } catch (err) {
      setNewsletterState(err.message || 'Could not subscribe.');
    }
  };

  const checkout = async () => {
    if (!cart.length) return notify('Your cart is empty');
    try {
      const res = await fetch(`${API}/orders`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: cart })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCart([]);
      setCartOpen(false);
      notify(`Order ${data.orderId} created`);
    } catch {
      notify('Checkout API unavailable');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/');
  };

  return <div className="app">
    <Header
      query={query}
      setQuery={setQuery}
      onSearch={handleSearch}
      menuOpen={menuOpen}
      setMenuOpen={setMenuOpen}
      navigate={navigate}
      cartCount={cartCount}
      openCart={() => setCartOpen(true)}
      notify={notify}
    />

    <main>
      {route.type === 'home' && <HomePage
        products={products}
        best={best}
        mobiles={mobiles}
        trends={trends}
        addToCart={addToCart}
        navigate={navigate}
        query={query}
        setQuery={setQuery}
        notify={notify}
      />}
      {route.type === 'collection' && <CollectionPage
        title={route.title}
        category={route.category}
        products={products}
        activeCategory={category === 'Best Selling' ? 'All' : category}
        setCategory={(next) => { setCategory(next); navigate(next === 'All' ? '/departments' : `/collection/${slug(next)}`); }}
        addToCart={addToCart}
        navigate={navigate}
      />}
      {route.type === 'search' && <CollectionPage
        title={`Search results for “${route.query}”`}
        category="All"
        products={products}
        activeCategory="All"
        setCategory={(next) => { setCategory(next); navigate(next === 'All' ? '/search' : `/collection/${slug(next)}`); }}
        addToCart={addToCart}
        navigate={navigate}
      />}
      {route.type === 'product' && <ProductPage id={route.id} addToCart={addToCart} navigate={navigate} />}
      {route.type === 'cart' && <CartPage cart={cart} total={total} changeQty={changeQty} checkout={checkout} navigate={navigate} />}
      {route.type === 'departments' && <DepartmentsPage navigate={navigate} />}
    </main>

    <Newsletter email={email} setEmail={setEmail} state={newsletterState} onSubmit={submitNewsletter} />
    <Footer navigate={navigate} />

    {cartOpen && <CartDrawer cart={cart} total={total} close={() => setCartOpen(false)} changeQty={changeQty} checkout={checkout} navigate={navigate} />}
    {toast && <div className="toast" role="status">{toast}</div>}
  </div>;
}

function Header({ query, setQuery, onSearch, menuOpen, setMenuOpen, navigate, cartCount, openCart, notify }) {
  return <>
    <div className="utilitybar">
      <div className="container utility-inner">
        <span>Pickup or delivery?</span>
        <div className="utility-actions">
          <button onClick={() => notify('Reorder is ready to connect to your account')}>Reorder</button>
          <button onClick={() => notify('Lists are ready for your account')}>Lists</button>
          <button onClick={() => notify('Language: English')}>English</button>
        </div>
      </div>
    </div>
    <header className="topbar">
      <div className="container nav-inner">
        <button className="mobile-menu" onClick={() => setMenuOpen(v => !v)} aria-label="Open navigation">☰</button>
        <button className="brand" onClick={() => navigate('/')} aria-label="Walmart home">
          <span className="brand-word">Walmart</span>
        </button>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <button onClick={() => navigate('/departments')}>Departments</button>
          <button onClick={() => navigate('/deals')}>Deals</button>
          <button onClick={() => navigate('/best-selling')}>Best Selling</button>
          <button onClick={() => navigate('/latest')}>Latest Launches</button>
          <button onClick={() => navigate('/trending')}>Trending</button>
        </nav>
        <form className="search-wrap" onSubmit={onSearch}>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search everything" aria-label="Search" />
          <button aria-label="Search">⌕</button>
        </form>
        <button className="account-btn" onClick={() => notify('Sign in is ready to connect to your auth provider')}>◯ <span>Sign in</span></button>
        <button className="cart-btn" onClick={openCart} aria-label="Cart">🛒<b>{cartCount}</b></button>
      </div>
      <div className="categorybar">
        <div className="container categorybar-inner">
          {[
            ["Men's", 'fashion'],
            ["Women's", 'fashion'],
            ['Electronics', 'electronics'],
            ['Mobiles', 'mobiles'],
            ['Grocery', 'departments'],
            ['Home', 'home'],
            ['Beauty', 'personal-care'],
            ['Toys & Games', 'departments'],
            ['Sports', 'departments'],
            ['Automotive', 'automotive'],
            ['All Categories', 'departments'],
          ].map(([label, target]) => (
            <button key={label} onClick={() => navigate(target === 'departments' ? '/departments' : `/collection/${target}`)}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  </>;
}

function HomePage({ products, best, mobiles, trends, addToCart, navigate, query, setQuery, notify }) {
  return <>
    <section className="hero container">
      <div className="hero-copy">
        <span className="eyebrow">WEEKEND PRICE DROP</span>
        <h1>Big savings on<br /><strong>smart essentials</strong></h1>
        <p>Fresh deals on phones, laptops, personal care and home favorites.</p>
        <button className="primary-btn" onClick={() => navigate('/deals')}>Shop deals →</button>
      </div>
      <div className="hero-visual">
        <img src={IMG.phoneFold} alt="Smartphone" />
      </div>
      <div className="hero-offer">
        <small>TODAY'S OFFER</small>
        <b>30% OFF</b>
        <span>Beauty &amp;<br />self-care picks</span>
      </div>
    </section>

    <section className="section container" id="deals">
      <SectionTitle title="Deals of the Day" action="View all deals" onAction={() => navigate('/deals')} />
      <div className="deal-grid">
        {dealItems.map(item => <button className="deal-item" key={item.name} onClick={() => navigate(`/search?q=${encodeURIComponent(item.query)}`)}>
          <div className="deal-icon"><img src={item.image} alt="" /></div>
          <b>{item.name}</b><span>{item.offer}</span><small>{item.sub}</small>
        </button>)}
        <button className="spotter-card" onClick={() => navigate('/search?q=beauty')}>
          <span className="spotter-kicker">TODAY'S OFFER</span><strong>30% OFF</strong><img src={IMG.skincare} alt="Beauty products" />
          <b>Beauty picks</b><small>Curated skincare deals</small>
        </button>
      </div>
    </section>

    <section className="section container" id="best">
      <SectionTitle title="Best Selling Products" action="View all" onAction={() => navigate('/best-selling')} />
      <div className="best-grid">{best.slice(0, 3).map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} navigate={navigate} />)}</div>
    </section>

    <section className="section container" id="latest">
      <SectionTitle title="Latest Launches" action="View all" onAction={() => navigate('/latest')} />
      <div className="mobile-grid">{mobiles.slice(0, 6).map(p => <MobileCard key={p.id} product={p} navigate={navigate} />)}</div>
    </section>

    <section className="section container" id="trending">
      <SectionTitle title="Trending Offers" action="View all" onAction={() => navigate('/trending')} />
      <div className="trend-grid">{trends.slice(0, 6).map(p => <TrendCard key={p.id} product={p} navigate={navigate} />)}</div>
    </section>

    <section className="discover section container">
      <SectionTitle title="Discover Latest" subtitle="Explore what people are shopping right now" />
      <div className="discover-grid">
        <DiscoverCard image={IMG.handbag} title="Style finds for every day" text="New accessories and easy gifts" onClick={() => navigate('/collection/fashion')} />
        <DiscoverCard image={IMG.bedsheet} title="Refresh your home" text="Bedroom and home comfort picks" onClick={() => navigate('/collection/home')} />
        <DiscoverCard image={IMG.earbuds} title="Go smart" text="Tech that fits your routine" onClick={() => navigate('/collection/electronics')} />
      </div>
    </section>
  </>;
}

function CollectionPage({ title, category, products, activeCategory, setCategory, addToCart, navigate }) {
  const [sort, setSort] = useState('relevance');
  const displayed = [...products].sort((a, b) => {
    if (sort === 'price-low') return a.price - b.price;
    if (sort === 'price-high') return b.price - a.price;
    return 0;
  });
  return <section className="collection container">
    <div className="breadcrumb"><button onClick={() => navigate('/')}>Home</button><span>›</span><b>{title}</b></div>
    <div className="collection-head"><div><span className="eyebrow">SHOP THE STORE</span><h1>{title}</h1><p>{displayed.length} products</p></div><select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort products"><option value="relevance">Best match</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></div>
    <div className="filter-row">{categories.map(c => <button key={c} className={activeCategory === c || (category === c) ? 'chip active' : 'chip'} onClick={() => setCategory(c)}>{c}</button>)}</div>
    {displayed.length ? <div className="catalog-grid">{displayed.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} navigate={navigate} />)}</div> : <EmptyState navigate={navigate} />}
  </section>;
}


function CartPage({ cart, total, changeQty, checkout, navigate }) {
  return <section className="collection container cart-page">
    <div className="breadcrumb"><button onClick={() => navigate('/')}>Home</button><span>›</span><b>Cart</b></div>
    <div className="collection-head"><div><span className="eyebrow">SHOPPING CART</span><h1>Your Cart</h1><p>{cart.reduce((n, item) => n + item.qty, 0)} items</p></div></div>
    {cart.length ? <div className="cart-page-layout"><div className="cart-page-items">{cart.map(item => <div className="cart-page-line" key={item.id}><img src={item.image} alt={item.name}/><div><button className="cart-page-name" onClick={() => navigate(`/product/${item.id}`)}>{item.name}</button><p>{item.category}</p><span>₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div><div className="qty"><button onClick={() => changeQty(item.id, -1)}>−</button><b>{item.qty}</b><button onClick={() => changeQty(item.id, 1)}>+</button></div><strong>₹{(item.price * item.qty).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></div>)}</div><aside className="order-summary"><h2>Order summary</h2><div><span>Subtotal</span><b>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</b></div><div><span>Delivery</span><b>Free</b></div><hr/><div className="summary-total"><span>Total</span><b>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</b></div><button className="checkout" onClick={checkout}>Place order</button></aside></div> : <EmptyState navigate={navigate} />}
  </section>;
}

function ProductPage({ id, addToCart, navigate }) {
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  useEffect(() => {
    fetch(`${API}/products/${id}`).then(r => r.json()).then(setProduct).catch(() => setProduct(null));
  }, [id]);
  if (!product) return <section className="collection container"><EmptyState navigate={navigate} /></section>;
  return <section className="product-detail container">
    <div className="breadcrumb"><button onClick={() => navigate('/')}>Home</button><span>›</span><b>{product.name}</b></div>
    <div className="product-layout">
      <div className="detail-media"><img src={product.image} alt={product.name} /></div>
      <div className="detail-info">
        <span className="pill">{product.category}</span>
        <h1>{product.name}</h1>
        <div className="rating">★★★★★ <span>4.6 (128 reviews)</span></div>
        <p className="detail-description">{product.description}</p>
        <div className="detail-price">₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        <p className="delivery">✓ Available for delivery · Usually arrives in 2–3 days</p>
        <div className="buy-row"><div className="qty-control"><button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button><b>{qty}</b><button onClick={() => setQty(q => q + 1)}>+</button></div><button className="primary-btn" onClick={() => { for (let i = 0; i < qty; i++) addToCart(product); navigate('/cart'); }}>Add to cart</button></div>
        <button className="secondary-btn" onClick={() => { addToCart(product); navigate('/'); }}>Buy now</button>
      </div>
    </div>
  </section>;
}

function DepartmentsPage({ navigate }) {
  const items = [
    ['Electronics', IMG.laptop, 'Phones, laptops & accessories'], ['Mobiles', IMG.phoneXiaomi, 'Smartphones & gadgets'],
    ['Beauty', IMG.skincare2, 'Skin care and personal care'], ['Automotive', IMG.carCover, 'Car care and accessories'],
    ['Home', IMG.chair, 'Furniture & home essentials'], ['Fashion', IMG.handbag, 'Bags and everyday style'],
    ['Personal Care', IMG.sanitizer, 'Hygiene and daily essentials'], ['Home Bedding', IMG.bedsheet, 'Sheets, blankets & comfort']
  ];
  return <section className="collection container"><div className="breadcrumb"><button onClick={() => navigate('/')}>Home</button><span>›</span><b>All Departments</b></div><div className="collection-head"><div><span className="eyebrow">SHOP BY CATEGORY</span><h1>All Departments</h1><p>Browse the store by category</p></div></div><div className="department-grid">{items.map(([name, image, text]) => <button key={name} className="department-card" onClick={() => navigate(`/collection/${slug(name === 'Beauty' ? 'Health' : name)}`)}><img src={image} alt="" /><b>{name}</b><span>{text}</span></button>)}</div></section>;
}

function Newsletter({ email, setEmail, state, onSubmit }) {
  return <section className="newsletter"><div className="container newsletter-inner"><div><h2>Weekly Newsletter</h2><p>Get the latest deals, product launches and shopping inspiration.</p></div><form onSubmit={onSubmit}><input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address"/><button>Subscribe</button></form>{state && <small>{state}</small>}</div></section>;
}

function Footer({ navigate }) {
  return <footer><div className="container footer-grid">
    <div className="footer-brand"><button className="brand" onClick={() => navigate('/')}><span className="brand-mark">✦</span><span className="brand-word">Walmart</span></button><p>Save more. Shop smarter.</p></div>
    <FooterColumn title="Shop" links={[["Deals", '/deals'], ['Best Selling', '/best-selling'], ['Latest Launches', '/latest'], ['Trending', '/trending']]} navigate={navigate}/>
    <FooterColumn title="Departments" links={[["Electronics", '/collection/electronics'], ['Home', '/collection/home'], ['Fashion', '/collection/fashion'], ['Personal Care', '/collection/personal-care']]} navigate={navigate}/>
    <FooterColumn title="Support" links={[["Help Center", '/'], ['Shipping', '/'], ['Returns', '/']]} navigate={navigate}/>
    <div><b>Follow us</b><div className="socials"><span>f</span><span>◎</span><span>𝕏</span><span>▶</span></div></div>
  </div><div className="container footer-bottom">Demo storefront for UI/UX prototyping · Not affiliated with Walmart Inc.</div></footer>;
}

function FooterColumn({ title, links, navigate }) { return <div><b>{title}</b>{links.map(([label, path]) => <button key={label} onClick={() => navigate(path)}>{label}</button>)}</div>; }

function CartDrawer({ cart, total, close, changeQty, checkout, navigate }) {
  return <div className="overlay" onClick={close}><aside className="cart-drawer" onClick={e => e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">SHOPPING CART</span><h2>Your Cart</h2></div><button onClick={close}>×</button></div>{cart.length ? <>{cart.map(item => <div className="cart-line" key={item.id}><img src={item.image} alt=""/><div className="cart-meta"><button onClick={() => navigate(`/product/${item.id}`)}>{item.name}</button><span>₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span><div className="qty"><button onClick={() => changeQty(item.id, -1)}>−</button><b>{item.qty}</b><button onClick={() => changeQty(item.id, 1)}>+</button></div></div></div>)}<div className="cart-total"><span>Total</span><b>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</b></div><button className="checkout" onClick={checkout}>Place order</button></> : <div className="empty"><div className="empty-icon">🛒</div><h3>Your cart is empty</h3><p>Add something you love and it will show up here.</p><button className="primary-btn" onClick={() => { close(); navigate('/'); }}>Continue shopping</button></div>}</aside></div>;
}

function ProductCard({ product, addToCart, navigate }) {
  return <article className="product-card">
    <button className="product-image" onClick={() => navigate(`/product/${product.id}`)}><img src={product.image} alt={product.name} /></button>
    <div className="product-body"><span className="mini-label">{product.badge || product.category}</span><h3>{product.name}</h3><p>{product.description}</p><div className="card-bottom"><strong>₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong><button onClick={() => addToCart(product)}>Add</button></div></div>
  </article>;
}

function MobileCard({ product, navigate }) {
  return <button className="mobile-card" onClick={() => navigate(`/product/${product.id}`)}><div className="phone-art"><img src={product.image} alt={product.name} /></div><b>{product.name}</b><strong>₹{product.price.toLocaleString('en-IN')}</strong><del>₹{product.oldPrice.toLocaleString('en-IN')}</del></button>;
}

function TrendCard({ product, navigate }) {
  return <button className="trend-card" onClick={() => navigate(`/product/${product.id}`)}><div className="trend-art"><img src={product.image} alt={product.name} /></div><b>{product.name}</b><span>{product.offer}</span></button>;
}

function DiscoverCard({ image, title, text, onClick }) { return <button className="discover-card" onClick={onClick}><img src={image} alt=""/><div><b>{title}</b><span>{text}</span></div></button>; }

function SectionTitle({ title, subtitle, action = 'View all', onAction }) {
  return <div className="section-title"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{onAction ? <button onClick={onAction}>{action} ›</button> : null}</div>;
}

function EmptyState({ navigate }) { return <div className="empty catalog-empty"><div className="empty-icon">🔎</div><h2>No products found</h2><p>Try another category or return to the home page.</p><button className="primary-btn" onClick={() => navigate('/')}>Back to home</button></div>; }

function parseHash(hash) {
  const raw = hash.replace(/^#/, '') || '/';
  const [pathname, queryString = ''] = raw.split('?');
  const params = new URLSearchParams(queryString);
  const parts = pathname.split('/').filter(Boolean);
  if (!parts.length) return { type: 'home' };
  if (parts[0] === 'product' && parts[1]) return { type: 'product', id: parts[1] };
  if (parts[0] === 'search') return { type: 'search', query: params.get('q') || '' };
  if (['deals', 'best-selling', 'latest', 'trending'].includes(parts[0])) return { type: 'collection', category: parts[0] === 'best-selling' ? 'Best Selling' : parts[0] === 'latest' ? 'Mobiles' : parts[0] === 'trending' ? 'All' : 'All', title: parts[0] === 'best-selling' ? 'Best Selling Products' : parts[0] === 'latest' ? 'Latest Launches' : parts[0] === 'trending' ? 'Trending Offers' : 'Deals of the Day', mode: parts[0] };
  if (parts[0] === 'departments') return { type: 'departments' };
  if (parts[0] === 'collection') {
    const category = fromSlug(parts[1] || 'all');
    return { type: 'collection', category, title: `${category} Products`, mode: 'category' };
  }
  if (parts[0] === 'cart') return { type: 'cart' };
  return { type: 'home' };
}

function slug(value) { return String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'); }
function fromSlug(value) { const hit = categories.find(c => slug(c) === value); return hit || value.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '); }
function safeJson(value, fallback) { try { return value ? JSON.parse(value) : fallback; } catch { return fallback; } }

createRoot(document.getElementById('root')).render(<App />);
