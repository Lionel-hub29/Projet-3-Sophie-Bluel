// Fonction d'ouverture de modale
const openModal = function (e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    if (target) {
        target.style.display = null; // Afficher la modale
        target.removeAttribute('aria-hidden');
        target.setAttribute('aria-modal', 'true');

        // Ajouter les événements pour fermer cette modale
        target.addEventListener('click', closeModal); // Fermer quand on clique à l'extérieur
        target.querySelector('.closeModal').addEventListener('click', closeModal); // Fermer quand on clique sur le bouton
        target.querySelector('.modalStop').addEventListener('click', stopPropagation); // Empêcher la propagation
    }
};

// Fonction de fermeture de modale
const closeModal = function (e) {
    const modalToClose = e.target.closest('.modal'); // Trouver la modale correspondante
    if (modalToClose) {
        modalToClose.style.display = 'none'; // Cacher la modale
        modalToClose.setAttribute('aria-hidden', 'true');
        modalToClose.removeAttribute('aria-modal');

        // Retirer les événements pour cette modale
        modalToClose.removeEventListener('click', closeModal); // Retirer l'événement sur le clic à l'extérieur
        modalToClose.querySelector('.closeModal').removeEventListener('click', closeModal); // Retirer l'événement sur le bouton
        modalToClose.querySelector('.modalStop').removeEventListener('click', stopPropagation); // Retirer la propagation
    }
};

// Fonction pour empêcher la propagation des événements
const stopPropagation = function (e) {
    e.stopPropagation(); // Empêcher la fermeture quand on clique à l'intérieur de la modale
};

// Associer l'événement d'ouverture de modale à tous les éléments avec les classes 'modal2' et 'ajoutPhoto'
document.querySelectorAll('.modal2, .ajoutPhoto').forEach(modalLink => {
    modalLink.addEventListener('click', openModal); // Ouvrir la modale correspondante
});

function addImageToGalleryAndModal(imageSrc, imageTitle, imageId) {

    const galleryItem = document.createElement('div');
    galleryItem.classList.add('img-gallery');
    galleryItem.dataset.id = imageId;

    const imgElement = document.createElement('img');
    imgElement.src = imageSrc;
    imgElement.alt = imageTitle || 'Image sans titre';

    const titleElement = document.createElement('h3');
    titleElement.textContent = imageTitle || 'Image sans titre';

    galleryItem.appendChild(imgElement);
    galleryItem.appendChild(titleElement);
    document.getElementById('gallery').appendChild(galleryItem);

    // Ajoutez l'image à la modale
    const modalImageContainer = document.createElement('div');
    modalImageContainer.classList.add('image-container');
    modalImageContainer.dataset.id = imageId;

    const modalImgElement = imgElement.cloneNode(true);
    modalImgElement.style.width = '76px';
    modalImgElement.style.height = '102px';

    const trashIcon = document.createElement('i');
    trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trash-icon', 'fa-xs');
    trashIcon.addEventListener('click', function () {
        removeImage(imageId, modalImageContainer);
    });

    modalImageContainer.appendChild(modalImgElement);
    modalImageContainer.appendChild(trashIcon);
    document.getElementById('modalPhoto').appendChild(modalImageContainer);
}


function modalPhoto() {
    const imageModal = document.getElementById('modalPhoto');

    // Simule une requête API qui renvoie un tableau d'URLs d'images
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {
            imageModal.innerHTML = ''; // Vide la galerie avant d'ajouter de nouvelles images

            data.forEach(photo => {
                const imageContainer = document.createElement('div');
                imageContainer.classList.add('image-container');
                imageContainer.setAttribute('data-id', photo.id);

                // Crée un élément image pour chaque URL récupérée
                const img = document.createElement('img');
                img.src = photo.imageUrl;
                img.style.width = '76px';
                img.style.height = '102px';

                const trashIcon = document.createElement('i');
                trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trash-icon', 'fa-xs');
                trashIcon.setAttribute('aria-hidden', 'true');

                // Ajoute un événement de suppression au clic sur l'icône
                trashIcon.addEventListener('click', function () {
                    removeImage(photo.id, imageContainer);
                });

                // Ajoute l'image et l'icône dans le conteneur
                imageContainer.appendChild(img);
                imageContainer.appendChild(trashIcon);

                // Ajoute le conteneur dans la galerie modale
                imageModal.appendChild(imageContainer);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des images:', error);
        });
}

modalPhoto();

async function filtreCategoriesModal() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des catégories');
        }

        const categories = await response.json();

        // Appel à la fonction pour générer le menu déroulant
        creerMenuDeroulant(categories);
    } catch (error) {
        console.error(error);
        document.getElementById('imageCategory').innerHTML = 'Erreur de chargement des catégories';
    }
}

// Fonction pour générer un menu déroulant en fonction des catégories
function creerMenuDeroulant(categories) {
    const select = document.getElementById('imageCategory');

    // Créer des options pour chaque catégorie
    categories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category.id;
        option.innerText = category.name;

        select.appendChild(option);
    });
}

filtreCategoriesModal();

async function deleteImageFromAPI(imageId) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${userToken}`,
            }
        });

        if (response.ok) {
            // Supprime l'image de `allImages`
            allImages = allImages.filter(image => image.id !== imageId);

            // Met à jour l'affichage de la galerie
            galerieImages(allImages);
        } else {
            throw new Error("Échec de la suppression de l'image.");
        }
    } catch (error) {
        console.error(error);
    }
}

function removeImage(imageId, modalImageContainer) {
    deleteImageFromAPI(imageId).then(() => {
        console.log(`Suppression de l'image avec ID: ${imageId}`);

        // Supprime l'image dans la modale
        modalImageContainer.remove();
        console.log('Image supprimée de la modale');

        // Supprime l'image de la galerie principale
        const galleryItem = document.querySelector(`.img-gallery[data-id="${imageId}"]`);
        if (galleryItem) {
            galleryItem.remove();
        }
    }).catch(error => {
        console.error('Erreur lors de la suppression de l\'image :', error);
    });
}



// Chargement de l'image et suppression de certains éléments
document.getElementById('file-upload').addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file) {
        const maxSize = 4 * 1024 * 1024; // 4 Mo
        if (file.size > maxSize) {
            alert("Le fichier dépasse la taille maximale autorisée de 4 Mo.");
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const previewImage = document.getElementById('previewImage');
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';

            // Cache les éléments de téléchargement
            document.getElementById('imageIcon').style.display = 'none';
            document.querySelector('.upload-btn').style.display = 'none';
            document.getElementById('file-upload').style.display = 'none';
            document.getElementById('insertImgText').style.display = 'none';
        }
        reader.readAsDataURL(file);
    }
});

document.querySelector('.insertPhoto').addEventListener('submit', function (event) {
    event.preventDefault();

    const previewImageSrc = document.getElementById('previewImage').src;
    const imageTitle = document.getElementById('title').value.trim();
    const imageCategory = document.getElementById('imageCategory').value;

    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0];

    // vérification de la modale si aucun champ n'est pas complété
    if (!file || !imageTitle || !imageCategory) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    if (previewImageSrc !== '#' && previewImageSrc) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', imageTitle);
        formData.append('category', imageCategory);

        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${userToken}`
            },
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de l\'envoi de l\'image à l\'API.');
                }
                return response.json();
            })
            .then((data) => {
                fetchImages();
                modalPhoto();
            })
            .catch((error) => {
                alert('Une erreur est survenue lors de l\'envoi de l\'image à l\'API.');
                console.log(error);
            });

        document.getElementById('title').value = ''; // Vide le champ du titre
        document.getElementById('previewImage').src = '#'; // Réinitialise l'image
        document.getElementById('previewImage').style.display = 'none'; // Cache l'aperçu
        document.getElementById('imageIcon').style.display = 'block'; // Réaffiche l'icône d'upload
        document.querySelector('.upload-btn').style.display = 'block'; // Réaffiche le bouton de téléchargement
        document.getElementById('file-upload').value = ''; // Réinitialise l'input de fichier
        document.getElementById('insertImgText').style.display = 'block'; // Réafficher le texte d'instruction

        document.getElementById('imageCategory').selectedIndex = 0; // Réinitialise la catégorie à la première option
    }
});

window.addEventListener('load', function () {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
});