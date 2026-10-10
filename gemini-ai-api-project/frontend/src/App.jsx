import { useState } from 'react';
import {
  Search,
  ArrowRight,
  MessageSquare,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  MapPin,
  Clock,
  Phone,
} from 'lucide-react';
import ChatBot, { triggerChatBot } from './components/ChatBot';

const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: 'Smartphone Nusa X1',
    category: 'Elektronik',
    brand: 'Nusa',
    price: 2499000,
    rating: 4.8,
    reviews: 124,
    stock: 25,
    desc: 'Smartphone 5G dengan baterai 5000mAh, layar AMOLED 120Hz, dan kamera 64MP.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=70',
  },
  {
    id: 2,
    name: 'Laptop Sentra Pro 14',
    category: 'Komputer',
    brand: 'Sentra',
    price: 7899000,
    rating: 4.9,
    reviews: 86,
    stock: 12,
    desc: 'Laptop kerja ramping dengan prosesor Intel Core i5, RAM 16GB, dan SSD 512GB.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=70',
  },
  {
    id: 3,
    name: 'TWS Earbuds Arunika Bass+',
    category: 'Audio',
    brand: 'Arunika',
    price: 349000,
    rating: 4.7,
    reviews: 210,
    stock: 45,
    desc: 'True Wireless Stereo dengan Active Noise Cancellation (ANC) dan baterai hingga 30 jam.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=70',
  },
  {
    id: 4,
    name: 'Smartwatch Prima Active 2',
    category: 'Aksesoris Gadget',
    brand: 'Prima',
    price: 899000,
    rating: 4.6,
    reviews: 95,
    stock: 18,
    desc: 'Pelacak kebugaran lengkap dengan sensor detak jantung, SpO2, GPS, dan tahan air 5ATM.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=70',
  },
  {
    id: 5,
    name: 'Mechanical Keyboard Sentra RGB',
    category: 'Komputer',
    brand: 'Sentra',
    price: 529000,
    rating: 4.8,
    reviews: 142,
    stock: 30,
    desc: 'Keyboard mekanikal compact 75% dengan tactile blue switch dan backlight RGB dinamis.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=70',
  },
  {
    id: 6,
    name: 'Powerbank Lombok Goods 20000mAh',
    category: 'Aksesoris Gadget',
    brand: 'Lombok Goods',
    price: 279000,
    rating: 4.9,
    reviews: 312,
    stock: 60,
    desc: 'Pengisian cepat 22.5W Power Delivery dengan dual port Type-C dan LED display baterai.',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=70',
  },
];

const CATEGORIES = ['Semua Produk', 'Elektronik', 'Komputer', 'Audio', 'Aksesoris Gadget'];

const FEATURES = [
  { icon: Truck, title: 'Kirim seluruh Indonesia', desc: 'JNE, J&T, SiCepat, AnterAja' },
  { icon: ShieldCheck, title: 'Produk original bergaransi', desc: 'Garansi resmi toko & brand' },
  { icon: RotateCcw, title: 'Retur mudah hingga 7 hari', desc: 'Ganti baru atau refund' },
  { icon: MessageSquare, title: 'Asisten AI 24 jam', desc: 'Konsultasi belanja kapan saja' },
];

const STORE_INFO = [
  {
    icon: MapPin,
    label: 'Alamat toko',
    value: 'Jl. Merdeka No. 123, Cilandak, Jakarta Selatan 12430',
  },
  {
    icon: Clock,
    label: 'Jam operasional',
    value: 'Senin–Jumat 08.00–20.00 WIB · Sabtu 09.00–18.00 WIB',
  },
  {
    icon: Phone,
    label: 'Kontak layanan',
    value: 'WhatsApp 0812-3456-7890 · cs@tokonusantara.id',
  },
];

const formatRupiah = (number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Produk');

  const filteredProducts = FEATURED_PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === 'Semua Produk' || product.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const scrollToCatalog = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  const askAboutProduct = (productName) => {
    triggerChatBot(
      `Halo Nusa, tolong beritahu saya detail spesifikasi, harga, dan ketersediaan stok untuk "${productName}".`,
    );
  };

  return (
    <div className="min-h-screen bg-cream-50 text-ink">
      {/* Announcement bar */}
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-6 py-2.5 text-xs text-ink-soft">
          <span className="font-medium text-accent">Baru</span>
          <span className="text-line">/</span>
          <span>Konsultasi belanja gratis lewat asisten AI Nusa, kapan pun.</span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-line bg-cream-50/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
          <a href="#" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-white">
              N
            </span>
            <span className="text-[15px] font-semibold tracking-tight">Toko Nusantara</span>
          </a>

          <nav className="hidden items-center gap-7 text-sm text-ink-soft md:flex">
            <button type="button" onClick={scrollToCatalog} className="transition-colors hover:text-ink">
              Produk
            </button>
            <button type="button" onClick={scrollToCatalog} className="transition-colors hover:text-ink">
              Kategori
            </button>
            <button type="button" onClick={scrollToCatalog} className="transition-colors hover:text-ink">
              Pengiriman
            </button>
            <button
              type="button"
              onClick={() => triggerChatBot('Halo Nusa, saya butuh bantuan.')}
              className="transition-colors hover:text-ink"
            >
              Bantuan
            </button>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk..."
                className="h-9 w-56 rounded-lg border border-line bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted transition-colors focus:border-ink/40 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => triggerChatBot()}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Chat AI</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        {/* Hero */}
        <section className="pb-16 pt-20">
          <p className="text-sm font-medium text-accent">Asisten belanja bertenaga AI</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl">
            Belanja kebutuhan harian tanpa harus bingung memilih.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            Ratusan produk elektronik, komputer, audio, dan aksesoris dari brand terpercaya.
            Belum yakin pilih yang mana? Tanyakan langsung ke Nusa, asisten AI kami.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => triggerChatBot()}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
            >
              <MessageSquare className="h-4 w-4" />
              Mulai chat dengan Nusa
            </button>
            <button
              type="button"
              onClick={scrollToCatalog}
              className="group inline-flex h-11 items-center gap-1.5 px-2 text-sm font-medium text-ink transition-colors hover:text-accent"
            >
              Lihat katalog
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </section>

        {/* Feature strip */}
        <section className="border-y border-line py-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <feature.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                <div>
                  <h3 className="text-sm font-medium text-ink">{feature.title}</h3>
                  <p className="mt-0.5 text-xs text-ink-soft">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Catalog */}
        <section id="catalog" className="py-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Katalog produk pilihan</h2>
              <p className="mt-1 text-sm text-ink-soft">
                Pilih produk, lalu tanyakan stok dan rekomendasinya ke Nusa.
              </p>
            </div>

            <div className="flex flex-wrap gap-5 text-sm">
              {CATEGORIES.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`border-b-2 pb-1 transition-colors ${
                      isActive
                        ? 'border-accent text-ink'
                        : 'border-transparent text-ink-soft hover:text-ink'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group/card flex flex-col overflow-hidden rounded-xl bg-white transition-colors hover:bg-cream-100"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-cream-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-[1.03]"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-ink-muted">
                        {product.brand}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        {product.rating}
                      </span>
                    </div>

                    <h3 className="mt-4 text-base font-semibold tracking-tight text-ink">
                      {product.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                      {product.desc}
                    </p>

                    <div className="mt-auto flex items-baseline justify-between border-t border-line pt-4">
                      <span className="text-base font-semibold text-ink">
                        {formatRupiah(product.price)}
                      </span>
                      <span className="text-xs text-ink-muted">Stok {product.stock}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => askAboutProduct(product.name)}
                      className="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent"
                    >
                      Tanya Nusa
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-xl bg-white px-6 py-16 text-center">
              <p className="text-sm text-ink-soft">
                Tidak ada produk yang cocok dengan pencarian Anda.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Semua Produk');
                }}
                className="mt-3 text-sm font-medium text-accent hover:underline"
              >
                Reset filter
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Store info */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-3">
          {STORE_INFO.map((item) => (
            <div key={item.label}>
              <div className="flex items-center gap-2 text-ink-muted">
                <item.icon className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">{item.label}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 text-xs text-ink-muted sm:flex-row">
          <p>© 2026 Toko Nusantara. Seluruh hak cipta dilindungi.</p>
          <p>Didukung Gemini AI · Dibuat dengan React</p>
        </div>
      </footer>

      <ChatBot apiUrl="/api/chat" />
    </div>
  );
}
