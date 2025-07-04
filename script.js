// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission handling with email functionality
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Gönderiliyor...';
        submitBtn.disabled = true;
        
        // Prepare email content
        const emailSubject = 'Yeni İletişim Talebi - Ahmet Berat Özel Ders';
        const emailBody = `
Yeni bir iletişim talebi alındı:

Ad Soyad: ${data.name}
E-posta: ${data.email}
Telefon: ${data.phone}
Ders: ${data.subject}
Mesaj: ${data.message || 'Mesaj yazılmamış'}

Bu mesaj website üzerinden gönderilmiştir.
        `;
        
        // Create mailto link
        const mailtoLink = `mailto:ahmetberatdogan1@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Open default email client
        window.location.href = mailtoLink;
        
        // Show success message
        setTimeout(() => {
            showNotification('E-posta uygulamanız açıldı. Mesajı göndermek için "Gönder" butonuna tıklayın.', 'success');
            
            // Reset form
            this.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .feature-card, .about-content, .contact-content');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
        }
    }
    
    updateCounter();
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (number > 0) {
                    animateCounter(stat, number);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe hero stats
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');
    
    if (hero && heroImage) {
        const rate = scrolled * -0.5;
        heroImage.style.transform = `translateY(${rate}px)`;
    }
});

// Add hover effects to service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click-to-copy functionality for contact information
document.querySelectorAll('.contact-item p').forEach(p => {
    p.style.cursor = 'pointer';
    p.addEventListener('click', function() {
        const text = this.textContent;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Bilgi panoya kopyalandı!', 'success');
        }).catch(() => {
            showNotification('Kopyalama başarısız oldu.', 'error');
        });
    });
});

// Enhanced image loading with error handling
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Check if image is already loaded
        if (img.complete && img.naturalHeight !== 0) {
            // Image is already loaded, make it visible immediately
            img.style.opacity = '1';
            img.style.visibility = 'visible';
            img.style.display = 'block';
        } else {
            // Image is not loaded yet, set initial state
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        }
        
        // Handle successful load
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.visibility = 'visible';
            this.style.display = 'block';
        });
        
        // Handle load error
        img.addEventListener('error', function() {
            console.error('Image failed to load:', this.src);
            this.style.opacity = '1';
            this.style.visibility = 'visible';
            this.style.display = 'block';
            
            // Create fallback content
            const parent = this.parentElement;
            if (parent) {
                const fallback = document.createElement('div');
                fallback.style.cssText = `
                    width: ${this.width || '100%'};
                    height: ${this.height || '200px'};
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border-radius: ${this.classList.contains('profile-img') ? '20px' : '8px'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    text-align: center;
                    padding: 1rem;
                `;
                
                if (this.src.includes('Dershane_Logosu')) {
                    fallback.textContent = 'ÜniversalPark\nEğitim';
                } else if (this.src.includes('Ahmet_Berat')) {
                    fallback.textContent = 'Ahmet Berat\nÖğretmen';
                }
                
                parent.replaceChild(fallback, this);
            }
        });
    });
});

// Add scroll progress indicator
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    z-index: 10001;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Close notifications
        document.querySelectorAll('.notification').forEach(notification => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
    }
});

// Add touch gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - close mobile menu
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Navbar background change
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
    
    // Progress bar
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Initialize tooltips for contact information
document.querySelectorAll('.contact-item').forEach(item => {
    const p = item.querySelector('p');
    if (p) {
        p.title = 'Kopyalamak için tıklayın';
    }
});

// Add focus management for accessibility
document.querySelectorAll('a, button, input, select, textarea').forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid #2563eb';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Handle WhatsApp and Instagram links
document.addEventListener('DOMContentLoaded', () => {
    // WhatsApp link
    const whatsappLink = document.querySelector('a[href*="wa.me"]');
    if (whatsappLink) {
        whatsappLink.addEventListener('click', (e) => {
            // The link will open WhatsApp with the phone number
            // No additional handling needed as the href is already correct
        });
    }
    
    // Instagram link
    const instagramLink = document.querySelector('a[href*="instagram.com"]');
    if (instagramLink) {
        instagramLink.addEventListener('click', (e) => {
            // The link will open Instagram profile
            // No additional handling needed as the href is already correct
        });
    }
});

console.log('Website loaded successfully! 🎉');

document.addEventListener('DOMContentLoaded', function() {
    var kurumNumara = document.getElementById('kurumNumara');
    if (kurumNumara) {
        kurumNumara.addEventListener('click', function() {
            navigator.clipboard.writeText('0352 220 5560').then(function() {
                showNotification('Numara panoya kopyalandı!', 'success');
            }, function() {
                showNotification('Kopyalama başarısız oldu.', 'error');
            });
        });
    }
});

// Dark Mode Toggle
function setDarkMode(enabled) {
    if (enabled) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        document.getElementById('darkModeToggle').innerHTML = '<i class="fas fa-moon"></i>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    // Varsayılan olarak dark mode açık
    let darkMode = localStorage.getItem('darkMode');
    if (darkMode === null) {
        darkMode = 'enabled';
        localStorage.setItem('darkMode', 'enabled');
    }
    setDarkMode(darkMode === 'enabled');
    darkModeToggle.addEventListener('click', function() {
        darkMode = localStorage.getItem('darkMode');
        if (darkMode !== 'enabled') {
            setDarkMode(true);
            localStorage.setItem('darkMode', 'enabled');
        } else {
            setDarkMode(false);
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}); 