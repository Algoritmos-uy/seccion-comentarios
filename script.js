document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('commentForm');
    const ratingStars = document.querySelectorAll('.rating span');
    const carouselInner = document.querySelector('.carousel-inner');
    const prevButton = document.querySelector('.carousel-control.prev');
    const nextButton = document.querySelector('.carousel-control.next');
    let currentRating = 0;
    let currentIndex = 0;

    // Manejar la selección de estrellas
    ratingStars.forEach(star => {
        star.addEventListener('click', function () {
            currentRating = this.getAttribute('data-value');
            ratingStars.forEach(s => s.classList.remove('active'));
            for (let i = 0; i < currentRating; i++) {
                ratingStars[i].classList.add('active');
            }
        });
    });

    // Manejar el envío del formulario
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const username = document.getElementById('name').value;
        const commentText = document.getElementById('comment').value;

        if (username && commentText && currentRating > 0) {
            const comment = {
                username: username,
                text: commentText,
                rating: currentRating
            };

            // Enviar el comentario al backend
            try {
                const response = await fetch('http://localhost:5000/api/comentarios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(comment),
                });

                if (response.ok) {
                    const newComment = await response.json();
                    addCommentToCarousel(newComment, true); // Agregar el comentario al principio
                    form.reset();
                    ratingStars.forEach(star => star.classList.remove('active'));
                    currentRating = 0;
                } else {
                    alert('Error al enviar el comentario');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            alert('Por favor, completa todos los campos y selecciona una calificación.');
        }
    });

    // Cargar comentarios al iniciar
    async function loadComments() {
        try {
            const response = await fetch('http://localhost:5000/api/comentarios');
            const comments = await response.json();
            comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Ordenar por fecha descendente
            comments.forEach(comment => addCommentToCarousel(comment));
        } catch (error) {
            console.error('Error al cargar los comentarios:', error);
        }
    }

    // Añadir comentario al carrusel
    function addCommentToCarousel(comment, prepend = false) {
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');

        const stars = '★'.repeat(comment.rating) + '☆'.repeat(5 - comment.rating);
        carouselItem.innerHTML = `
            <p><strong>${comment.username}</strong></p>
            <p>${comment.text}</p>
            <div class="rating">${stars}</div>
        `;

        if (prepend) {
            carouselInner.prepend(carouselItem); // Agregar al principio
        } else {
            carouselInner.appendChild(carouselItem); // Agregar al final
        }

        // Mostrar el primer comentario si es el primero
        if (carouselInner.children.length === 1) {
            carouselItem.classList.add('active');
        }
    }

    // Control del carrusel
    function showSlide(index) {
        const slides = document.querySelectorAll('.carousel-item');
        if (index >= slides.length) currentIndex = 0;
        if (index < 0) currentIndex = slides.length - 1;
        const offset = -currentIndex * 100;
        carouselInner.style.transform = `translateX(${offset}%)`;
    }

    prevButton.addEventListener('click', () => {
        currentIndex--;
        showSlide(currentIndex);
    });

    nextButton.addEventListener('click', () => {
        currentIndex++;
        showSlide(currentIndex);
    });

    // Cargar comentarios al iniciar la página
    loadComments();
});