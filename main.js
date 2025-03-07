// Cart functionality
let cart = [];
let cartTotal = 0;

// DOM Elements
const cartCount = document.querySelector(".cart-count");
const productsGrid = document.querySelector(".product-grid");
const cartSection = document.createElement("section");
cartSection.id = "cart";
cartSection.className = "cart";
document.querySelector(".products").after(cartSection);

// Initialize cart section
function initializeCartSection() {
  cartSection.innerHTML = `
        <div class="section-header">
            <h2>Your Shopping Cart</h2>
            <p>Review your selected items</p>
        </div>
        <div class="cart-container">
            <div class="cart-items"></div>
            <div class="cart-sidebar">
                <div class="cart-summary">
                    <h3>Order Summary</h3>
                    <div class="summary-item">
                        <span>Subtotal</span>
                        <span class="subtotal-amount">$0.00</span>
                    </div>
                    <div class="summary-item">
                        <span>Shipping</span>
                        <span class="shipping-amount">Free</span>
                    </div>
                    <div class="summary-item discount hidden">
                        <span>Discount</span>
                        <span class="discount-amount">-$0.00</span>
                    </div>
                    <div class="summary-divider"></div>
                    <div class="summary-item total">
                        <span>Total</span>
                        <span class="total-amount">$0.00</span>
                    </div>
                    <div class="promo-code">
                        <input type="text" placeholder="Enter promo code">
                        <button onclick="applyPromoCode()">Apply</button>
                    </div>
                    <button class="checkout-button" onclick="checkout()">
                        <span>Proceed to Checkout</span>
                        <div class="button-icon">
                            <i class="fas fa-lock"></i>
                        </div>
                    </button>
                    <div class="secure-checkout">
                        <i class="fas fa-shield-alt"></i>
                        <span>Secure Checkout</span>
                    </div>
                    <div class="payment-methods">
                        <i class="fab fa-cc-visa"></i>
                        <i class="fab fa-cc-mastercard"></i>
                        <i class="fab fa-cc-amex"></i>
                        <i class="fab fa-cc-paypal"></i>
                    </div>
                </div>
            </div>
        </div>
    `;
  updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
  const cartItems = cartSection.querySelector(".cart-items");
  cartCount.textContent = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (cart.length === 0) {
    cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-basket"></i>
                </div>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything to your cart yet</p>
                <a href="#products" class="continue-shopping">
                    Continue Shopping
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item" data-id="${item.id}">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <div class="item-header">
                    <h3>${item.name}</h3>
                    <button class="remove-item" onclick="removeFromCart('${
                      item.id
                    }')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="item-meta">
                    <div class="item-price">
                        <span class="price-label">Price:</span>
                        <span class="price-amount">$${item.price.toFixed(
                          2
                        )}</span>
                    </div>
                    <div class="item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity('${
                          item.id
                        }', -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${
                          item.id
                        }', 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="item-total">
                    <span>Total:</span>
                    <span class="total-price">$${(
                      item.price * item.quantity
                    ).toFixed(2)}</span>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

// Add to cart functionality
function addToCart(button) {
  const productCard = button.closest(".product-card");
  const productId =
    productCard.dataset.id || Math.random().toString(36).substr(2, 9);
  const productName = productCard.querySelector("h3").textContent;
  const productPrice = parseFloat(
    productCard.querySelector(".price").textContent.replace("$", "")
  );
  const productImage = productCard.querySelector("img").src;

  // Check if product is already in cart
  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      quantity: 1,
    });
  }

  // Update cart total and display
  updateCartTotal();
  updateCartDisplay();
  showNotification("Item added to cart!");
}

// Update item quantity
function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartTotal();
      updateCartDisplay();
    }
  }
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartTotal();
  updateCartDisplay();
  showNotification("Item removed from cart!");
}

// Update cart total
function updateCartTotal() {
  cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalElement = document.querySelector(".total-amount");
  if (totalElement) {
    totalElement.textContent = `$${cartTotal.toFixed(2)}`;
  }
}

// Quick view functionality
function quickView(button) {
  const productCard = button.closest(".product-card");
  const productName = productCard.querySelector("h3").textContent;
  const productPrice = productCard.querySelector(".price").textContent;
  const productImage = productCard.querySelector("img").src;
  const productDescription = productCard.querySelector("p").textContent;

  const modal = document.createElement("div");
  modal.className = "quick-view-modal";
  modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal" onclick="this.closest('.quick-view-modal').remove()">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-body">
                <img src="${productImage}" alt="${productName}">
                <div class="modal-info">
                    <h2>${productName}</h2>
                    <p>${productDescription}</p>
                    <div class="modal-price">${productPrice}</div>
                    <button class="add-to-cart" onclick="addToCart(this.closest('.modal-content').querySelector('.modal-info'))">
                        Add to Cart <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
  document.body.appendChild(modal);
}

// Checkout function
function checkout() {
  if (cart.length === 0) {
    showNotification("Your cart is empty!", "error");
    return;
  }
  showNotification("Proceeding to checkout...", "success");
  // Add checkout logic here
}

// Notification system
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${
              type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
            }"></i>
            <span>${message}</span>
        </div>
    `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Contact form handling
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    // Add form submission logic here
    showNotification("Message sent successfully!", "success");
    this.reset();
  });
}

// Newsletter form handling
const newsletterForm = document.querySelector(".newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    if (email) {
      showNotification("Thank you for subscribing!", "success");
      this.reset();
    }
  });
}

// Initialize event listeners
document.addEventListener("DOMContentLoaded", function () {
  initializeCartSection();

  // Add event listeners for product interactions
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => addToCart(button));
  });

  document.querySelectorAll(".quick-view").forEach((button) => {
    button.addEventListener("click", () => quickView(button));
  });
});
