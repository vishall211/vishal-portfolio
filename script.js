
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const colors = ['rgba(139, 92, 246, 0.6)', 'rgba(6, 182, 212, 0.6)', 'rgba(255, 255, 255, 0.4)'];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.reset();
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5; // Slightly larger
        this.speedX = (Math.random() * 0.8 - 0.4); // Faster
        this.speedY = (Math.random() * 0.8 - 0.4);
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = 0;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;

        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) {
            const angle = Math.atan2(dy, dx);
            const force = (120 - distance) / 120;
            const moveX = Math.cos(angle) * force * 2;
            const moveY = Math.sin(angle) * force * 2;
            this.x -= moveX;
            this.y -= moveY;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const mouse = { x: null, y: null };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

function initParticles() {
    particles = [];
    // Higher density: Lower divisor = More particles
    const numberOfParticles = (canvas.width * canvas.height) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 110) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - distance / 110)})`; // Brighter lines
                ctx.lineWidth = 0.6;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Scroll Animations
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    setupMobileMenu();
    setupContactForm();
    setupModals(); // Initialize Modals
});

// Modal System
const projectData = {
    "1": {
        title: "Jio Churn Analysis",
        description: "Performed end-to-end churn analysis by analyzing customer datasets, exploring usage trends, and identifying churn drivers. Insights were presented through Tableau dashboards and data-driven recommendations.",
        tags: ["Tableau", "Excel", "Data Viz", "Analytics"]
    },
    "2": {
        title: "Real-Time Chat App",
        description: "A secure, real-time chat application built with Node.js, Express, and Socket.io. Features include private messaging, multi-room support, and a responsive dark-themed UI.",
        tags: ["Socket.io", "Node.js", "Express", "CSS3"]
    },
    "3": {
        title: "Productivity Dashboard",
        description: "An all-in-one productivity dashboard that helps users track tasks and goals. Integrates with Google Calendar API and uses local storage for data persistence.",
        tags: ["JavaScript", "APIs", "Local Storage", "Productivity"]
    }
};

function setupModals() {
    const modalOverlay = document.getElementById('project-modal');
    const modalClose = document.querySelector('.modal-close');
    const projectCards = document.querySelectorAll('.project-card');

    const modalTitle = document.querySelector('.modal-title');
    const modalDesc = document.querySelector('.modal-description');
    const modalTags = document.querySelector('.modal-tags');

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            const data = projectData[id];

            if (data && modalOverlay) {
                modalTitle.textContent = data.title;
                modalDesc.textContent = data.description;

                modalTags.innerHTML = '';
                data.tags.forEach(tag => {
                    const tagEl = document.createElement('span');
                    tagEl.className = 'modal-tag';
                    tagEl.textContent = tag;
                    modalTags.appendChild(tagEl);
                });

                modalOverlay.classList.add('active');
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }
}

// Mobile Menu
function setupMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        links.forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }
}

// Contact Form
function setupContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            const data = new FormData(event.target);

            if (form.action.includes('PLACEHOLDER')) {
                status.style.display = 'block';
                status.style.color = '#ff6b6b';
                status.innerHTML = "Error: Update form action in index.html with Formspree URL.";
                return;
            }

            status.style.display = 'block';
            status.style.color = '#fff';
            status.innerHTML = "Sending...";

            fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    status.innerHTML = "Message Sent! I'll get back to you soon.";
                    status.style.color = '#4ade80'; // Green
                    form.reset();
                } else {
                    status.innerHTML = "Oops! There was a problem.";
                    status.style.color = '#ff6b6b';
                }
            }).catch(error => {
                status.innerHTML = "Oops! There was a problem.";
            });
        });
    }
}
