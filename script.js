// Main JavaScript file for Yamoransa Model Lab 8 website

document.addEventListener('DOMContentLoaded', function() {
    console.log('Yamoransa Model Lab 8 website loaded successfully!');
    
    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initDonationForm();
    initQuizSystem();
    initScrollHeader();
    initCounterAnimation();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add animation classes and observe elements
    const animatedElements = [
        { selector: '.hero-content', class: 'fade-in' },
        { selector: '.hero-visual', class: 'fade-in' },
        { selector: '.about-text', class: 'slide-in-left' },
        { selector: '.about-stats', class: 'slide-in-right' },
        { selector: '.program-card', class: 'fade-in' },
        { selector: '.resource-item', class: 'fade-in' },
        { selector: '.quiz-section', class: 'slide-in-right' },
        { selector: '.gallery-item', class: 'fade-in' },
        { selector: '.news-card', class: 'fade-in' },
        { selector: '.donate-info', class: 'slide-in-left' },
        { selector: '.donation-form', class: 'slide-in-right' }
    ];
    
    animatedElements.forEach(({ selector, class: className }) => {
        document.querySelectorAll(selector).forEach((element, index) => {
            element.classList.add(className);
            element.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(element);
        });
    });
}

// Header Scroll Effect
function initScrollHeader() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--primary-black)';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Counter Animation for Statistics
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/\D/g, ''));
                const suffix = counter.textContent.replace(/\d/g, '');
                
                animateCounter(counter, 0, target, suffix, 2000);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element, start, end, suffix, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// Quiz System
function initQuizSystem() {
    const quizQuestions = [
        {
            question: "What is the primary goal of machine learning?",
            options: [
                "To replace human intelligence",
                "To learn patterns from data",
                "To store large amounts of data",
                "To create databases"
            ],
            correct: 1
        },
        {
            question: "Which statistical measure indicates the central tendency?",
            options: [
                "Standard deviation",
                "Variance",
                "Mean",
                "Range"
            ],
            correct: 2
        },
        {
            question: "What does 'Big Data' typically refer to?",
            options: [
                "Data larger than 1GB",
                "Data with high volume, velocity, and variety",
                "Data stored in the cloud",
                "Encrypted data"
            ],
            correct: 1
        },
        {
            question: "In data visualization, what is the purpose of a scatter plot?",
            options: [
                "To show trends over time",
                "To compare categories",
                "To show relationships between two variables",
                "To display proportions"
            ],
            correct: 2
        },
        {
            question: "What is the main advantage of using Python for data analysis?",
            options: [
                "It's the fastest programming language",
                "It has extensive libraries for data science",
                "It requires no installation",
                "It only works with numerical data"
            ],
            correct: 1
        }
    ];
    
    let currentQuestion = 0;
    let score = 0;
    let selectedAnswer = null;
    
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.querySelector('.quiz-options');
    const nextButton = document.getElementById('next-question');
    const restartButton = document.getElementById('restart-quiz');
    const scoreElement = document.getElementById('score');
    const totalElement = document.getElementById('total-questions');
    
    if (!questionText || !optionsContainer) return;
    
    totalElement.textContent = quizQuestions.length;
    
    function loadQuestion() {
        const question = quizQuestions[currentQuestion];
        questionText.textContent = question.question;
        
        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.textContent = option;
            button.addEventListener('click', () => selectAnswer(index, button));
            optionsContainer.appendChild(button);
        });
        
        selectedAnswer = null;
        nextButton.disabled = true;
    }
    
    function selectAnswer(index, button) {
        // Remove previous selections
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        button.classList.add('selected');
        selectedAnswer = index;
        nextButton.disabled = false;
    }
    
    function showAnswer() {
        const question = quizQuestions[currentQuestion];
        const options = document.querySelectorAll('.quiz-option');
        
        options.forEach((option, index) => {
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === selectedAnswer && index !== question.correct) {
                option.classList.add('incorrect');
            }
            option.disabled = true;
        });
        
        if (selectedAnswer === question.correct) {
            score++;
            scoreElement.textContent = score;
        }
    }
    
    nextButton.addEventListener('click', function() {
        if (selectedAnswer === null) return;
        
        showAnswer();
        
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < quizQuestions.length) {
                loadQuestion();
            } else {
                showFinalScore();
            }
        }, 1500);
    });
    
    restartButton.addEventListener('click', function() {
        currentQuestion = 0;
        score = 0;
        selectedAnswer = null;
        scoreElement.textContent = score;
        loadQuestion();
        nextButton.style.display = 'inline-block';
        nextButton.textContent = 'Next Question';
    });
    
    function showFinalScore() {
        const percentage = Math.round((score / quizQuestions.length) * 100);
        questionText.textContent = `Quiz Complete! You scored ${score}/${quizQuestions.length} (${percentage}%)`;
        optionsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h4 style="color: var(--primary-red); margin-bottom: 1rem;">
                    ${percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good job!' : 'Keep learning!'}
                </h4>
                <p>${getScoreMessage(percentage)}</p>
            </div>
        `;
        nextButton.style.display = 'none';
    }
    
    function getScoreMessage(percentage) {
        if (percentage >= 80) {
            return "Outstanding performance! You have a strong understanding of data analytics concepts.";
        } else if (percentage >= 60) {
            return "Good work! Consider reviewing some concepts to strengthen your knowledge.";
        } else {
            return "Keep studying! Our programs can help you build stronger foundations in analytics.";
        }
    }
    
    // Initialize first question
    loadQuestion();
}

// Donation Form Handling
function initDonationForm() {
    const donationForm = document.getElementById('donationForm');
    const amountButtons = document.querySelectorAll('.amount-btn');
    const amountInput = document.getElementById('donation-amount');
    
    // Amount button functionality
    amountButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all buttons
            amountButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Set amount if not custom
            const amount = this.dataset.amount;
            if (amount !== 'custom') {
                amountInput.value = amount;
            } else {
                amountInput.focus();
            }
        });
    });
    
    // Custom amount input
    amountInput.addEventListener('input', function() {
        amountButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-amount="custom"]').classList.add('active');
    });
    
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(donationForm);
            const amount = formData.get('amount');
            const name = formData.get('name');
            const email = formData.get('email');
            const type = formData.get('type');
            const recurring = formData.get('recurring');
            
            // Basic validation
            if (!amount || !name || !email || !type) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            if (amount < 1) {
                showNotification('Please enter a valid donation amount.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate donation processing
            const recurringText = recurring ? ' monthly' : '';
            showNotification(
                `Thank you ${name}! Your${recurringText} donation of $${amount} for ${type} has been processed successfully.`, 
                'success'
            );
            donationForm.reset();
            
            // Reset amount buttons
            amountButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector('[data-amount="custom"]').classList.add('active');
        });
    }
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
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
        background: ${type === 'success' ? 'var(--accent-green)' : type === 'error' ? 'var(--primary-red)' : 'var(--dark-gray)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
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

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-element');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Add hover effects for program cards
document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click effects for buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Gallery lightbox effect (simple version)
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const overlay = this.querySelector('.gallery-overlay');
        const title = overlay.querySelector('h4').textContent;
        const description = overlay.querySelector('p').textContent;
        
        showNotification(`${title}: ${description}`, 'info');
    });
});

// Add CSS animation for ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
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

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Any scroll-based animations can be added here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

console.log('Yamoransa Model Lab 8 - All interactive features initialized successfully!');
