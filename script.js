// script.js
document.addEventListener("DOMContentLoaded", function () {
    const productList = document.getElementById("product-list");
    const cartItems = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const discountElement = document.getElementById("discount");
    const finalTotalElement = document.getElementById("final-total");
    const clearCartButton = document.getElementById("clear-cart");
    const promoCodeInput = document.getElementById("promo-code");
    const applyPromoButton = document.getElementById("apply-promo");
    const promoMessage = document.getElementById("promo-message");
  
    let cart = [];
    let appliedPromoCode = null;
    let discount = 0.00;
  
    // Fetch products from JSON
    fetch("products.json")
      .then((response) => response.json())
      .then((products) => {
        displayProducts(products);
      });
  
    // Display products
    function displayProducts(products) {
      productList.innerHTML = products
        .map(
          (product) => `
          <div class="product">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
          </div>
        `
        )
        .join("");
    }
  
    // Add to cart
    window.addToCart = function (productId) {
      fetch("products.json")
        .then((response) => response.json())
        .then((products) => {
          const product = products.find((p) => p.id === productId);
          const cartItem = cart.find((item) => item.id === productId);
  
          if (cartItem) {
            cartItem.quantity += 1;
          } else {
            cart.push({ ...product, quantity: 1 });
          }
  
          updateCart();
        });
    };
  
    // Update cart
    function updateCart() {
      cartItems.innerHTML = cart
        .map(
          (item) => `
          <div class="cart-item">
            <h3>${item.name}</h3>
            <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
            <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
          </div>
        `
        )
        .join("");
  
      calculateTotal();
    }
  
    // Update quantity
    window.updateQuantity = function (productId, quantity) {
      if (quantity < 1) {
        cart = cart.filter((item) => item.id !== productId);
      } else {
        const cartItem = cart.find((item) => item.id === productId);
        cartItem.quantity = quantity;
      }
  
      updateCart();
    };
  
    // Clear cart
    clearCartButton.addEventListener("click", function () {
      cart = [];
      updateCart();
    });
  
    // Calculate total
    function calculateTotal() {
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const finalTotal = subtotal - discount;
  
      subtotalElement.textContent = subtotal.toFixed(2);
      discountElement.textContent = discount.toFixed(2);
      finalTotalElement.textContent = finalTotal.toFixed(2);
    }
  
    // Apply promo code
    applyPromoButton.addEventListener("click", function () {
      const promoCode = promoCodeInput.value.trim();
  
      if (appliedPromoCode === promoCode) {
        promoMessage.textContent = "Promo code already applied.";
        return;
      }
  
      if (promoCode === "ostad10") {
        discount = calculateSubtotal() * 0.10;
        appliedPromoCode = promoCode;
        promoMessage.textContent = "10% discount applied!";
      } else if (promoCode === "ostad5") {
        discount = calculateSubtotal() * 0.05;
        appliedPromoCode = promoCode;
        promoMessage.textContent = "5% discount applied!";
      } else {
        promoMessage.textContent = "Invalid promo code.";
        discount = 0.00;
        appliedPromoCode = null;
      }
  
      calculateTotal();
    });
  
    // Calculate subtotal
    function calculateSubtotal() {
      return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
  });