// Cart Functions

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += parseInt(document.getElementById(`qty-${productId}`).textContent) || 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price - (product.price * product.discount / 100),
            quantity: parseInt(document.getElementById(`qty-${productId}`).textContent) || 1,
            image: product.image
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Added to cart!');
}

// Update Cart Count in Navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Load Cart Items on Cart Page
function loadCart() {
    const cartItems = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
        updateCartSummary(0);
        return;
    }

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
            <div>
                <h4>${item.name}</h4>
                <p>₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}</p>
                <div class="quantity-selector">
                    <button onclick="updateCartQuantity(${item.id}, -1)">-</button>
                    <span id="cart-qty-${item.id}">${item.quantity}</span>
                    <button onclick="updateCartQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItems.appendChild(itemDiv);
    });

    updateCartSummary(cart);
}

// Update Quantity in Cart
function updateCartQuantity(id, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity < 1) item.quantity = 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        document.getElementById(`cart-qty-${id}`).textContent = item.quantity;
        updateCartSummary(cart);
        updateCartCount();
    }
}

// Remove Item from Cart
function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

// Update Cart Summary
function updateCartSummary(cart) {
    const itemTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharge = itemTotal > 0 ? 20 : 0; // Fixed delivery charge
    const total = itemTotal + deliveryCharge;

    document.getElementById('item-total').textContent = itemTotal;
    document.getElementById('delivery-charge').textContent = deliveryCharge;
    document.getElementById('total-amount').textContent = total;
}

// Calculate Total (for Checkout)
function calculateTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return itemTotal + 20; // Including delivery
}