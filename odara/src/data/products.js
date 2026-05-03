// data/products.js

const categories = [
  "New Arrivals",
  "Electronics",
  "Fashion",
  "Home",
  "Accessories",
  "Beauty",
  "Sports",
  "Groceries",
];

const productNames = [
  "Wireless Headphones",
  "Smart Watch",
  "Bluetooth Speaker",
  "Gaming Mouse",
  "Laptop Backpack",
  "LED Ring Light",
  "Power Bank",
  "Men Sneakers",
  "Running Shoes",
  "Face Cream",
  "Perfume",
  "Hair Dryer",
  "Blender",
  "Rice Cooker",
  "Electric Kettle",
  "Phone Case",
  "USB Charger",
  "Mechanical Keyboard",
  "Office Chair",
  "Standing Fan",
];

const imagePool = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80",
  "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80",
  "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
];

const products = [];

for (let i = 1; i <= 500; i++) {
  products.push({
    id: i,
    name: `${productNames[i % productNames.length]} ${i}`,
    price: Math.floor(Math.random() * 90000) + 10000,
    category: categories[i % categories.length],
    image: imagePool[i % imagePool.length],
    rating: (Math.random() * 2 + 3).toFixed(1),
    stock: Math.floor(Math.random() * 40) + 1,
  });
}

export default products;