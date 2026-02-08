// --- 1. ANIMATION CURSEUR ---
const cursorDot = document.getElementById("cursor-dot");
const cursorOutline = document.getElementById("cursor-outline");

window.addEventListener("mousemove", function (e) {
    const posX = e.clientX;
    const posY = e.clientY;

    // Le point suit instantanément
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Le cercle suit avec un délai (effet fluide)
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Agrandir le curseur sur les liens
document.querySelectorAll('a, button, .panel').forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '80px';
        cursorOutline.style.height = '80px';
        cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });
    link.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '50px';
        cursorOutline.style.height = '50px';
        cursorOutline.style.backgroundColor = 'transparent';
    });
});

// --- 2. ANIMATIONS GSAP ---

// Enregistrer le plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Animation d'Intro (Hero)
const tl = gsap.timeline();

tl.from(".hero-bg-img img", {
    scale: 1.2,
    duration: 2,
    ease: "power2.out"
})
.from(".hero-title .line", {
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power4.out"
}, "-=1.5")
.from(".hero-subtitle, .scroll-indicator", {
    opacity: 0,
    y: 20,
    duration: 1
}, "-=0.5");

// Animation des images au scroll (Parallax)
gsap.utils.toArray(".panel img").forEach((img, i) => {
    gsap.to(img, {
        scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        },
        y: -50, // L'image bouge légèrement moins vite que le scroll
        ease: "none"
    });
});

// Animation du texte qui apparaît
gsap.utils.toArray(".text-block").forEach(block => {
    gsap.from(block, {
        scrollTrigger: {
            trigger: block,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// Animation de la section Contact
gsap.from(".contact-form-wrapper", {
    scrollTrigger: {
        trigger: ".contact-section",
        start: "top 70%", // L'animation commence quand la section est visible à 70%
    },
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out"
});

gsap.from(".contact-visual > *", {
    scrollTrigger: {
        trigger: ".contact-section",
        start: "top 70%",
    },
    x: -50,
    opacity: 0,
    duration: 1,
    stagger: 0.2, // Délai entre le titre, le texte et l'orbe
    ease: "power3.out"
});

/*js présentation*/
// --- 4. LOGIQUE PORTFOLIO FILTRABLE ---

// Les données (Tu remplaceras les URLs par les tiennes)
const portfolioData = {
    nude: [
        { type: 'image', src: 'static/moiArr.jpeg', title: 'Soft Morning Glow', desc: 'Natural Skin Finish' },
        { type: 'image', src: 'static/moiRobe.jpeg', title: 'Bridal Nude', desc: 'Wedding Perfection' },
        { type: 'video', src: 'static/flex2.mp4', title: 'Fresh Face', desc: 'Video Tutorial' }
    ],
    glamour: [
        { type: 'image', src: 'static/nous2.jpeg', title: 'Red Carpet Ready', desc: 'Highlighter Focus' },
        { type: 'video', src: 'static/chaperon.mp4', title: 'Lip Precision', desc: 'Behind the Scenes' },
        { type: 'image', src: 'static/jupeW.jpeg', title: 'Golden Hour', desc: 'Editorial Shoot' }
    ],
    smokey: [
        { type: 'image', src: 'static/mes3.jpeg', title: 'Midnight Blue', desc: 'Intense Eyes' },
        { type: 'image', src: 'static/4tete.jpeg', title: 'Grunge Chic', desc: 'Matte Finish' },
        { type: 'video', src: 'static/flex1.mp4', title: 'Classic Black', desc: 'Smokey Cat Eye' }
    ]
};

const gridContainer = document.getElementById('portfolio-grid');
const tabs = document.querySelectorAll('.tab-btn');

// Fonction pour afficher les cartes
function displayCategory(category) {
    // 1. On vide la grille (avec un petit effet fade out si on veut, ici on fait simple)
    gridContainer.innerHTML = '';
    
    const items = portfolioData[category];

    items.forEach((item, index) => {
        // Création de l'élément HTML
        const card = document.createElement('div');
        card.className = 'look-card';
        
        // Contenu Média (Image ou Vidéo)
        let mediaHTML = '';
        let badgeIcon = '↗'; // Flèche par défaut

        if(item.type === 'video') {
            // Si c'est une vidéo, on la met en loop muted + autoplay au survol
            mediaHTML = `<video src="${item.src}" muted loop onmouseover="this.play()" onmouseout="this.pause()"></video>`;
            badgeIcon = '▶'; // Icône Play
        } else {
            mediaHTML = `<img src="${item.src}" alt="${item.title}">`;
        }

        card.innerHTML = `
            <div class="media-wrapper">
                ${mediaHTML}
                <div class="card-badge">${badgeIcon}</div>
            </div>
            <div class="card-info">
                <h3>${item.title}</h3>
                <span>${item.desc}</span>
            </div>
        `;

        gridContainer.appendChild(card);

        // Animation d'apparition avec GSAP
        gsap.from(card, {
            y: 30,
            opacity: 0,
            duration: 0.5,
            delay: index * 0.1, // Effet cascade
            ease: "power2.out"
        });
    });
}

// Gestion des clics sur les boutons
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Retirer la classe 'active' de tous les boutons
        tabs.forEach(t => t.classList.remove('active'));
        // Ajouter 'active' au bouton cliqué
        tab.classList.add('active');
        
        // Afficher la catégorie demandée
        const category = tab.dataset.category;
        displayCategory(category);
    });
});

// Charger la première catégorie par défaut (Nude)
displayCategory('nude');
/* ancien js*/
/*
// --- 1. DONNÉES INITIALES (Simulation BDD) ---
const defaultData = [
    { id: 1, url: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', category: 'mariage' },
    { id: 2, url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', category: 'artistique' },
    { id: 3, url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', category: 'shooting' },
    { id: 4, url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', category: 'mariage' }
];

// Charger les données depuis le LocalStorage ou utiliser les défauts
function loadData() {
    const stored = localStorage.getItem('muaPortfolio');
    return stored ? JSON.parse(stored) : defaultData;
}

// Sauvegarder dans le LocalStorage
function saveData(data) {
    localStorage.setItem('muaPortfolio', JSON.stringify(data));
}

let portfolioData = loadData();

// --- 2. LOGIQUE PAGE PUBLIQUE (Index) ---
const galleryContainer = document.getElementById('gallery-container');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderGallery(filter = 'all') {
    if (!galleryContainer) return; // Stop si on est sur la page admin
    
    galleryContainer.innerHTML = '';
    
    const filteredData = filter === 'all' 
        ? portfolioData 
        : portfolioData.filter(item => item.category === filter);

    filteredData.forEach(item => {
        const div = document.createElement('div');
        div.className = `gallery-item`;
        div.innerHTML = `
            <img src="${item.url}" alt="Maquillage ${item.category}" onclick="openLightbox('${item.url}')">
            <div class="overlay">${item.category.toUpperCase()}</div>
        `;
        galleryContainer.appendChild(div);
    });
}

// Filtres
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        renderGallery(btn.dataset.filter);
    });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-lightbox');

window.openLightbox = function(url) {
    lightbox.style.display = "block";
    lightboxImg.src = url;
}

if(closeBtn) {
    closeBtn.onclick = function() {
        lightbox.style.display = "none";
    }
}

// Initialiser la galerie publique
renderGallery();

// --- 3. LOGIQUE PAGE ADMIN ---
const adminGallery = document.getElementById('admin-gallery');

function renderAdminGallery() {
    if (!adminGallery) return; // Stop si on est sur la page publique

    adminGallery.innerHTML = '';
    portfolioData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'admin-img-card';
        div.innerHTML = `
            <img src="${item.url}">
            <button class="delete-btn" onclick="deletePhoto(${item.id})">X</button>
        `;
        adminGallery.appendChild(div);
    });
}

window.addPhoto = function() {
    const urlInput = document.getElementById('imgUrl');
    const catInput = document.getElementById('imgCategory');
    
    if (urlInput.value === '') {
        alert("Il faut une URL d'image !");
        return;
    }

    const newPhoto = {
        id: Date.now(), // ID unique basé sur l'heure
        url: urlInput.value,
        category: catInput.value
    };

    portfolioData.push(newPhoto);
    saveData(portfolioData);
    
    urlInput.value = ''; // Reset champ
    renderAdminGallery(); // Rafraîchir admin
    alert("Photo ajoutée ! Retourne sur l'accueil pour voir.");
}

window.deletePhoto = function(id) {
    if(confirm('Supprimer cette photo ?')) {
        portfolioData = portfolioData.filter(item => item.id !== id);
        saveData(portfolioData);
        renderAdminGallery();
    }
}
    */