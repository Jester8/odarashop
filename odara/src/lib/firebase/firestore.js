// lib/firebase/firestore.js
// ─────────────────────────────────────────────────────────────────────────────
// Odara — Firestore service layer
// All collection reads/writes go through here so components stay clean.
// ─────────────────────────────────────────────────────────────────────────────

import {
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase"; // your existing firebase.js export

// ══════════════════════════════════════════════════════════════════════════════
// COLLECTION NAMES  (single source of truth — change here, works everywhere)
// ══════════════════════════════════════════════════════════════════════════════
export const COLLECTIONS = {
  USERS:         "users",
  PRODUCTS:      "products",
  CATEGORIES:    "categories",
  ORDERS:        "orders",
  WISHLIST:      "wishlist",
  CART:          "cart",
  REVIEWS:       "reviews",
  NOTIFICATIONS: "notifications",
};

// ══════════════════════════════════════════════════════════════════════════════
// USERS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch a single user profile.
 * @param {string} uid
 */
export async function getUser(uid) {
  const snap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Update specific fields on a user document.
 * @param {string} uid
 * @param {object} data  – only the fields you want to change
 */
export async function updateUser(uid, data) {
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// PRODUCTS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch all products (optionally filtered by category).
 * @param {string|null} categoryId
 */
export async function getProducts(categoryId = null) {
  let q = collection(db, COLLECTIONS.PRODUCTS);

  if (categoryId) {
    q = query(q, where("categoryId", "==", categoryId));
  }

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Fetch a single product.
 * @param {string} productId
 */
export async function getProduct(productId) {
  const snap = await getDoc(doc(db, COLLECTIONS.PRODUCTS, productId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Create a new product (admin only — enforced by Firestore rules).
 * @param {object} data
 */
export async function createProduct(data) {
  const ref = await addDoc(collection(db, COLLECTIONS.PRODUCTS), {
    name:        data.name,
    description: data.description || "",
    price:       data.price,
    imageURLs:   data.imageURLs   || [],
    categoryId:  data.categoryId  || "",
    stock:       data.stock       ?? 0,
    rating:      0,
    reviewCount: 0,
    createdAt:   serverTimestamp(),
    updatedAt:   serverTimestamp(),
  });
  return ref.id;
}

/**
 * Update product fields.
 * @param {string} productId
 * @param {object} data
 */
export async function updateProduct(productId, data) {
  await updateDoc(doc(db, COLLECTIONS.PRODUCTS, productId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a product.
 * @param {string} productId
 */
export async function deleteProduct(productId) {
  await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, productId));
}

/**
 * Real-time listener for all products in a category.
 * @param {string|null} categoryId
 * @param {function} callback  – called with array of products on every change
 * @returns unsubscribe function
 */
export function listenToProducts(categoryId = null, callback) {
  let q = collection(db, COLLECTIONS.PRODUCTS);

  if (categoryId) {
    q = query(q, where("categoryId", "==", categoryId));
  }

  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// CATEGORIES
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch all categories.
 */
export async function getCategories() {
  const snap = await getDocs(collection(db, COLLECTIONS.CATEGORIES));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Create a category (admin only).
 * @param {object} data  – { name, imageURL, slug }
 */
export async function createCategory(data) {
  const ref = await addDoc(collection(db, COLLECTIONS.CATEGORIES), {
    name:      data.name,
    slug:      data.slug      || "",
    imageURL:  data.imageURL  || "",
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// ══════════════════════════════════════════════════════════════════════════════
// CART  — stored as sub-collection: /cart/{uid}/items/{productId}
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch all cart items for a user.
 * @param {string} uid
 */
export async function getCart(uid) {
  const snap = await getDocs(
    collection(db, COLLECTIONS.CART, uid, "items")
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Add or update a cart item.
 * @param {string} uid
 * @param {string} productId
 * @param {object} itemData  – { name, price, imageURL, quantity }
 */
export async function setCartItem(uid, productId, itemData) {
  await setDoc(
    doc(db, COLLECTIONS.CART, uid, "items", productId),
    {
      ...itemData,
      productId,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Remove a single item from cart.
 */
export async function removeCartItem(uid, productId) {
  await deleteDoc(doc(db, COLLECTIONS.CART, uid, "items", productId));
}

/**
 * Clear the entire cart (batch delete).
 */
export async function clearCart(uid) {
  const snap = await getDocs(
    collection(db, COLLECTIONS.CART, uid, "items")
  );
  const deletions = snap.docs.map((d) => deleteDoc(d.ref));
  await Promise.all(deletions);
}

/**
 * Real-time cart listener.
 * @returns unsubscribe function
 */
export function listenToCart(uid, callback) {
  return onSnapshot(
    collection(db, COLLECTIONS.CART, uid, "items"),
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// WISHLIST  — stored as sub-collection: /wishlist/{uid}/items/{productId}
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch all wishlist items for a user.
 */
export async function getWishlist(uid) {
  const snap = await getDocs(
    collection(db, COLLECTIONS.WISHLIST, uid, "items")
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Add a product to wishlist.
 */
export async function addToWishlist(uid, productId, productData) {
  await setDoc(
    doc(db, COLLECTIONS.WISHLIST, uid, "items", productId),
    {
      ...productData,
      productId,
      addedAt: serverTimestamp(),
    }
  );
}

/**
 * Remove a product from wishlist.
 */
export async function removeFromWishlist(uid, productId) {
  await deleteDoc(doc(db, COLLECTIONS.WISHLIST, uid, "items", productId));
}

/**
 * Check if a product is in the wishlist.
 */
export async function isInWishlist(uid, productId) {
  const snap = await getDoc(
    doc(db, COLLECTIONS.WISHLIST, uid, "items", productId)
  );
  return snap.exists();
}

/**
 * Real-time wishlist listener.
 * @returns unsubscribe function
 */
export function listenToWishlist(uid, callback) {
  return onSnapshot(
    collection(db, COLLECTIONS.WISHLIST, uid, "items"),
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ORDERS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Create a new order.
 * @param {string} userId
 * @param {object} orderData
 * orderData shape:
 * {
 *   items:       [{ productId, name, price, quantity, imageURL }],
 *   total:       number,
 *   address:     { street, city, state, zip, country },
 *   paymentRef:  string,   // payment provider reference
 * }
 */
export async function createOrder(userId, orderData) {
  const ref = await addDoc(collection(db, COLLECTIONS.ORDERS), {
    userId,
    items:      orderData.items,
    total:      orderData.total,
    address:    orderData.address,
    paymentRef: orderData.paymentRef || "",
    status:     "pending",           // pending | confirmed | shipped | delivered | cancelled
    createdAt:  serverTimestamp(),
    updatedAt:  serverTimestamp(),
  });
  return ref.id;
}

/**
 * Fetch all orders for a user.
 */
export async function getUserOrders(userId) {
  const q = query(
    collection(db, COLLECTIONS.ORDERS),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Fetch a single order.
 */
export async function getOrder(orderId) {
  const snap = await getDoc(doc(db, COLLECTIONS.ORDERS, orderId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Update order status (admin only — enforced by Firestore rules).
 * @param {string} orderId
 * @param {"pending"|"confirmed"|"shipped"|"delivered"|"cancelled"} status
 */
export async function updateOrderStatus(orderId, status) {
  await updateDoc(doc(db, COLLECTIONS.ORDERS, orderId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// REVIEWS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch all reviews for a product.
 */
export async function getProductReviews(productId) {
  const q = query(
    collection(db, COLLECTIONS.REVIEWS),
    where("productId", "==", productId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Add a review and update the product's average rating.
 * @param {string} userId
 * @param {object} reviewData – { productId, rating, comment }
 */
export async function addReview(userId, reviewData) {
  // 1. Save the review
  const ref = await addDoc(collection(db, COLLECTIONS.REVIEWS), {
    userId,
    productId: reviewData.productId,
    rating:    reviewData.rating,
    comment:   reviewData.comment || "",
    createdAt: serverTimestamp(),
  });

  // 2. Increment reviewCount on the product
  //    (average recalculation is best done in a Cloud Function — see note below)
  await updateDoc(doc(db, COLLECTIONS.PRODUCTS, reviewData.productId), {
    reviewCount: increment(1),
    updatedAt:   serverTimestamp(),
  });

  return ref.id;
}

// ══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS  — /notifications/{uid}/items/{notificationId}
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Real-time listener for user notifications.
 * @returns unsubscribe function
 */
export function listenToNotifications(uid, callback) {
  const q = query(
    collection(db, COLLECTIONS.NOTIFICATIONS, uid, "items"),
    orderBy("createdAt", "desc"),
    limit(20)
  );
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}

/**
 * Mark a notification as read.
 */
export async function markNotificationRead(uid, notificationId) {
  await updateDoc(
    doc(db, COLLECTIONS.NOTIFICATIONS, uid, "items", notificationId),
    { read: true }
  );
}