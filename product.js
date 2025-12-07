let qty = 1;

// Product database with images and details
const PRODUCTS = {
    tshirt: {
        name: 'T-Shirt',
        price: 'Rs. 9,950.00',
        mainImage: 'images/buy-1.jpg',
        description: '100% genuine premium fabric T-shirt with trendy style, soft material and perfect comfort.'
    },
    'casual-shirt': {
        name: 'Casual Shirt',
        price: 'Rs. 8,500.00',
        mainImage: 'images/buy-2.jpg',
        description: 'Comfortable casual shirt perfect for everyday wear with premium quality fabric.'
    },
    jeans: {
        name: 'Jeans',
        price: 'Rs. 7,500.00',
        mainImage: 'images/buy-3.jpg',
        description: 'Classic denim jeans with perfect fit and timeless style for all occasions.'
    }
};

// Initialize product from URL params (so product.html can show selected product image/title/price)
document.addEventListener('DOMContentLoaded', function(){
    try{
        const params = new URLSearchParams(window.location.search);
        
        // Check if cart should open automatically
        const openCart_param = params.get('openCart');
        if(openCart_param === 'true') {
            setTimeout(() => {
                openCart();
            }, 300);
        }
        
        // Load product by ID from database
        const productId = params.get('product');
        if(productId && PRODUCTS[productId]){
            const product = PRODUCTS[productId];
            
            // Set main image
            const mainImg = document.getElementById('mainImage');
            if(mainImg) mainImg.src = product.mainImage;
            
            // Set title
            const h = document.querySelector('h1');
            if(h) h.textContent = product.name;
            
            // Set price
            const p = document.querySelector('.price');
            if(p) p.textContent = product.price;
            
            // Set description
            const desc = document.querySelector('.desc');
            if(desc) desc.textContent = product.description;
            
            return; // Exit if product loaded from ID
        }
        
        // Fallback: try loading from old img/title/price params
        const img = params.get('img');
        const title = params.get('title');
        const price = params.get('price');

        if(img){
            // decode and set image
            const decoded = decodeURIComponent(img);
            const main = document.getElementById('mainImage');
            if(main) main.src = decoded;

            // also update first thumbnail to match selected product image (so small pic shows the product)
            const firstThumb = document.querySelector('.thumbs img');
            if(firstThumb) firstThumb.src = decoded;
        }
        if(title){
            const h = document.querySelector('h1');
            if(h) h.textContent = decodeURIComponent(title);
        }
        if(price){
            const p = document.querySelector('.price');
            if(p) p.textContent = decodeURIComponent(price);
        }
        // Attach click handlers to thumbnails so they set the main image dynamically
        try{
            document.querySelectorAll('.thumbs img').forEach(th => {
                th.addEventListener('click', function(){
                    const main = document.getElementById('mainImage');
                    if(main) main.src = this.src;
                });
            });
        }catch(err){
            // ignore if thumbs don't exist
            console.warn('No thumbnails to wire up', err);
        }

    }catch(e){
        console.warn('Could not parse product params', e);
    }
});

/* Change Main Image */
function changeImage(img) {
    document.getElementById("mainImage").src = img;
}

/* Quantity Controls */
function increaseQty() {
    qty++;
    document.getElementById("qty").innerText = qty;
}

function decreaseQty() {
    if (qty > 1) {
        qty--;
        document.getElementById("qty").innerText = qty;
    }
}

/* --- CART DRAWER --- */
let cart = [];

// Load cart from localStorage on page load
document.addEventListener('DOMContentLoaded', function(){
    const savedCart = localStorage.getItem('estore-cart');
    if(savedCart){
        try{
            cart = JSON.parse(savedCart);
            updateCart();
        }catch(e){
            console.warn('Could not load cart from storage', e);
        }
    }
});

function openCart() {
    document.getElementById("cartDrawer").style.right = "0";
    document.getElementById("overlay").style.display = "block";
}

function closeCart() {
    document.getElementById("cartDrawer").style.right = "-320px";
    document.getElementById("overlay").style.display = "none";
}

/* ADD TO CART BUTTON */
document.querySelector(".add-cart").addEventListener("click", function () {

    let product = {
        name: "Comfort Real Leather Moccasin",
        price: 9950,
        size: getSelectedSize(),
        qty: qty,
        img: document.getElementById("mainImage").src
    };

    cart.push(product);
    updateCart();
    openCart(); // <-- OPEN CART HERE
});

/* GET SELECTED SIZE */
function getSelectedSize() {
    let selected = document.querySelector(".sizes button.active");
    return selected ? selected.innerText : "Not selected";
}

/* CLICK ON SIZE = SELECT */
document.querySelectorAll(".sizes button").forEach(btn => {
    btn.addEventListener("click", function () {
        document.querySelectorAll(".sizes button").forEach(b => b.classList.remove("active"));
        this.classList.add("active");
    });
});

/* CLICK ON COLOR = SELECT */
document.querySelectorAll(".color-box").forEach(box => {
    box.addEventListener("click", function () {
        document.querySelectorAll(".color-box").forEach(b => b.classList.remove("active"));
        this.classList.add("active");
    });
});

/* UPDATE CART DISPLAY */
function updateCart() {
    let cartItemsDiv = document.querySelector(".cart-items-scroll");
    cartItemsDiv.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item, index) => {
        subtotal += item.price * item.qty;

        cartItemsDiv.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}">
                <div>
                    <h4>${item.name}</h4>
                    <p>Rs ${item.price}</p>
                    <p>Size: ${item.size}</p>
                    <p>Qty: ${item.qty}</p>
                    <button onclick="removeItem(${index})" style="padding:4px 8px;background:#ff6b6b;color:#fff;border:none;border-radius:4px;cursor:pointer">Remove</button>
                </div>
            </div>
        `;
    });

    document.getElementById("subtotal").innerText = subtotal;
    
    // Save cart to localStorage
    localStorage.setItem('estore-cart', JSON.stringify(cart));
}

/* REMOVE ITEM */
function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
    // Close cart if empty
    if(cart.length === 0) {
        setTimeout(closeCart, 300);
    }
}

/* ADD RECOMMENDED PRODUCT TO CART */
function addRecommendedToCart(name, img, price) {
    let product = {
        name: name,
        price: price,
        size: "One Size",
        qty: 1,
        img: img
    };
    cart.push(product);
    updateCart();
}

/* SLIDER NAVIGATION */
let sliderIndex = 0;

function sliderPrev() {
    const items = document.querySelectorAll('.slider-item');
    if(items.length > 0) {
        sliderIndex = (sliderIndex - 1 + items.length) % items.length;
        updateSliderPosition();
    }
}

function sliderNext() {
    const items = document.querySelectorAll('.slider-item');
    if(items.length > 0) {
        sliderIndex = (sliderIndex + 1) % items.length;
        updateSliderPosition();
    }
}

function updateSliderPosition() {
    const container = document.querySelector('.slider-items');
    if(container) {
        const itemWidth = container.querySelector('.slider-item').offsetWidth;
        container.scrollLeft = sliderIndex * (itemWidth + 8); // 8 is the gap
    }
}

function sliderUp() {
    const container = document.querySelector('.slider-items');
    if(container) {
        container.scrollLeft -= 60;
    }
}

function sliderDown() {
    const container = document.querySelector('.slider-items');
    if(container) {
        container.scrollLeft += 60;
    }
}

/* CART SCROLL FUNCTIONS */
function cartScrollUp() {
    const cartItems = document.querySelector('.cart-items-scroll');
    if(cartItems) {
        cartItems.scrollTop -= 80;
    }
}

function cartScrollDown() {
    const cartItems = document.querySelector('.cart-items-scroll');
    if(cartItems) {
        cartItems.scrollTop += 80;
    }
}

// Buy Now function - redirects to checkout page
function buyNow() {
    const title = document.querySelector('h1')?.textContent || 'Product';
    const priceText = document.querySelector('.price')?.textContent || 'Rs. 0';
    const image = document.getElementById('mainImage')?.src || 'images/placeholder.jpg';
    const quantity = document.getElementById('qty')?.textContent || '1';
    
    // Create checkout URL with product details
    const checkoutUrl = `checkout.html?title=${encodeURIComponent(title)}&price=${encodeURIComponent(priceText)}&image=${encodeURIComponent(image)}&qty=${quantity}`;
    
    window.location.href = checkoutUrl;
}
