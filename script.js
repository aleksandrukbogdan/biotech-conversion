document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');
    const htmlElement = document.documentElement;
    const themeIcon = themeSwitcher.querySelector('.material-symbols-outlined');

    // Function to set the theme
    const setTheme = (isDark) => {
        if (isDark) {
            htmlElement.classList.add('dark-theme');
            themeIcon.textContent = 'light_mode';
            localStorage.setItem('theme', 'dark');
        } else {
            htmlElement.classList.remove('dark-theme');
            themeIcon.textContent = 'dark_mode';
            localStorage.setItem('theme', 'light');
        }
    };

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    // Check for system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Initialize theme
    if (savedTheme) {
        setTheme(savedTheme === 'dark');
    } else {
        setTheme(prefersDark);
    }

    // Add click listener to the switcher
    themeSwitcher.addEventListener('click', () => {
        const isCurrentlyDark = htmlElement.classList.contains('dark-theme');
        setTheme(!isCurrentlyDark);
    });

    // Listen for changes in system preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only change if no theme is manually set in localStorage
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches);
        }
    });

    // News Filter Logic
    const filterContainer = document.querySelector('.filter-chips');
    if (filterContainer) {
        const filterButtons = filterContainer.querySelectorAll('.filter-chip');
        const newsCards = document.querySelectorAll('.news-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active filter button
                filterContainer.querySelector('.active').classList.remove('active');
                button.classList.add('active');

                const filter = button.dataset.filter;

                // Show/hide cards based on filter
                newsCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Ripple Effect
    const addRippleEffect = (elements) => {
        elements.forEach(el => {
            el.addEventListener('click', function (e) {
                const rect = this.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = Math.max(this.clientWidth, this.clientHeight);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;

                ripple.classList.add('ripple');
                this.appendChild(ripple);

                ripple.addEventListener('animationend', () => {
                    ripple.remove();
                });
            });
        });
    };

    addRippleEffect(document.querySelectorAll('.button, .icon-button, .panel-header'));

    // Scroll Animation
    const animatedElements = document.querySelectorAll('.card, .expansion-panel');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        observer.observe(el);
    });
});