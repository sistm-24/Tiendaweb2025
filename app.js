// --- 1. DATA LAYER ---
const productsDB = [
    { id: 1, name: "Cachito", price: 1.50, cat: "dulces", img: "https://i.postimg.cc/HLfBmDGM/cachito.webp", desc: "Clásico, doradito y suave." },
    { id: 2, name: "Alfajor", price: 2.00, cat: "dulces", img: "https://i.postimg.cc/VN3DwQyd/Alfajor.webp", desc: "Relleno abundante de manjar." },
    { id: 3, name: "Pie de Piña", price: 2.00, cat: "dulces", img: "https://i.postimg.cc/W3gSbWj7/piepina.jpg", desc: "Frutal y refrescante." },
    { id: 4, name: "Pie de Manzana", price: 2.00, cat: "dulces", img: "https://i.postimg.cc/PxYKr3hW/manzana.jpg", desc: "Con un toque de canela." },
    { id: 5, name: "Budín", price: 1.00, cat: "dulces", img: "https://i.postimg.cc/CKWm0Tyf/bodin.jpg", desc: "Húmedo y tradicional." },
    { id: 6, name: "Queque Chocolate", price: 1.50, cat: "dulces", img: "https://i.postimg.cc/k4KwX19t/kequechoc.jpg", desc: "Puro sabor a cacao." },
    { id: 7, name: "Queque Vainilla", price: 1.50, cat: "dulces", img: "https://i.postimg.cc/sX7KD6yB/kekevai.jpg", desc: "Esponjoso y aromático." },
    { id: 8, name: "Leche Asada", price: 1.50, cat: "dulces", img: "https://i.postimg.cc/26hT8cmZ/lechea.jpg", desc: "Cremosa receta casera." },
    { id: 9, name: "Pionono", price: 1.50, cat: "dulces", img: "https://i.postimg.cc/KzBQvqFQ/pionono.jpg", desc: "Enrollado con manjar." },
    { id: 10, name: "Ojo de Buey", price: 1.50, cat: "dulces", img: "https://i.postimg.cc/26hT8cm4/ojo-voy.jpg", desc: "Centro dulce y masa suave." },
    { id: 11, name: "Enrollado Canela", price: 4.00, cat: "dulces", img: "https://i.postimg.cc/B6HNQYsp/rollo.jpg", desc: "Estilo cinnamon roll." },

    { id: 12, name: "Enrollado Hot Dog", price: 1.50, cat: "salados", img: "https://i.postimg.cc/FR3GsWmz/hot.jpg", desc: "Favorito de los niños." },
    { id: 13, name: "Empanada Mixta", price: 3.00, cat: "salados", img: "https://i.postimg.cc/63nz5jw3/empa.jpg", desc: "Jamón y queso derretido." },
    { id: 14, name: "Empanada Carne", price: 3.00, cat: "salados", img: "https://i.postimg.cc/N0WptqhT/carne.jpg", desc: "Relleno jugoso casero." },
    { id: 15, name: "Empanada Pollo", price: 3.00, cat: "salados", img: "https://i.postimg.cc/JnZK46mq/pollo.jpg", desc: "Pollo deshilachado." },

    { id: 16, name: "Galletas Choco (x3)", price: 1.50, cat: "promos", img: "https://i.postimg.cc/B6HNQYsv/choco.jpg", desc: "Crujientes y deliciosas." },
    { id: 17, name: "Galletas Maicena (x2)", price: 1.50, cat: "promos", img: "https://i.postimg.cc/4dVwNLZt/maicena.webp", desc: "Se deshacen en tu boca." },
    { id: 18, name: "Empanaditas Boda (x2)", price: 1.50, cat: "promos", img: "https://i.postimg.cc/R0jXm5rJ/boda.webp", desc: "Bocaditos dulces." },
    { id: 19, name: "Panes de Maíz (x4)", price: 1.00, cat: "promos", img: "https://i.postimg.cc/wvLFTfHN/maiz.jpg", desc: "Ideal para el lonche." },
];

let cart = [];
let selectedPayment = '';
let selectedDelivery = '';

const WHATSAPP_NUM = "51925940657";

// --- 2. PERSISTENCIA ---
function saveCart() {
    localStorage.setItem('rockets_cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('rockets_cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}

// --- 3. RENDER PRODUCTOS ---
function renderProducts(filterType = 'all', searchTerm = '') {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    const filtered = productsDB.filter(p => {
        const matchesCat = filterType === 'all' || p.cat === filterType;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              p.desc.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding: 2rem; color: var(--color-text-muted);">
                <p>No encontramos productos que coincidan. 🍩</p>
            </div>`;
        return;
    }

    filtered.forEach(p => {
        container.innerHTML += `
        <article class="product-card">
            <div class="card-image">
                <img src="${p.img}" alt="${p.name}" loading="lazy">
                <span class="badge">${p.cat === 'promos' ? 'Oferta' : p.cat}</span>
            </div>
            <div class="card-content">
                <h3 class="card-title">${p.name}</h3>
                <p class="card-desc">${p.desc}</p>
                <div class="card-footer">
                    <div><div class="price">S/ ${p.price.toFixed(2)}</div></div>
                    <button class="btn-add" onclick="addToCart(${p.id})">+</button>
                </div>
            </div>
        </article>`;
    });
}

// --- 4. FILTROS ---
let currentCategory = 'all';

document.getElementById('filterContainer').addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        currentCategory = e.target.dataset.category;
        const searchTerm = document.getElementById('searchInput').value;

        const grid = document.getElementById('productsContainer');
        grid.style.opacity = '0';
        setTimeout(() => {
            renderProducts(currentCategory, searchTerm);
            grid.style.opacity = '1';
        }, 200);
    }
});

document.getElementById('searchInput').addEventListener('input', (e) => {
    renderProducts(currentCategory, e.target.value);
});

// --- 5. SCROLL A MENU ---
function scrollToMenu() {
    document.getElementById('menu-start').scrollIntoView({ behavior: 'smooth' });
}

// --- 6. CARRITO ---
function addToCart(id) {
    const product = productsDB.find(p => p.id === id);
    const exists = cart.find(item => item.id === id);

    if (exists) exists.qty++;
    else cart.push({ ...product, qty: 1 });

    saveCart();
    updateCartUI();
    showToast(`Agregaste ${product.name}`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) removeFromCart(id);
        else {
            saveCart();
            updateCartUI();
        }
    }
}

// --- 7. MÉTODO DE PAGO ---
function selectPayment(method) {
    selectedPayment = method;

    document.querySelectorAll('#paymentSection .option-card')
        .forEach(el => el.classList.remove('selected'));

    const classMap = { 'Yape': 'yape', 'Plin': 'plin', 'BCP': 'bcp', 'BBVA': 'bbva', 'Visa': 'visa' };
    const selectedClass = classMap[method];

    if (selectedClass) {
        document.querySelector(`#paymentSection .option-card.${selectedClass}`).classList.add('selected');
    }
}

// --- 8. DELIVERY ---
function selectDelivery(method) {
    selectedDelivery = method;

    document.querySelectorAll('#deliverySection .option-card')
        .forEach(el => el.classList.remove('selected'));

    if (method === 'Delivery') {
        document.querySelector('#deliverySection .option-card.delivery').classList.add('selected');
    } else {
        document.querySelector('#deliverySection .option-card.pickup').classList.add('selected');
    }
}

// --- 9. UI DEL CARRITO ---
function updateCartUI() {
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    document.getElementById('cartCount').innerText = count;

    const container = document.getElementById('cartItemsContainer');
    const totalEl = document.getElementById('cartTotal');
    const paymentSection = document.getElementById('paymentSection');
    const deliverySection = document.getElementById('deliverySection');

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-msg">
                <span class="empty-icon">🥐</span>
                <p>Tu carrito está vacío.<br>¡Agrega algo delicioso!</p>
            </div>`;
        totalEl.innerText = "S/ 0.00";
        paymentSection.style.display = 'none';
        deliverySection.style.display = 'none';
        return;
    }

    paymentSection.style.display = 'block';
    deliverySection.style.display = 'block';

    let html = '';
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        html += `
            <div class="cart-item">
                <img src="${item.img}" style="width:50px; height:50px; border-radius:8px; object-fit:cover;">
                <div class="cart-item-details">
                    <span class="cart-item-title">${item.name}</span>
                    <span class="cart-item-price">S/ ${subtotal.toFixed(2)}</span>
                </div>
                <div class="qty-control">
                    <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            </div>`;
    });

    container.innerHTML = html;
    totalEl.innerText = `S/ ${total.toFixed(2)}`;
}

function toggleCart() {
    document.getElementById('cartSidebarContainer').classList.toggle('cart-open');
}

// --- 10. TOAST ---
function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// --- 11. WHATSAPP ---
function checkoutWhatsApp() {
    if (cart.length === 0) return alert("Agrega productos primero :)");
    if (!selectedDelivery) return alert("Por favor selecciona Delivery o Recojo.");
    if (!selectedPayment) return alert("Por favor selecciona un método de pago.");

    let text = "Hola Rocket's! 🚀\nQuiero realizar este pedido:\n\n";
    let total = 0;

    cart.forEach(item => {
        text += `▪ ${item.qty}x ${item.name} (S/ ${(item.price * item.qty).toFixed(2)})\n`;
        total += item.price * item.qty;
    });

    text += `\n*TOTAL:* S/ ${total.toFixed(2)}`;

    const entregaTexto = selectedDelivery === 'Delivery' ? 'Delivery 🛵' : 'Recojo 🏪';
    text += `\n\n*Entrega:* ${entregaTexto}`;
    text += `\n*Pago:* ${selectedPayment}`;

    text += `\n\nQuedo atento(a). Gracias!`;

    const url = `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
}

// --- INIT ---
document.getElementById('year').innerText = new Date().getFullYear();
loadCart();
renderProducts();
