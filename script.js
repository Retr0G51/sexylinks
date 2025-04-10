// Configuración para cargar las imágenes desde GitHub
const config = {
    // Cambia esto por la URL base de tus imágenes en GitHub
    // Ejemplo: Para un repositorio con estructura https://github.com/usuario/repo
    // la URL base sería: https://raw.githubusercontent.com/usuario/repo/main/
    baseUrl: 'https://raw.githubusercontent.com/usuario/repo/main/images/',
    
    // Define aquí tus categorías
    categories: ['Hot']
};

// Array de imágenes
// Este array debe ser modificado con las rutas de tus imágenes en GitHub
const galleryImages = [
    {
        id: 1,
        name: 'Montañas al atardecer',
        filename: 'mountains-sunset.jpg', // Nombre del archivo en GitHub
        category: 'nature'
    },
    {
        id: 2,
        name: 'Bosque de pinos',
        filename: 'pine-forest.jpg',
        category: 'nature'
    },
    {
        id: 3,
        name: 'Playa tropical',
        filename: 'tropical-beach.jpg',
        category: 'nature'
    },
    {
        id: 4,
        name: 'Calles de Nueva York',
        filename: 'nyc-streets.jpg',
        category: 'urban'
    },
    {
        id: 5,
        name: 'Tokyo de noche',
        filename: 'tokyo-night.jpg',
        category: 'urban'
    },
    {
        id: 6,
        name: 'Calle concurrida',
        filename: 'busy-street.jpg',
        category: 'urban'
    },
    {
        id: 7,
        name: 'Edificio moderno',
        filename: 'modern-building.jpg',
        category: 'architecture'
    },
    {
        id: 8,
        name: 'Catedral histórica',
        filename: 'historic-cathedral.jpg',
        category: 'architecture'
    },
    {
        id: 9,
        name: 'Puente famoso',
        filename: 'famous-bridge.jpg',
        category: 'architecture'
    }
    // Agrega más imágenes según necesites
];

// Variables globales
let currentFilter = 'all';
let currentIndex = 0;

// Elementos DOM
const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const caption = document.getElementById('caption');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const closeLightbox = document.querySelector('.close-lightbox');
const filterButtons = document.querySelectorAll('.filter-btn');

// Inicializar la galería cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    loadGallery();
    setupEventListeners();
});

// Configura todos los event listeners
function setupEventListeners() {
    // Filtros
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            setActiveFilter(filter);
        });
    });

    // Lightbox
    closeLightbox.addEventListener('click', closeLightboxModal);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    // Teclas para navegar en el lightbox
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightboxModal();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });
}

// Cargar imágenes en la galería
function loadGallery() {
    gallery.innerHTML = ''; // Limpiar galería

    // Filtrar imágenes según categoría seleccionada
    let filteredImages = [...galleryImages];
    if (currentFilter !== 'all') {
        filteredImages = galleryImages.filter(img => img.category === currentFilter);
    }
    
    // Verificar si hay imágenes para mostrar
    if (filteredImages.length === 0) {
        gallery.innerHTML = `
            <div class="empty-gallery">
                <i class="fas fa-image"></i>
                <p>No hay imágenes disponibles en esta categoría.</p>
            </div>`;
        return;
    }
    
    // Crear elementos para cada imagen
    filteredImages.forEach((image, index) => {
        const item = createGalleryItem(image, index);
        gallery.appendChild(item);
    });
    
    // Añadir event listeners a los nuevos items de la galería
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.addEventListener('click', function() {
            openLightbox(index);
        });
    });
}

// Crear un elemento de la galería
function createGalleryItem(image, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item fade-in';
    item.setAttribute('data-id', image.id);
    
    // Construir la URL completa de la imagen
    const imageUrl = `${config.baseUrl}${image.filename}`;
    
    item.innerHTML = `
        <img src="${imageUrl}" alt="${image.name}" class="gallery-img" loading="lazy">
        <div class="item-overlay">
            <div class="item-info">
                <div class="item-name">${image.name}</div>
                <div class="item-category">${capitalize(image.category)}</div>
            </div>
        </div>
    `;
    
    return item;
}

// Cambiar el filtro activo
function setActiveFilter(filter) {
    currentFilter = filter;
    
    // Actualizar clase activa en botones
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });
    
    loadGallery();
}

// Abrir el lightbox
function openLightbox(index) {
    // Filtrar imágenes según categoría seleccionada
    let filteredImages = [...galleryImages];
    if (currentFilter !== 'all') {
        filteredImages = galleryImages.filter(img => img.category === currentFilter);
    }
    
    currentIndex = index;
    
    const image = filteredImages[index];
    const imageUrl = `${config.baseUrl}${image.filename}`;
    
    lightboxImg.src = imageUrl;
    caption.textContent = image.name;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Cerrar el lightbox
function closeLightboxModal() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// Mostrar imagen anterior
function showPrevImage() {
    // Filtrar imágenes según categoría seleccionada
    let filteredImages = [...galleryImages];
    if (currentFilter !== 'all') {
        filteredImages = galleryImages.filter(img => img.category === currentFilter);
    }
    
    currentIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    const image = filteredImages[currentIndex];
    const imageUrl = `${config.baseUrl}${image.filename}`;
    
    lightboxImg.src = imageUrl;
    caption.textContent = image.name;
}

// Mostrar imagen siguiente
function showNextImage() {
    // Filtrar imágenes según categoría seleccionada
    let filteredImages = [...galleryImages];
    if (currentFilter !== 'all') {
        filteredImages = galleryImages.filter(img => img.category === currentFilter);
    }
    
    currentIndex = (currentIndex + 1) % filteredImages.length;
    const image = filteredImages[currentIndex];
    const imageUrl = `${config.baseUrl}${image.filename}`;
    
    lightboxImg.src = imageUrl;
    caption.textContent = image.name;
}

// Manejar errores de carga de imágenes
function handleImageError(img) {
    img.onerror = function() {
        this.src = 'placeholder.jpg'; // Imagen de respaldo
        this.alt = 'Imagen no disponible';
    };
}

// Función para capitalizar la primera letra
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
