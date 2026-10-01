const defaultProducts = [
  {
    id: 1,
    title: 'Leonetta, la Leona Elegante',
    price: 250000,
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'Oliver, el Oso Aventurero',
    price: 220000,
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'Oveja de Lana Suave',
    price: 180000,
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80'
  }
];

const defaultStoreSettings = {
  companyName: 'HILOS & SUEÑOS',
  legalName: 'Hilos & Sueños',
  ownerName: 'Anamaria Caceres Rincon',
  contactPhone: '',
  whatsappNumber: '573001234567',
  address: ''
};

function loadStoreSettings() {
  try {
    const storedSettings = JSON.parse(localStorage.getItem('my_store_settings')) || {};
    return {
      ...defaultStoreSettings,
      ...storedSettings,
      whatsappNumber: localStorage.getItem('my_whatsapp_number') || storedSettings.whatsappNumber || defaultStoreSettings.whatsappNumber
    };
  } catch {
    return { ...defaultStoreSettings };
  }
}

function loadProducts() {
  try {
    const savedProducts = JSON.parse(localStorage.getItem('my_products'));
    return (Array.isArray(savedProducts) ? savedProducts : defaultProducts).map(product => ({
      ...product,
      price: Number(product.price) || 0
    }));
  } catch {
    return [...defaultProducts];
  }
}

let products = loadProducts();
let cart = loadCart();
let customerAccounts = loadCustomerAccounts();
let customerSession = loadCustomerSession();
let storeSettings = loadStoreSettings();

const productGrid = document.getElementById('productGrid');
const heroImage = document.getElementById('heroImage');
const themeToggle = document.getElementById('themeToggle');
const adminLoginLink = document.getElementById('adminLoginLink');
const adminProfile = document.getElementById('adminProfile');
const adminProfileToggle = document.getElementById('adminProfileToggle');
const adminProfileMenu = document.getElementById('adminProfileMenu');
const adminProfileLogout = document.getElementById('adminProfileLogout');
const adminProfileName = document.getElementById('adminProfileName');
const adminProfilePhotoView = document.getElementById('adminProfilePhotoView');
const adminProfileInitials = document.getElementById('adminProfileInitials');
const menuToggle = document.getElementById('menuToggle');
const siteMenu = document.getElementById('siteMenu');
const menuClose = document.getElementById('menuClose');
const menuBackdrop = document.getElementById('menuBackdrop');
const customerSessionElement = document.getElementById('customerSession');
const customerAvatar = document.getElementById('customerAvatar');
const customerGreeting = document.getElementById('customerGreeting');
const customerLogoutBtn = document.getElementById('customerLogoutBtn');
const customerPageLogoutBtn = document.getElementById('customerPageLogoutBtn');
const customerSignedIn = document.getElementById('customerSignedIn');
const customerAccountGreeting = document.getElementById('customerAccountGreeting');
const customerLoginTab = document.getElementById('customerLoginTab');
const customerRegisterTab = document.getElementById('customerRegisterTab');
const customerLoginForm = document.getElementById('customerLoginForm');
const customerRegisterForm = document.getElementById('customerRegisterForm');
const customerLoginMessage = document.getElementById('customerLoginMessage');
const customerRegisterMessage = document.getElementById('customerRegisterMessage');
const customerNameInput = document.getElementById('customerName');
const customerUsernameInput = document.getElementById('customerUsername');
const customerEmailInput = document.getElementById('customerEmail');
const materialChoice = document.getElementById('materialChoice');
const customizerMessage = document.getElementById('customizerMessage');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const cartBadge = document.querySelector('.cart-badge');

const floatingWhatsapp = document.getElementById('floatingWhatsapp');
const contactPhoneDisplay = document.getElementById('contactPhoneDisplay');
const contactWhatsappLink = document.getElementById('contactWhatsappLink');
const contactTelephoneRow = document.getElementById('contactTelephoneRow');
const contactTelephoneDisplay = document.getElementById('contactTelephoneDisplay');
const contactAddressRow = document.getElementById('contactAddressRow');
const contactAddressDisplay = document.getElementById('contactAddressDisplay');

function setDarkMode(isDark, persist = true) {
  document.body.classList.toggle('dark-mode', isDark);
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute('aria-label', isDark ? 'Activar modo claro' : 'Activar modo oscuro');
  themeToggle.title = isDark ? 'Activar modo claro' : 'Activar modo oscuro';
  if (persist) localStorage.setItem('hilos_theme', isDark ? 'dark' : 'light');
}

setDarkMode(localStorage.getItem('hilos_theme') === 'dark', false);
themeToggle.addEventListener('click', () => {
  setDarkMode(themeToggle.getAttribute('aria-pressed') !== 'true');
});

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderCart();
  renderWhatsAppLink();
  renderStoreProfile();
  renderAdminProfile();
  updateCustomerSession();
  initializeCustomizer();
  const initialRoute = window.location.hash.slice(1);
  if (findPageView(initialRoute)) {
    showRoute(initialRoute, false);
  }

  const savedHero = localStorage.getItem('my_hero_image');
  if (savedHero) {
    heroImage.src = savedHero;
  }
});

function loadAdminSession() {
  try {
    const session = JSON.parse(localStorage.getItem('my_admin_session'));
    if (!session || typeof session.username !== 'string') return null;
    const savedAccounts = JSON.parse(localStorage.getItem('my_admin_accounts'));
    const accounts = [{ username: 'yeison' }, ...(Array.isArray(savedAccounts) ? savedAccounts : [])];
    return accounts.some(account => account.username?.toLowerCase() === session.username.toLowerCase()) ? session : null;
  } catch {
    return null;
  }
}

function renderAdminProfile() {
  const session = loadAdminSession();
  const isLoggedIn = Boolean(session);
  adminLoginLink.hidden = isLoggedIn;
  adminProfile.hidden = !isLoggedIn;
  if (!isLoggedIn) {
    adminProfileMenu.hidden = true;
    adminProfileToggle.setAttribute('aria-expanded', 'false');
    return;
  }

  const displayName = session.displayName || session.username;
  adminProfileName.textContent = displayName;
  adminProfileInitials.textContent = displayName.split(/[\s._-]+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  const photo = localStorage.getItem('my_admin_profile_image');
  adminProfilePhotoView.hidden = !photo;
  adminProfileInitials.hidden = Boolean(photo);
  if (photo) adminProfilePhotoView.src = photo;
}

adminProfileToggle.addEventListener('click', () => {
  const isExpanded = adminProfileToggle.getAttribute('aria-expanded') === 'true';
  adminProfileToggle.setAttribute('aria-expanded', String(!isExpanded));
  adminProfileMenu.hidden = isExpanded;
});

adminProfileLogout.addEventListener('click', () => {
  localStorage.removeItem('my_admin_session');
  adminProfileMenu.hidden = true;
  renderAdminProfile();
});

document.addEventListener('click', event => {
  if (!adminProfile.contains(event.target)) {
    adminProfileMenu.hidden = true;
    adminProfileToggle.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !adminProfileMenu.hidden) {
    adminProfileMenu.hidden = true;
    adminProfileToggle.setAttribute('aria-expanded', 'false');
  }
});

function setMenuOpen(isOpen) {
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  siteMenu.classList.toggle('is-open', isOpen);
  siteMenu.setAttribute('aria-hidden', String(!isOpen));
  menuBackdrop.hidden = !isOpen;
  document.body.classList.toggle('menu-open', isOpen);
  if (isOpen) menuClose.focus();
  else menuToggle.focus();
}

menuToggle.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

menuClose.addEventListener('click', () => setMenuOpen(false));
menuBackdrop.addEventListener('click', () => setMenuOpen(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
  }
});

siteMenu.addEventListener('click', event => {
  const link = event.target.closest('[data-route]');
  if (!link) return;
  event.preventDefault();
  setMenuOpen(false);
  const route = link.dataset.route;
  if (route === 'registro' && !customerSession) setCustomerAccountMode('register');
  showRoute(route);
});

document.addEventListener('click', event => {
  const routeButton = event.target.closest('[data-route]');
  if (routeButton && !siteMenu.contains(routeButton)) showRoute(routeButton.dataset.route);
});

window.addEventListener('popstate', () => {
  const route = window.location.hash.slice(1) || 'inicio';
  showRoute(route, false);
});

function showRoute(route, addHistory = true) {
  const target = findPageView(route);
  if (!target) return;

  document.querySelectorAll('[data-page-view]').forEach(view => {
    view.hidden = view !== target;
    view.classList.remove('page-entering');
  });
  void target.offsetWidth;
  target.classList.add('page-entering');
  if (addHistory && window.location.hash !== `#${route}`) {
    window.history.pushState({ route }, '', `#${route}`);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (route === 'registro' && customerSession) {
    customerSignedIn.hidden = false;
    customerAccountGreeting.textContent = `Sesión iniciada como ${customerSession.name}.`;
    customerLoginForm.hidden = true;
    customerRegisterForm.hidden = true;
    customerLoginTab.hidden = true;
    customerRegisterTab.hidden = true;
  } else if (route === 'registro') {
    customerSignedIn.hidden = true;
    customerLoginTab.hidden = false;
    customerRegisterTab.hidden = false;
    setCustomerAccountMode('register');
  }
}

function findPageView(route) {
  return [...document.querySelectorAll('[data-page-view]')]
    .find(view => view.dataset.pageView === route);
}

function loadCustomerSession() {
  try {
    const session = JSON.parse(localStorage.getItem('my_customer_session'));
    return session && typeof session.name === 'string' && typeof session.email === 'string' ? session : null;
  } catch {
    return null;
  }
}

function updateCustomerSession() {
  customerSessionElement.hidden = !customerSession;
  if (customerSession) {
    const displayName = customerSession.name;
    const initials = displayName.split(/[\s._-]+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
    customerAvatar.textContent = initials;
    customerAvatar.title = displayName;
    customerGreeting.textContent = displayName;
    customerAccountGreeting.textContent = `Sesión iniciada como ${displayName}.`;
  }
}

function endCustomerSession() {
  customerSession = null;
  localStorage.removeItem('my_customer_session');
  updateCustomerSession();
  customerSignedIn.hidden = true;
  customerLoginTab.hidden = false;
  customerRegisterTab.hidden = false;
  setCustomerAccountMode('register');
  showRoute('inicio');
}

customerLogoutBtn.addEventListener('click', endCustomerSession);
customerPageLogoutBtn.addEventListener('click', endCustomerSession);
customerLoginTab.addEventListener('click', () => setCustomerAccountMode('login'));
customerRegisterTab.addEventListener('click', () => setCustomerAccountMode('register'));

customerRegisterForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = customerNameInput.value.trim();
  const username = customerUsernameInput.value.trim().toLowerCase();
  const email = customerEmailInput.value.trim().toLowerCase();
  const password = document.getElementById('customerPassword').value;

  if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
    showAccountMessage(customerRegisterMessage, 'Usa de 3 a 32 letras, números, puntos, guiones o guiones bajos.', true);
    return;
  }
  if (customerAccounts.some(account => account.username && account.username.toLowerCase() === username)) {
    showAccountMessage(customerRegisterMessage, 'Ese usuario ya está en uso.', true);
    return;
  }
  if (email && customerAccounts.some(account => account.email && account.email.toLowerCase() === email)) {
    showAccountMessage(customerRegisterMessage, 'Ese correo ya tiene una cuenta.', true);
    return;
  }

  customerAccounts.push({ name, username, email, password });
  localStorage.setItem('my_customer_accounts', JSON.stringify(customerAccounts));
  customerRegisterForm.reset();
  customerSession = { name, username, email };
  localStorage.setItem('my_customer_session', JSON.stringify(customerSession));
  updateCustomerSession();
  showRoute('inicio');
});

customerLoginForm.addEventListener('submit', event => {
  event.preventDefault();
  const identifier = document.getElementById('customerLoginEmail').value.trim().toLowerCase();
  const password = document.getElementById('customerLoginPassword').value;
  const account = customerAccounts.find(entry => {
    const matchesUsername = entry.username && entry.username.toLowerCase() === identifier;
    const matchesEmail = entry.email && entry.email.toLowerCase() === identifier;
    const matchesLegacyName = !entry.username && entry.name.toLowerCase() === identifier;
    return entry.password === password && (matchesUsername || matchesEmail || matchesLegacyName);
  });

  if (!account) {
    showAccountMessage(customerLoginMessage, 'Usuario, correo o contraseña incorrectos.', true);
    return;
  }

  const username = account.username || account.name;
  customerSession = { name: account.name, username, email: account.email };
  localStorage.setItem('my_customer_session', JSON.stringify(customerSession));
  updateCustomerSession();
  showRoute('inicio');
});

function initializeCustomizer() {
  const swatches = [...document.querySelectorAll('.yarn-swatch')];
  const customColor = document.getElementById('customYarnColor');
  const selectedColorName = document.getElementById('selectedColorName');
  const previewYarnDot = document.getElementById('previewYarnDot');
  const previewColorText = document.getElementById('previewColorText');
  const previewMaterial = document.getElementById('previewMaterial');
  const previewDesign = document.getElementById('previewDesign');
  const customizerForm = document.getElementById('customizerForm');

  function setYarnColor(color, label, selectedButton = null) {
    swatches.forEach(button => {
      const isSelected = button === selectedButton;
      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });
    customColor.value = color;
    selectedColorName.textContent = label;
    previewColorText.textContent = label;
    previewYarnDot.style.backgroundColor = color;
  }

  swatches.forEach(button => {
    button.addEventListener('click', () => setYarnColor(button.dataset.color, button.getAttribute('aria-label'), button));
  });
  customColor.addEventListener('input', () => setYarnColor(customColor.value, 'Color personalizado'));
  materialChoice.addEventListener('change', () => { previewMaterial.textContent = materialChoice.value; });
  document.querySelectorAll('input[name="customDesign"]').forEach(input => {
    input.addEventListener('change', () => { previewDesign.textContent = input.value; });
  });

  customizerForm.addEventListener('submit', event => {
    event.preventDefault();
    const selectedDesign = document.querySelector('input[name="customDesign"]:checked').value;
    const notes = document.getElementById('customNotes').value.trim();
    const message = [
      `Hola, ${customerSession ? customerSession.name : 'quiero cotizar'} una pieza personalizada:`,
      `Diseño: ${selectedDesign}`,
      `Color de lana: ${selectedColorName.textContent}`,
      `Material: ${materialChoice.value}`,
      notes ? `Detalles: ${notes}` : ''
    ].filter(Boolean).join('\n');
    const number = (localStorage.getItem('my_whatsapp_number') || '573001234567').replace(/\D/g, '');
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    customizerMessage.textContent = 'Abrimos WhatsApp con el resumen de tu diseño.';
  });
}

function formatCOP(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function loadCustomerAccounts() {
  try {
    const savedAccounts = JSON.parse(localStorage.getItem('my_customer_accounts'));
    return Array.isArray(savedAccounts)
      ? savedAccounts.filter(account => account && typeof account.name === 'string' && typeof account.email === 'string' && typeof account.password === 'string')
      : [];
  } catch {
    return [];
  }
}

function setCustomerAccountMode(mode) {
  const isLogin = mode === 'login';
  customerLoginForm.hidden = !isLogin;
  customerRegisterForm.hidden = isLogin;
  customerLoginTab.setAttribute('aria-selected', String(isLogin));
  customerRegisterTab.setAttribute('aria-selected', String(!isLogin));
  customerLoginMessage.textContent = '';
  customerLoginMessage.classList.remove('is-visible', 'is-error');
  customerRegisterMessage.textContent = '';
  customerRegisterMessage.classList.remove('is-visible', 'is-error');
}

function showAccountMessage(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle('is-error', isError);
  element.classList.add('is-visible');
}

function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem('my_cart'));
    if (!Array.isArray(savedCart)) return [];

    return savedCart
      .filter(item => Number.isInteger(Number(item.productId)) && Number.isInteger(Number(item.quantity)) && Number(item.quantity) > 0)
      .map(item => ({ productId: Number(item.productId), quantity: Number(item.quantity) }));
  } catch {
    return [];
  }
}

function renderCart() {
  cartItems.innerHTML = '';
  cart = cart.filter(item => products.some(product => product.id === item.productId));
  let total = 0;
  let itemCount = 0;

  cart.forEach(item => {
    const product = products.find(entry => entry.id === item.productId);
    total += product.price * item.quantity;
    itemCount += item.quantity;

    const row = document.createElement('article');
    row.className = 'cart-item';
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.title;

    const details = document.createElement('div');
    details.className = 'cart-item-details';
    const title = document.createElement('h4');
    title.textContent = product.title;
    const price = document.createElement('p');
    price.textContent = `${formatCOP(product.price)} c/u`;
    details.append(title, price);

    const actions = document.createElement('div');
    actions.className = 'cart-item-actions';
    const decrease = document.createElement('button');
    decrease.type = 'button';
    decrease.className = 'quantity-btn';
    decrease.dataset.cartAction = 'decrease';
    decrease.dataset.productId = String(item.productId);
    decrease.setAttribute('aria-label', `Quitar una unidad de ${product.title}`);
    decrease.textContent = '-';
    const quantity = document.createElement('span');
    quantity.className = 'cart-quantity';
    quantity.textContent = `x${item.quantity}`;
    const increase = document.createElement('button');
    increase.type = 'button';
    increase.className = 'quantity-btn';
    increase.dataset.cartAction = 'increase';
    increase.dataset.productId = String(item.productId);
    increase.setAttribute('aria-label', `Agregar una unidad de ${product.title}`);
    increase.textContent = '+';
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'remove-item-btn';
    remove.dataset.cartAction = 'remove';
    remove.dataset.productId = String(item.productId);
    remove.textContent = 'Quitar';
    actions.append(decrease, quantity, increase, remove);
    row.append(image, details, actions);
    cartItems.appendChild(row);
  });

  cartBadge.textContent = String(itemCount);
  cartTotal.textContent = formatCOP(total);
  cartEmpty.hidden = cart.length > 0;
  checkoutBtn.disabled = cart.length === 0;
  localStorage.setItem('my_cart', JSON.stringify(cart));
}

function addToCart(productId) {
  if (!products.some(product => product.id === productId)) return;
  const item = cart.find(entry => entry.productId === productId);
  if (item) item.quantity += 1;
  else cart.push({ productId, quantity: 1 });
  renderCart();
}

productGrid.addEventListener('click', event => {
  const button = event.target.closest('[data-product-id]');
  if (button) addToCart(Number(button.dataset.productId));
});

cartBtn.addEventListener('click', () => {
  renderCart();
  cartModal.style.display = 'flex';
});

closeCart.addEventListener('click', () => cartModal.style.display = 'none');
cartModal.addEventListener('click', event => {
  if (event.target === cartModal) cartModal.style.display = 'none';
});

cartItems.addEventListener('click', event => {
  const button = event.target.closest('[data-cart-action]');
  if (!button) return;
  const productId = Number(button.dataset.productId);
  const item = cart.find(entry => entry.productId === productId);
  if (!item) return;

  if (button.dataset.cartAction === 'increase') item.quantity += 1;
  if (button.dataset.cartAction === 'decrease') item.quantity -= 1;
  if (button.dataset.cartAction === 'remove' || item.quantity <= 0) {
    cart = cart.filter(entry => entry.productId !== productId);
  }
  renderCart();
});

checkoutBtn.addEventListener('click', () => {
  if (!cart.length) return;
  const lines = cart.map(item => {
    const product = products.find(entry => entry.id === item.productId);
    return `${item.quantity} x ${product.title}: ${formatCOP(product.price * item.quantity)}`;
  });
  const total = cart.reduce((sum, item) => {
    const product = products.find(entry => entry.id === item.productId);
    return sum + product.price * item.quantity;
  }, 0);
  const number = (localStorage.getItem('my_whatsapp_number') || '573001234567').replace(/\D/g, '');
  const message = `Hola, quiero hacer este pedido:\n${lines.join('\n')}\nTotal: ${formatCOP(total)}`;
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

function renderWhatsAppLink() {
  storeSettings = loadStoreSettings();
  const savedWhatsApp = storeSettings.whatsappNumber.replace(/\D/g, '');
  const chatMessage = encodeURIComponent(`Hola, quiero consultar o hacer un pedido en ${storeSettings.companyName}.`);
  const companyChatUrl = `https://wa.me/${savedWhatsApp}?text=${chatMessage}`;
  floatingWhatsapp.href = companyChatUrl;
  floatingWhatsapp.setAttribute('aria-label', `Contáctenos con ${storeSettings.companyName}`);
  contactPhoneDisplay.textContent = savedWhatsApp;
  contactWhatsappLink.href = companyChatUrl;
  contactWhatsappLink.setAttribute('aria-label', `Contáctenos en el chat de ${storeSettings.companyName}`);
  document.getElementById('contactChatNote').textContent = `Escríbenos directamente al chat de ${storeSettings.companyName} para consultar o hacer tu pedido.`;
}

function renderStoreProfile() {
  storeSettings = loadStoreSettings();
  document.getElementById('storeCompanyName').textContent = storeSettings.companyName;
  document.getElementById('storeLegalName').textContent = storeSettings.legalName || storeSettings.companyName;
  document.getElementById('storeOwnerName').textContent = storeSettings.ownerName;
  document.getElementById('footerOwnerName').textContent = storeSettings.ownerName;
  contactTelephoneRow.hidden = !storeSettings.contactPhone;
  contactTelephoneDisplay.textContent = storeSettings.contactPhone;
  contactAddressRow.hidden = !storeSettings.address;
  contactAddressDisplay.textContent = storeSettings.address;
}

function renderProducts() {
  productGrid.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p class="price">${formatCOP(product.price)}</p>
      <button class="btn-secondary" data-product-id="${product.id}">Añadir al Carrito</button>
    `;
    productGrid.appendChild(card);
  });
}

window.addEventListener('storage', event => {
  if (event.key === 'my_admin_session' || event.key === 'my_admin_profile_image') renderAdminProfile();
  if (['my_store_settings', 'my_whatsapp_number'].includes(event.key)) {
    renderStoreProfile();
    renderWhatsAppLink();
  }
  if (event.key === 'my_products') {
    products = loadProducts();
    renderProducts();
  }
  if (event.key === 'my_hero_image' && event.newValue) heroImage.src = event.newValue;
});
