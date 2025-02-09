document.addEventListener('DOMContentLoaded', function() {
    const starRating = document.querySelector('.star-rating');
    const stars = starRating.querySelectorAll('span');
    const ratingInput = document.getElementById('rating');
    const commentForm = document.getElementById('commentForm');
    const commentsList = document.getElementById('commentsList');

    // Arreglo para almacenar los comentarios
    let comments = [];

    // Cargar comentarios guardados en localStorage al iniciar la página
    function loadComments() {
        const savedComments = localStorage.getItem('comments');
        if (savedComments) {
            comments = JSON.parse(savedComments);
        }
        renderComments();
    }

    // Función para guardar comentarios en localStorage
    function saveComments() {
        localStorage.setItem('comments', JSON.stringify(comments));
    }

    // Función para renderizar los comentarios
    function renderComments() {
        // Limpiar la lista de comentarios
        commentsList.innerHTML = '';

        // Mostrar solo los últimos 5 comentarios
        const lastFiveComments = comments.slice(-5);

        lastFiveComments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');

            const userNameDisplay = document.createElement('div');
            userNameDisplay.classList.add('user-name');
            userNameDisplay.textContent = comment.name;

            const commentContent = document.createElement('p');
            commentContent.textContent = comment.text;

            const ratingDisplay = document.createElement('div');
            ratingDisplay.classList.add('rating');
            ratingDisplay.innerHTML = '&#9733;'.repeat(comment.rating);

            commentElement.appendChild(userNameDisplay);
            commentElement.appendChild(commentContent);
            commentElement.appendChild(ratingDisplay);

            commentsList.appendChild(commentElement);
        });
    }

    // Manejar el clic en las estrellas
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = parseInt(star.getAttribute('data-value'));
            ratingInput.value = value;

            stars.forEach(s => s.classList.remove('active'));
            for (let i = 0; i < value; i++) {
                stars[i].classList.add('active');
            }
        });
    });

    // Manejar el envío del formulario
    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const userName = document.getElementById('name').value;
        const commentText = document.getElementById('comment').value;
        const ratingValue = ratingInput.value;

        if (userName.trim() === '' || commentText.trim() === '' || ratingValue === '0') {
            alert('Por favor, completa todos los campos y selecciona una calificación.');
            return;
        }

        // Agregar el nuevo comentario al arreglo
        comments.push({
            name: userName,
            text: commentText,
            rating: ratingValue
        });

        // Guardar los comentarios en localStorage
        saveComments();

        // Renderizar los comentarios
        renderComments();

        // Limpiar el formulario
        commentForm.reset();
        stars.forEach(star => star.classList.remove('active'));
        ratingInput.value = '0';
    });

    // Cargar los comentarios al iniciar la página
    loadComments();
});