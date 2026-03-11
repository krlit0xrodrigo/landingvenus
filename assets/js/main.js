document.addEventListener('DOMContentLoaded', () => {
    
    // 0. Render Events
    const eventsContainer = document.getElementById('events-container');
    if (eventsContainer && typeof misEventos !== 'undefined') {
        misEventos.forEach((evento, index) => {
            const delayClass = `delay-${(index % 6) + 1}`; // reusa animaciones CSS
            const eventHTML = `
                <div class="event-card fade-in-up ${delayClass}">
                    <div class="event-date">
                        <span class="day">${evento.dia}</span>
                        <span class="month">${evento.mes}</span>
                    </div>
                    <div class="event-info">
                        <h3>${evento.titulo}</h3>
                        <p><i class="fas fa-map-marker-alt"></i> ${evento.lugar}</p>
                        <p class="desc">${evento.descripcion}</p>
                    </div>
                </div>
            `;
            eventsContainer.insertAdjacentHTML('beforeend', eventHTML);
        });
    }

    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // 2. Scroll animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Solo animar una vez
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(element => {
        observer.observe(element);
    });

    // 3. Navbar change on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '1rem 0';
        }
    });

    // Form Submissions ya no son manejados vía JS puesto que ahora usamos el iframe nativo.

    // 5. Countdown Timer (Para elecciones)
    // Fecha de las elecciones: 7 de Junio de 2026
    const electionDate = new Date(`June 7, 2026 07:00:00`).getTime();

    const x = setInterval(function() {
        const now = new Date().getTime();
        const distance = electionDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const elDays = document.getElementById("days");
        const elHours = document.getElementById("hours");
        const elMins = document.getElementById("minutes");
        const elSecs = document.getElementById("seconds");

        if (elDays && elHours && elMins && elSecs) {
            elDays.innerHTML = days < 10 ? "0" + days : days;
            elHours.innerHTML = hours < 10 ? "0" + hours : hours;
            elMins.innerHTML = minutes < 10 ? "0" + minutes : minutes;
            elSecs.innerHTML = seconds < 10 ? "0" + seconds : seconds;
        }

        // Si la cuenta regresiva termina
        if (distance < 0) {
            clearInterval(x);
            const countdownContainer = document.getElementById("countdown");
            if (countdownContainer) {
                countdownContainer.innerHTML = "<h2>¡Hoy es el día de elegir el cambio!</h2>";
            }
        }
    }, 1000);

    // 5.5 Gallery Carousel Navigation
    const galleryCarousel = document.querySelector('.grid-gallery.carousel');
    const prevGallery = document.querySelector('.prev-gallery');
    const nextGallery = document.querySelector('.next-gallery');

    if (galleryCarousel) {
        if (prevGallery) {
            prevGallery.addEventListener('click', () => {
                const scrollAmount = galleryCarousel.clientWidth > 600 ? 300 : galleryCarousel.clientWidth;
                galleryCarousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }
        
        if (nextGallery) {
            nextGallery.addEventListener('click', () => {
                const scrollAmount = galleryCarousel.clientWidth > 600 ? 300 : galleryCarousel.clientWidth;
                galleryCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
    }

    // 6. Gallery Lightbox
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const galleryImages = document.querySelectorAll('.gallery-img');
    let currentImageIndex = 0;

    if (lightbox && lightboxImg) {
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentImageIndex = index;
                showImage(currentImageIndex);
                lightbox.style.display = 'flex';
                // Trigger reflow for transition
                setTimeout(() => lightbox.classList.add('show'), 10);
            });
        });

        const showImage = (index) => {
            lightboxImg.src = galleryImages[index].src;
            lightboxImg.alt = galleryImages[index].alt;
        };

        const changeImage = (direction) => {
            currentImageIndex += direction;
            if (currentImageIndex >= galleryImages.length) {
                currentImageIndex = 0;
            } else if (currentImageIndex < 0) {
                currentImageIndex = galleryImages.length - 1;
            }
            showImage(currentImageIndex);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 300); // match transition duration
        };

        lightboxClose.addEventListener('click', closeLightbox);
        
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent closing lightbox
                changeImage(-1);
            });
        }
        
        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent closing lightbox
                changeImage(1);
            });
        }
        
        // Close when clicking outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Close on escape key and support arrow keys
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') {
                    closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    changeImage(-1);
                } else if (e.key === 'ArrowRight') {
                    changeImage(1);
                }
            }
        });
    }

});
