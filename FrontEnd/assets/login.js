document.getElementById('loginFormulaire').addEventListener('submit', async function (event) {
    event.preventDefault();  // Empêche le rechargement de la page

    // Récupére les données du formulaire
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Vérifie si les champs sont remplis
    if (!email || !password) {
        document.getElementById('message').innerText = "Veuillez remplir tous les champs.";
        return;
    }

    // Construis l'objet à envoyer
    const data = {
        email: email,
        password: password
    };

    try {
        // Envoi de la requête POST à l'API
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'mode': 'cors',
            },

            body: JSON.stringify(data)

        });

        // Vérification de la réponse de l'API
        if (response.ok) {
            const result = await response.json();  // Convertir la réponse en JSON

            // Stocke le token d'authentification dans localStorage
            localStorage.setItem('authToken', result.token);

            // Redirige l'utilisateur vers la page d'accueil 
            window.location.href = 'index.html';
        } else {
            // Si la réponse n'est pas OK (mauvais identifiants)
            const errorResult = await response.json();
            document.getElementById('message').innerText = "Erreur : " + (errorResult.message || "Utilisateur / mot de passe ne sont pas correctes.");
        }
    } catch (error) {
        // Gestion des erreurs réseau ou autres
        document.getElementById('message').innerText = "Utilisateur / mot de passe ne sont pas correctes.";
    }
});






