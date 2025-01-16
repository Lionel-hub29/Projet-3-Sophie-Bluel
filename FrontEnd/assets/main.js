const userToken = localStorage.getItem("authToken") || null;

let allImages = [];
let categories = [];

// Fonction pour récupérer les images depuis l'API
async function fetchImages() {
    try {
        const response = await fetch('http://localhost:5678/api/works');

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des images');
        }

        allImages = await response.json();

        //Sauvegarder les images dans le localStorage
        // saveImagesToLocalStorage(allImages);

        galerieImages(allImages);
    } catch (error) {
        console.error(error);
        document.getElementById('gallery').innerHTML = 'Erreur de chargement des images';
    }
}

// fonction pour sauvegarder les images dans le localstorage
function saveImagesToLocalStorage(images) {
    const imagestostore = images.map(image => ({
        id: image.id,
        src: image.imageurl,
        title: image.title,
        categoryid: image.categoryid
    }));

    localstorage.setItem('gallery', json.stringify(imagestostore));
}

// Fonction pour récupérer les catégories depuis l'API
async function filtreCategories() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des catégories');
        }

        categories = await response.json();

        boutonFiltre(categories);
    } catch (error) {
        console.error(error);
        document.getElementById('btn-filtre').innerHTML = 'Erreur de chargement des catégories';
    }
}

// Fonction pour générer les boutons de filtre en fonction des catégories
function boutonFiltre(categories) {
    const filterButtonsContainer = document.getElementById('btn-filtre');

    // Créer un bouton "Tous" pour afficher toutes les images
    const boutonTous = document.createElement('button');
    boutonTous.innerText = 'Tous';
    boutonTous.id = 'filtre-all';

    boutonTous.addEventListener('click', () => galerieImages(allImages));

    filterButtonsContainer.appendChild(boutonTous);

    // Créer des boutons pour chaque catégorie
    categories.forEach((category) => {
        const button = document.createElement('button');
        button.innerText = category.name;
        button.id = `filtre-${category.id}`;

        button.addEventListener('click', () => {
            const filteredImages = allImages.filter(image => image.categoryId === category.id);
            galerieImages(filteredImages);
        });

        filterButtonsContainer.appendChild(button);
    });
}

// Fonction pour afficher les images dans la galerie
function galerieImages(images) {
    const galleryContainer = document.getElementById('gallery');
    galleryContainer.innerHTML = '';

    images.forEach((image) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'img-gallery';

        const imgElement = document.createElement('img');
        imgElement.src = image.imageUrl;
        imgElement.alt = image.name;

        const titleElement = document.createElement('h3');
        titleElement.innerText = image.title;

        galleryItem.appendChild(imgElement);
        galleryItem.appendChild(titleElement);
        galleryContainer.appendChild(galleryItem);
    });
}

// Header button change 
const headerLoginButton = document.getElementById('loginButton'); // Récupère le bouton login
const ajmodif = document.getElementById('modification');
const bandeHeader = document.getElementById('edition');

if (userToken) {
    headerLoginButton.innerHTML = ''; // supprime le contenu du bouton login

    const logoutButton = document.createElement('button'); // crée un nouvel élement dans le dom qui sera un bouton
    logoutButton.textContent = 'logout'; // On ajoute le texte "logout" au bouton

    if (bandeHeader) {
        bandeHeader.innerHTML = '<i class="far fa-edit"></i> mode édition';
        bandeHeader.style.backgroundColor = 'black';
        bandeHeader.style.height = '59px';
    }

    if (ajmodif) {
        ajmodif.innerHTML = '<i class="far fa-edit"></i> <a href="#modal1" class="modal2"> modifier </a>'; /* la classe permet d'ouvrir la modale */
    }

    logoutButton.addEventListener('click', () => { // ajoute un écouteur d'évènement sur le clic du bouton
        localStorage.removeItem('authToken'); // supprime le token de l'utilisateur dans le localStorage

        if (ajmodif) {
            ajmodif.innerHTML = '';
        }

        window.location.reload(); // On recharge la page
    });

    headerLoginButton.appendChild(logoutButton); // On ajoute le nouveau bouton au bouton login (comme nous avons supprimé son contenu, il sera le seul élément à l'intérieur)
}

// Charger les images depuis l'api au démarrage
window.addEventListener('load', () => {
    filtreCategories(); // Charger les catégories
    fetchImages(); // Récupérer les images depuis l'API
});
