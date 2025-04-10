// Datos de ejemplo para la galería (puedes reemplazarlos con tus propios datos)
const sampleImages = [
    {
        id: 1,
        name: 'Paisaje montañoso',
        src: 'https://picsum.photos/id/1018/800/600',
        date: '2025-04-02',
        favorite: true,
        category: 'recent'
    },
    {
        id: 2,
        name: 'Playa tropical',
        src: 'https://picsum.photos/id/1019/800/600',
        date: '2025-03-15',
        favorite: false,
        category: 'recent'
    },
    {
        id: 3,
        name: 'Ciudad al atardecer',
        src: 'https://picsum.photos/id/1033/800/600',
        date: '2025-02-21',
        favorite: true,
        category: 'favorites'
    },
    {
        id: 4,
        name: 'Bosque verde',
        src: 'https://picsum.photos/id/1037/800/600',
        date: '2025-01-12',
        favorite: false,
        category: ''
    },
    {
        id: 5,
        name: 'Flores coloridas',
        src: 'https://picsum.photos/id/1052/800/600',
        date: '2024-12-05',
        favorite: true,
        category: 'favorites'
    },
    {
        id: 6,
        name: 'Calle urbana',
        src: 'https://picsum.photos/id/1067/800/600',
        date: '2024-11-20',
        favorite: false,
        category: ''
    }
];

// Variables globales
let currentImages = [...sampleImages];
let currentFilter = 'all';
let currentIndex = 0;

// Elementos DOM
const gallery = document.getElementById('gallery');
const fileUpload = document.getElementById('file-upload');
const filterButtons = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const caption = document.getElementById('caption');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const closeLightbox = document.querySelector('.close-lightbox');
const uploadBox = document.querySelector('.upload-box');

// Cargar imágenes iniciales
document.addEventListener('DOMContentLoaded', function() {
    renderGallery();
    setupEventListeners();
});

// Configurar todos los event listeners
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

    // Escape para cerrar lightbox
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightboxModal();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });

    // Cargar archivos
    fileUpload.addEventListener('change', handleFileUpload);
    
    // Drag and drop
    uploadBox.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--secondary-color)';
        this.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
    });
    
    uploadBox.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--primary-color)';
        this.style.backgroundColor = '';
    });
    
    uploadBox.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--primary-color)';
        this.style.backgroundColor = '';
        
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });
}

// Renderizar la galería basada en el filtro actual
function renderGallery() {
    gallery.innerHTML = '';
    let filteredImages = [...currentImages];
    
    if (currentFilter === 'recent') {
        filteredImages = currentImages.filter(img => img.category === 'recent');
    } else if (currentFilter === 'favorites') {
        filteredImages = currentImages.filter(img => img.favorite);
    }
    
    if (filteredImages.length === 0) {
        gallery.innerHTML = '<p class="no-images">No hay imágenes para mostrar en esta categoría.</p>';
        return;
    }
    
    filteredImages.forEach((image, index) => {
        const item = createGalleryItem(image, index);
        gallery.appendChild(item);
    });
    
    // Añadir event listeners a los nuevos items
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.addEventListener('click', function(e) {
            if (!e.target.classList.contains('action-btn')) {
                openLightbox(index);
            }
        });
    });
    
    // Añadir event listeners a los botones de favorito
    document.querySelectorAll('.favorite-btn').forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const imageId = parseInt(this.closest('.gallery-item').getAttribute('data-id'));
            toggleFavorite(imageId);
        });
    });
    
    // Añadir event listeners a los botones de eliminar
    document.querySelectorAll('.delete-btn').forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const imageId = parseInt(this.closest('.gallery-item').getAttribute('data-id'));
            deleteImage(imageId);
        });
    });
}

// Crear un elemento de la galería
function createGalleryItem(image, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item fade-in';
    item.setAttribute('data-id', image.id);
    
    item.innerHTML = `
        <img src="${image.src}" alt="${image.name}" class="gallery-img">
        <div class="item-overlay">
            <span class="item-name">${image.name}</span>
            <div class="item-actions">
                <button class="action-btn favorite-btn" title="${image.favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}">
                    <i class="fas fa-heart" style="color: ${image.favorite ? 'red' : 'white'};"></i>
                </button>
                <button class="action-btn delete-btn" title="Eliminar imagen">
                    <i class="fas fa-trash"></i>
                </button>
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
    
    renderGallery();
}

// Abrir el lightbox
function openLightbox(index) {
    let filteredImages = [...currentImages];
    
    if (currentFilter === 'recent') {
        filteredImages = currentImages.filter(img => img.category === 'recent');
    } else if (currentFilter === 'favorites') {
        filteredImages = currentImages.filter(img => img.favorite);
    }
    
    currentIndex = index;
    
    const image = filteredImages[index];
    lightboxImg.src = image.src;
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
    let filteredImages = [...currentImages];
    
    if (currentFilter === 'recent') {
        filteredImages = currentImages.filter(img => img.category === 'recent');
    } else if (currentFilter === 'favorites') {
        filteredImages = currentImages.filter(img => img.favorite);
    }
    
    currentIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    const image = filteredImages[currentIndex];
    
    lightboxImg.src = image.src;
    caption.textContent = image.name;
}

// Mostrar imagen siguiente
function showNextImage() {
    let filteredImages = [...currentImages];
    
    if (currentFilter === 'recent') {
        filteredImages = currentImages.filter(img => img.category === 'recent');
    } else if (currentFilter === 'favorites') {
        filteredImages = currentImages.filter(img => img.favorite);
    }
    
    currentIndex = (currentIndex + 1) % filteredImages.length;
    const image = filteredImages[currentIndex];
    
    lightboxImg.src = image.src;
    caption.textContent = image.name;
}

// Manejar archivos subidos
function handleFileUpload(e) {
    if (e.target.files.length > 0) {
        handleFiles(e.target.files);
    }
}

// Procesar los archivos
function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const newImage = {
                    id: Date.now() + Math.floor(Math.random() * 1000),
                    name: file.name.split('.')[0],
                    src: e.target.result,
                    date: new Date().toISOString().split('T')[0],
                    favorite: false,
                    category: 'recent'
                };
                
                currentImages.unshift(newImage);
                
                // Actualizar la galería si el filtro actual lo permite
                if (currentFilter === 'all' || currentFilter === 'recent') {
                    renderGallery();
                } else {
                    // Mostrar notificación
                    showNotification('Imagen subida con éxito');
                }
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Limpiar el campo de archivo
    fileUpload.value = '';
}

// Alternar favorito
function toggleFavorite(imageId) {
    const index = currentImages.findIndex(img => img.id === imageId);
    
    if (index !== -1) {
        currentImages[index].favorite = !currentImages[index].favorite;
        renderGallery();
    }
}

// Eliminar imagen
function deleteImage(imageId) {
    if (confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
        currentImages = currentImages.filter(img => img.id !== imageId);
        renderGallery();
    }
}

// Mostrar notificación
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification fade-in';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}
