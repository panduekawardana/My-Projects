import {readFileSync} from "fs";
import path from "path";
import {fileURLToPath} from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "..", "data");

function loadJson(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  try {
    const raw = readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Gagal memuat data konteks "${fileName}": ${err.message}`);
  }
}

const businessProfile = loadJson("business-profile.json");
const businessPolicies = loadJson("business-policies.json");
const products = loadJson("products-100.json").filter((item) => item.isActive !== false);

const STOPWORDS = new Set([
  "ada", "adakah", "apa", "apakah", "apakah", "anda", "atau", "berapa", "buat",
  "cara", "dan", "dari", "di", "dengan", "dong", "harga", "hargai", "hargaya",
  "ini", "itu", "jual", "jualan", "kak", "kalau", "kalo", "ke", "kenapa", "kok",
  "mau", "min", "mohon", "nya", "pak", "paling", "per", "punya", "saya", "sih",
  "saya", "se", "saya", "tempat", "tidak", "tolong", "untuk", "yang", "yg",
  "bisa", "bisakah", "murah", "mahal", "terbaik", "bagus", "produk", "barang",
  "toko", "beli", "pesan", "banding", "vs", "atau", "juga",
]);

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOPWORDS.has(word));
}

function formatRupiah(value) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

function scoreProduct(product, tokens, rawQuery) {
  const name = (product.name || "").toLowerCase();
  const slug = (product.slug || "").toLowerCase();
  const category = (product.category || "").toLowerCase();
  const brand = (product.brand || "").toLowerCase();
  const description = (product.description || "").toLowerCase();
  const tags = (product.tags || []).map((tag) => String(tag).toLowerCase());

  let score = 0;

  for (const token of tokens) {
    if (name.includes(token)) score += 5;
    if (slug.includes(token)) score += 2;
    if (category.includes(token)) score += 3;
    if (brand.includes(token)) score += 3;
    if (tags.some((tag) => tag.includes(token))) score += 3;
    if (description.includes(token)) score += 1;
  }

  if (rawQuery && rawQuery.length > 3 && name.includes(rawQuery)) {
    score += 4;
  }

  return score;
}

export function getBusinessProfile() {
  return businessProfile;
}

export function getBusinessPolicies() {
  return businessPolicies;
}

export function getActiveProducts() {
  return products;
}

export function getProductsByCategory(category) {
  const target = String(category || "").toLowerCase();
  return products.filter((product) => (product.category || "").toLowerCase() === target);
}

export function searchProducts(query, limit = 8) {
  const rawQuery = String(query || "").toLowerCase().trim();
  const tokens = tokenize(rawQuery);

  if (tokens.length === 0) {
    return [];
  }

  return products
    .map((product) => ({product, score: scoreProduct(product, tokens, rawQuery)}))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.product);
}

export function formatProduct(product) {
  const tags = (product.tags || []).join(", ");
  return [
    `- [${product.sku}] ${product.name}`,
    `Kategori: ${product.category}`,
    `Brand: ${product.brand}`,
    `Harga: ${formatRupiah(product.price)}`,
    `Stok: ${product.stock} ${product.unit}`,
    `Deskripsi: ${product.description}`,
    tags ? `Tag: ${tags}` : null,
  ]
    .filter(Boolean)
    .join(" | ");
}

export function formatProducts(list) {
  if (!list || list.length === 0) {
    return "";
  }
  return list.map(formatProduct).join("\n");
}

export function formatStaticContext() {
  const profile = businessProfile;
  const hours = profile.operatingHours || {};
  const contact = profile.contact || {};

  const profileLines = [
    `Nama bisnis: ${profile.name} (${profile.legalName})`,
    `Tagline: ${profile.tagline}`,
    `Deskripsi: ${profile.description}`,
    `Alamat: ${profile.address}, ${profile.city}, ${profile.province} ${profile.postalCode}, ${profile.country}`,
    `Jam operasional:`,
    `  - Senin-Jumat: ${hours.mondayToFriday}`,
    `  - Sabtu: ${hours.saturday}`,
    `  - Minggu: ${hours.sunday}`,
    `  - Hari libur nasional: ${hours.publicHoliday}`,
    `Kontak:`,
    `  - Telepon: ${contact.phone}`,
    `  - WhatsApp: ${contact.whatsapp}`,
    `  - Email: ${contact.email}`,
    `  - Website: ${contact.website}`,
    `Kategori yang tersedia: ${(profile.categoriesOffered || []).join(", ")}`,
    `Brand yang dijual: ${(profile.brands || []).join(", ")}`,
    `Keunggulan: ${(profile.highlights || []).map((item) => `\n  - ${item}`).join("")}`,
  ];

  const policyLines = (businessPolicies.sections || []).map((section) => {
    const items = (section.items || []).map((item) => `  - ${item}`).join("\n");
    return `[${section.title}]\n${items}`;
  });

  return [
    "=== PROFIL BISNIS ===",
    profileLines.join("\n"),
    "",
    "=== KEBIJAKAN BISNIS ===",
    policyLines.join("\n\n"),
  ].join("\n");
}
