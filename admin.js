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

const defaultSettings = {
  companyName: 'HILOS & SUEÑOS',
  legalName: 'Hilos & Sueños',
  ownerName: 'Anamaria Caceres Rincon',
  contactPhone: '',
  whatsappNumber: '573001234567',
  address: ''
};

const adminLoginView = document.getElementById('adminLoginView');
const adminDashboard = document.getElementById('adminDashboard');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminLoginMessage = document.getElementById('adminLoginMessage');
const adminCurrentUser = document.getElementById('adminCurrentUser');
const adminLogout = document.getElementById('adminLogout');
const adminProfilePhotoInput = document.getElementById('adminProfilePhotoInput');
const adminProfilePhotoFileName = document.getElementById('adminProfilePhotoFileName');
const adminProfilePhotoPreview = document.getElementById('adminProfilePhotoPreview');
const adminProfilePhotoInitials = document.getElementById('adminProfilePhotoInitials');
const saveAdminProfilePhoto = document.getElementById('saveAdminProfilePhoto');
const removeAdminProfilePhoto = document.getElementById('removeAdminProfilePhoto');
const adminProfilePhotoMessage = document.getElementById('adminProfilePhotoMessage');
const storeSettingsForm = document.getElementById('storeSettingsForm');
const storeSettingsMessage = document.getElementById('storeSettingsMessage');
const heroImageForm = document.getElementById('heroImageForm');
const heroImageMessage = document.getElementById('heroImageMessage');
const heroImageInput = document.getElementById('heroImageInput');
const heroImageFileName = document.getElementById('heroImageFileName');
const productForm = document.getElementById('productForm');
const productMessage = document.getElementById('productMessage');
const productImageInput = document.getElementById('productImage');
const productImageFileName = document.getElementById('productImageFileName');
const productCount = document.getElementById('productCount');
const adminProductList = document.getElementById('adminProductList');
const adminCredentialForm = document.getElementById('adminCredentialForm');
const credentialMessage = document.getElementById('credentialMessage');

let settings = loadSettings();
let products = loadProducts();
let adminAccounts = loadAdminAccounts();

function readArray(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function loadSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem('my_store_settings')) || {};
    return {
      ...defaultSettings,
      ...stored,
      whatsappNumber: localStorage.getItem('my_whatsapp_number') || stored.whatsappNumber || defaultSettings.whatsappNumber
    };
  } catch {
    return { ...defaultSettings };
  }
}

function loadProducts() {
  return readArray('my_products', defaultProducts).map(product => ({
    ...product,
    price: Number(product.price) || 0
  }));
}

function loadAdminAccounts() {
  const stored = readArray('my_admin_accounts', []);
  return [{ username: 'yeison', password: 'a123' }, ...stored.filter(account =>
    account && typeof account.username === 'string' && typeof account.password === 'string' && account.username.toLowerCase() !== 'yeison'
  )];
}

function setMessage(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle('is-error', isError);
}

function formatCOP(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function showAdminPanel(username) {
  adminCurrentUser.textContent = username;
  adminLoginView.hidden = true;
  adminDashboard.hidden = false;
  adminLoginForm.reset();
  renderAdminProfilePhoto();
  storeSettingsForm.elements.companyName.value = settings.companyName;
  storeSettingsForm.elements.legalName.value = settings.legalName;
  storeSettingsForm.elements.ownerName.value = settings.ownerName;
  storeSettingsForm.elements.contactPhone.value = settings.contactPhone;
  storeSettingsForm.elements.whatsappNumber.value = settings.whatsappNumber;
  storeSettingsForm.elements.address.value = settings.address;
  renderAdminProducts();
}

function loadAdminSession() {
  try {
    const session = JSON.parse(localStorage.getItem('my_admin_session'));
    if (!session || typeof session.username !== 'string') return null;
    return adminAccounts.some(account => account.username.toLowerCase() === session.username.toLowerCase()) ? session : null;
  } catch {
    return null;
  }
}

function renderAdminProfilePhoto() {
  const username = adminCurrentUser.textContent || loadAdminSession()?.username || '';
  adminProfilePhotoInitials.textContent = username.split(/[\s._-]+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  const photo = localStorage.getItem('my_admin_profile_image');
  adminProfilePhotoPreview.hidden = !photo;
  adminProfilePhotoInitials.hidden = Boolean(photo);
  if (photo) adminProfilePhotoPreview.src = photo;
}

adminLoginForm.reset();
window.addEventListener('pageshow', () => {
  adminLoginForm.reset();
  adminLoginMessage.hidden = true;
  const session = loadAdminSession();
  if (session) showAdminPanel(session.username);
});
adminLoginForm.addEventListener('submit', event => {
  event.preventDefault();
  const identifier = adminLoginForm.elements.username.value.trim().toLowerCase();
  const password = adminLoginForm.elements.password.value;
  const account = adminAccounts.find(item => {
    const matchesUsername = item.username.toLowerCase() === identifier;
    const matchesEmail = item.email && item.email.toLowerCase() === identifier;
    return item.password === password && (matchesUsername || matchesEmail);
  });

  if (!account) {
    setMessage(adminLoginMessage, 'Usuario o contraseña incorrectos.', true);
    adminLoginForm.reset();
    return;
  }

  adminLoginMessage.hidden = true;
  localStorage.setItem('my_admin_session', JSON.stringify({ username: account.username }));
  showAdminPanel(account.username);
});

adminLogout.addEventListener('click', () => {
  localStorage.removeItem('my_admin_session');
  adminDashboard.hidden = true;
  adminLoginView.hidden = false;
  adminLoginForm.reset();
  adminLoginMessage.hidden = true;
  adminCurrentUser.textContent = '';
  document.getElementById('adminUser').value = '';
  document.getElementById('adminPassword').value = '';
});

function updateProfilePhotoFileName() {
  adminProfilePhotoFileName.textContent = adminProfilePhotoInput.files[0]?.name || 'Sin archivo seleccionado';
}

adminProfilePhotoInput.addEventListener('change', updateProfilePhotoFileName);

saveAdminProfilePhoto.addEventListener('click', () => {
  const file = adminProfilePhotoInput.files[0];
  if (!file) {
    setMessage(adminProfilePhotoMessage, 'Selecciona una foto de perfil.', true);
    return;
  }
  if (file.size > 1024 * 1024) {
    setMessage(adminProfilePhotoMessage, 'La foto debe pesar menos de 1 MB.', true);
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      localStorage.setItem('my_admin_profile_image', reader.result);
      renderAdminProfilePhoto();
      setMessage(adminProfilePhotoMessage, 'Foto de perfil guardada.');
      adminProfilePhotoInput.value = '';
      updateProfilePhotoFileName();
    } catch {
      setMessage(adminProfilePhotoMessage, 'No se pudo guardar la foto. Prueba con una imagen más pequeña.', true);
    }
  };
  reader.readAsDataURL(file);
});

removeAdminProfilePhoto.addEventListener('click', () => {
  localStorage.removeItem('my_admin_profile_image');
  adminProfilePhotoInput.value = '';
  renderAdminProfilePhoto();
  updateProfilePhotoFileName();
  setMessage(adminProfilePhotoMessage, 'Foto de perfil retirada.');
});

window.addEventListener('storage', event => {
  if (event.key === 'my_admin_session' && !event.newValue) {
    adminDashboard.hidden = true;
    adminLoginView.hidden = false;
    adminLoginForm.reset();
    adminLoginMessage.hidden = true;
    adminCurrentUser.textContent = '';
  }
  if (event.key === 'my_admin_profile_image') renderAdminProfilePhoto();
});

document.querySelectorAll('[data-admin-tab]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-admin-tab]').forEach(tab => tab.classList.toggle('is-active', tab === button));
    document.querySelectorAll('[data-admin-panel]').forEach(panel => {
      panel.hidden = panel.dataset.adminPanel !== button.dataset.adminTab;
    });
  });
});

storeSettingsForm.addEventListener('submit', event => {
  event.preventDefault();
  const whatsappNumber = storeSettingsForm.elements.whatsappNumber.value.replace(/\D/g, '');
  if (whatsappNumber.length < 10) {
    setMessage(storeSettingsMessage, 'Escribe un número de WhatsApp válido con indicativo de país.', true);
    return;
  }

  settings = {
    companyName: storeSettingsForm.elements.companyName.value.trim(),
    legalName: storeSettingsForm.elements.legalName.value.trim(),
    ownerName: storeSettingsForm.elements.ownerName.value.trim(),
    contactPhone: storeSettingsForm.elements.contactPhone.value.trim(),
    whatsappNumber,
    address: storeSettingsForm.elements.address.value.trim()
  };

  try {
    localStorage.setItem('my_store_settings', JSON.stringify(settings));
    localStorage.setItem('my_whatsapp_number', whatsappNumber);
    setMessage(storeSettingsMessage, 'Datos guardados correctamente.');
  } catch {
    setMessage(storeSettingsMessage, 'No hay espacio suficiente para guardar los datos.', true);
  }
});

heroImageForm.addEventListener('submit', event => {
  event.preventDefault();
  const file = heroImageInput.files[0];
  if (!file) {
    setMessage(heroImageMessage, 'Selecciona una imagen para la portada.', true);
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    setMessage(heroImageMessage, 'La imagen debe pesar menos de 2 MB.', true);
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      localStorage.setItem('my_hero_image', reader.result);
      setMessage(heroImageMessage, 'Imagen de portada guardada.');
      heroImageForm.reset();
      heroImageFileName.textContent = 'Sin archivo seleccionado';
    } catch {
      setMessage(heroImageMessage, 'No hay espacio suficiente para guardar esta imagen.', true);
    }
  };
  reader.readAsDataURL(file);
});

productForm.addEventListener('submit', event => {
  event.preventDefault();
  const imageFile = productImageInput.files[0];
  const title = document.getElementById('productName').value.trim();
  const price = Number(document.getElementById('productPrice').value);
  if (!imageFile) {
    setMessage(productMessage, 'Selecciona una fotografía para el producto.', true);
    return;
  }
  if (!title || !Number.isFinite(price) || price < 0) return;
  if (imageFile.size > 2 * 1024 * 1024) {
    setMessage(productMessage, 'La imagen debe pesar menos de 2 MB.', true);
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    products.push({ id: Date.now(), title, price: Math.round(price), image: reader.result });
    try {
      localStorage.setItem('my_products', JSON.stringify(products));
      productForm.reset();
      productImageFileName.textContent = 'Sin archivo seleccionado';
      renderAdminProducts();
      setMessage(productMessage, 'Producto agregado al catálogo.');
    } catch {
      products.pop();
      setMessage(productMessage, 'No hay espacio suficiente. Prueba con una imagen más pequeña.', true);
    }
  };
  reader.readAsDataURL(imageFile);
});

heroImageInput.addEventListener('change', () => {
  heroImageFileName.textContent = heroImageInput.files[0]?.name || 'Sin archivo seleccionado';
});

productImageInput.addEventListener('change', () => {
  productImageFileName.textContent = productImageInput.files[0]?.name || 'Sin archivo seleccionado';
});

function renderAdminProducts() {
  adminProductList.replaceChildren();
  productCount.textContent = `${products.length} ${products.length === 1 ? 'producto' : 'productos'}`;

  if (!products.length) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'admin-empty-state';
    emptyMessage.textContent = 'Todavía no hay productos en el catálogo.';
    adminProductList.appendChild(emptyMessage);
    return;
  }

  products.forEach(product => {
    const row = document.createElement('article');
    row.className = 'admin-product-row';
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = '';
    const details = document.createElement('div');
    details.className = 'admin-product-details';
    const title = document.createElement('strong');
    title.textContent = product.title;
    const price = document.createElement('span');
    price.textContent = formatCOP(product.price);
    details.append(title, price);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'remove-product-btn';
    remove.textContent = 'Eliminar';
    remove.setAttribute('aria-label', `Eliminar ${product.title}`);
    remove.addEventListener('click', () => {
      products = products.filter(item => item.id !== product.id);
      localStorage.setItem('my_products', JSON.stringify(products));
      renderAdminProducts();
    });
    row.append(image, details, remove);
    adminProductList.appendChild(row);
  });
}

adminCredentialForm.addEventListener('submit', event => {
  event.preventDefault();
  const username = adminCredentialForm.elements.newAdminUser.value.trim().toLowerCase();
  const email = adminCredentialForm.elements.newAdminEmail.value.trim().toLowerCase();
  const password = adminCredentialForm.elements.newAdminPassword.value;
  if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
    setMessage(credentialMessage, 'Usa 3 a 32 letras, números, puntos, guiones o guiones bajos.', true);
    return;
  }
  if (adminAccounts.some(account =>
    account.username.toLowerCase() === username || (email && account.email && account.email.toLowerCase() === email)
  )) {
    setMessage(credentialMessage, 'Ese usuario o correo ya está registrado.', true);
    return;
  }

  adminAccounts.push({ username, email, password });
  localStorage.setItem('my_admin_accounts', JSON.stringify(adminAccounts.filter(account => account.username !== 'yeison')));
  adminCredentialForm.reset();
  setMessage(credentialMessage, `Credencial creada para ${username}.`);
});

if (localStorage.getItem('hilos_theme') === 'dark') document.body.classList.add('dark-mode');
