// scripts/seedFirestore.js
// Usage: node scripts/seedFirestore.js
// Requires: serviceAccountKey.json in project root

const { initializeApp, cert, getApps, getApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

// ── Init ─────────────────────────────────────────────────────────────────────
const app =
  getApps().length === 0
    ? initializeApp({ credential: cert("./serviceAccountKey.json") })
    : getApp();

const db = getFirestore(app);

// ── Seed data ─────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "fashion",     name: "Fashion",      slug: "fashion",     imageURL: "" },
  { id: "electronics", name: "Electronics",  slug: "electronics", imageURL: "" },
  { id: "beauty",      name: "Beauty",       slug: "beauty",      imageURL: "" },
  { id: "home",        name: "Home & Living", slug: "home",       imageURL: "" },
  { id: "sports",      name: "Sports",       slug: "sports",      imageURL: "" },
];

const PRODUCTS = [
  {
    name:        "Classic White Sneakers",
    description: "Clean, versatile sneakers for everyday wear.",
    price:       12500,
    imageURLs:   [],
    categoryId:  "fashion",
    stock:       50,
    rating:      0,
    reviewCount: 0,
  },
  {
    name:        "Wireless Earbuds Pro",
    description: "30-hour battery life, noise-cancelling earbuds.",
    price:       45000,
    imageURLs:   [],
    categoryId:  "electronics",
    stock:       30,
    rating:      0,
    reviewCount: 0,
  },
  {
    name:        "Vitamin C Serum",
    description: "Brightening serum with 20% Vitamin C.",
    price:       8500,
    imageURLs:   [],
    categoryId:  "beauty",
    stock:       100,
    rating:      0,
    reviewCount: 0,
  },
];

// ── Runner ────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Seeding Firestore...\n");

  console.log("📁 Creating categories...");
  for (const cat of CATEGORIES) {
    const { id, ...data } = cat;
    await db.collection("categories").doc(id).set({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
    });
    console.log(`   ✅ ${cat.name}`);
  }

  console.log("\n📦 Creating products...");
  for (const product of PRODUCTS) {
    const ref = await db.collection("products").add({
      ...product,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`   ✅ ${product.name}  (id: ${ref.id})`);
  }

  console.log("\n✨ Firestore seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});