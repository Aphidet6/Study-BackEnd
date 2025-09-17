const API_URL = "http://localhost:3000";

// แสดงสินค้าทั้งหมด
async function loadProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดสินค้า:", error);
  }
}

// แสดงผลสินค้าในหน้าเว็บ
function displayProducts(products) {
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
            <img src="${product.image_url}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>ราคา: ${product.price} บาท</p>
            <p>ส่วนลด: ${product.discount}%</p>
            <p>รีวิว: ${product.review_count}</p>
            <button onclick="deleteProduct(${product.id})">ลบ</button>
        `;
    grid.appendChild(card);
  });
}

// ค้นหาสินค้า
async function searchProducts() {
  const keyword = document.getElementById("searchInput").value;
  try {
    const response = await fetch(`${API_URL}/products/search/${keyword}`);
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการค้นหาสินค้า:", error);
  }
}

// ลบสินค้า
async function deleteProduct(id) {
  if (confirm("คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?")) {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        loadProducts();
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบสินค้า:", error);
    }
  }
}

// โหลดสินค้าเมื่อโหลดหน้าเว็บ
window.onload = loadProducts;
