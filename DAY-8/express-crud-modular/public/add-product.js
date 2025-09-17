const API_URL = "http://localhost:3000";

// เพิ่มสินค้าใหม่
async function addProduct(event) {
  event.preventDefault();

  const product = {
    name: document.getElementById("productName").value,
    price: Number(document.getElementById("productPrice").value),
    discount: Number(document.getElementById("productDiscount").value),
    review_count: Number(document.getElementById("productReviewCount").value),
    image_url: document.getElementById("productImageUrl").value,
  };

  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (response.ok) {
      alert("เพิ่มสินค้าสำเร็จ");
      document.getElementById("productForm").reset();
      window.location.href = "/"; // กลับไปหน้าแรก
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการเพิ่มสินค้า:", error);
    alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
  }
}
