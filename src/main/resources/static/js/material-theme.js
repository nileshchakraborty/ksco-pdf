// Material Design Theme Manager

class MaterialTheme {
    constructor() {
        this.defaultTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        this.currentTheme = localStorage.getItem('theme') || this.defaultTheme;
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
        this.setupRippleEffect();
        this.setupFormElements();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    setupEventListeners() {
        // Listen for OS theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });

        // Setup ripple effect listeners
        document.addEventListener('click', this.handleRipple.bind(this));
    }

    setupRippleEffect() {
        // Add ripple style
        const style = document.createElement('style');
        style.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 600ms linear;
                background-color: rgba(255, 255, 255, 0.7);
            }

            .dark .ripple {
                background-color: rgba(0, 0, 0, 0.3);
            }

            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    handleRipple(event) {
        const target = event.target;
        
        if (target.classList.contains('md-button') || target.classList.contains('ripple-effect')) {
            const rect = target.getBoundingClientRect();
            const ripple = document.createElement('span');
            const diameter = Math.max(rect.width, rect.height);
            const radius = diameter / 2;

            ripple.style.width = ripple.style.height = `${diameter}px`;
            ripple.style.left = `${event.clientX - rect.left - radius}px`;
            ripple.style.top = `${event.clientY - rect.top - radius}px`;
            ripple.classList.add('ripple');

            const existingRipple = target.getElementsByClassName('ripple')[0];
            if (existingRipple) {
                existingRipple.remove();
            }

            target.appendChild(ripple);

            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        }
    }

    // Material Alert System
    showAlert(message, type = 'info', duration = 3000) {
        const alert = document.createElement('div');
        alert.className = `md-alert ${type}`;
        alert.textContent = message;

        if (type === 'error') {
            alert.innerHTML = `
                <span class="material-icons">error</span>
                <span>${message}</span>
            `;
        } else if (type === 'success') {
            alert.innerHTML = `
                <span class="material-icons">check_circle</span>
                <span>${message}</span>
            `;
        }

        document.body.appendChild(alert);
        
        // Animate in
        alert.style.opacity = '0';
        alert.style.transform = 'translate(-50%, 20px)';
        setTimeout(() => {
            alert.style.transition = 'all 0.3s ease-out';
            alert.style.opacity = '1';
            alert.style.transform = 'translate(-50%, 0)';
        }, 10);

        // Animate out and remove
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transform = 'translate(-50%, -20px)';
            setTimeout(() => alert.remove(), 300);
        }, duration);
    }

    // File Upload Enhancement
    setupFileUpload(element) {
        if (!element) return;

        element.addEventListener('dragenter', (e) => {
            e.preventDefault();
            element.classList.add('drag-over');
        });

        element.addEventListener('dragleave', (e) => {
            e.preventDefault();
            element.classList.remove('drag-over');
        });

        element.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();
            element.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length) {
                const input = element.querySelector('input[type="file"]');
                if (input) {
                    input.files = files;
                    // Trigger change event
                    const event = new Event('change', { bubbles: true });
                    input.dispatchEvent(event);
                }
            }
        });
    }

    setupFormElements() {
        this.setupTextFields();
        this.setupFileDropZone();
        this.setupExpansionPanels();
    }

    setupTextFields() {
        document.querySelectorAll('.md-text-field__input').forEach(input => {
            input.addEventListener('focus', () => {
                input.closest('.md-text-field').classList.add('md-text-field--focused');
            });

            input.addEventListener('blur', () => {
                input.closest('.md-text-field').classList.remove('md-text-field--focused');
            });

            input.addEventListener('input', () => {
                const label = input.closest('.md-text-field').querySelector('.md-text-field__label');
                if (label) {
                    if (input.value) {
                        label.classList.add('md-text-field__label--float-above');
                    } else {
                        label.classList.remove('md-text-field__label--float-above');
                    }
                }
            });
        });
    }

    setupFileDropZone() {
        document.querySelectorAll('.md-file-drop-zone').forEach(dropZone => {
            const fileInput = dropZone.querySelector('input[type="file"]');
            const fileList = document.querySelector('.md-file-list');
            
            if (fileInput && fileList) {
                // Prevent default drag behaviors
                ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                    dropZone.addEventListener(eventName, this.preventDefaults, false);
                    document.body.addEventListener(eventName, this.preventDefaults, false);
                });

                // Handle drag states
                ['dragenter', 'dragover'].forEach(eventName => {
                    dropZone.addEventListener(eventName, () => {
                        dropZone.classList.add('md-file-drop-zone--active');
                    });
                });

                ['dragleave', 'drop'].forEach(eventName => {
                    dropZone.addEventListener(eventName, () => {
                        dropZone.classList.remove('md-file-drop-zone--active');
                    });
                });

                // Handle dropped files
                dropZone.addEventListener('drop', e => {
                    const files = e.dataTransfer.files;
                    this.handleFiles(files, dropZone, fileList);
                });

                // Handle selected files
                fileInput.addEventListener('change', () => {
                    this.handleFiles(fileInput.files, dropZone, fileList);
                });
            }
        });
    }

    handleFiles(files, dropZone, fileList) {
        if (files.length) {
            dropZone.style.display = 'none';
            const fileNameElement = fileList.querySelector('.md-file-name');
            if (fileNameElement) {
                fileNameElement.textContent = files[0].name;
            }
            fileList.style.display = 'block';

            // Dispatch change event for compatibility
            const event = new Event('file-input-change', {
                bubbles: true,
                detail: { allFiles: files }
            });
            dropZone.dispatchEvent(event);
        }
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    setupExpansionPanels() {
        document.querySelectorAll('.md-expansion-panel__header').forEach(header => {
            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                header.setAttribute('aria-expanded', !isExpanded);
            });
        });
    }

    handleRipple(e) {
        const target = e.target.closest('.md-button, .md-expansion-panel__header');
        if (!target) return;

        const ripple = document.createElement('span');
        const rect = target.getBoundingClientRect();
        
        ripple.className = 'md-ripple';
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        
        target.appendChild(ripple);
        
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }

    // Material Alert System
    showAlert(message, type = 'info', duration = 3000) {
        const alert = document.createElement('div');
        alert.className = `md-alert ${type}`;
        alert.textContent = message;

        if (type === 'error') {
            alert.innerHTML = `
                <span class="material-icons">error</span>
                <span>${message}</span>
            `;
        } else if (type === 'success') {
            alert.innerHTML = `
                <span class="material-icons">check_circle</span>
                <span>${message}</span>
            `;
        }

        document.body.appendChild(alert);
        
        // Animate in
        alert.style.opacity = '0';
        alert.style.transform = 'translate(-50%, 20px)';
        setTimeout(() => {
            alert.style.transition = 'all 0.3s ease-out';
            alert.style.opacity = '1';
            alert.style.transform = 'translate(-50%, 0)';
        }, 10);

        // Animate out and remove
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transform = 'translate(-50%, -20px)';
            setTimeout(() => alert.remove(), 300);
        }, duration);
    }

    // File Upload Enhancement
    setupFileUpload(element) {
        if (!element) return;

        element.addEventListener('dragenter', (e) => {
            e.preventDefault();
            element.classList.add('drag-over');
        });

        element.addEventListener('dragleave', (e) => {
            e.preventDefault();
            element.classList.remove('drag-over');
        });

        element.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();
            element.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length) {
                const input = element.querySelector('input[type="file"]');
                if (input) {
                    input.files = files;
                    // Trigger change event
                    const event = new Event('change', { bubbles: true });
                    input.dispatchEvent(event);
                }
            }
        });
    }

    setupFormElements() {
        this.setupTextFields();
        this.setupFileDropZone();
        this.setupExpansionPanels();
    }

    setupTextFields() {
        document.querySelectorAll('.md-text-field__input').forEach(input => {
            input.addEventListener('focus', () => {
                input.closest('.md-text-field').classList.add('md-text-field--focused');
            });

            input.addEventListener('blur', () => {
                input.closest('.md-text-field').classList.remove('md-text-field--focused');
            });

            input.addEventListener('input', () => {
                const label = input.closest('.md-text-field').querySelector('.md-text-field__label');
                if (label) {
                    if (input.value) {
                        label.classList.add('md-text-field__label--float-above');
                    } else {
                        label.classList.remove('md-text-field__label--float-above');
                    }
                }
            });
        });
    }

    setupFileDropZone() {
        document.querySelectorAll('.md-file-drop-zone').forEach(dropZone => {
            const fileInput = dropZone.querySelector('input[type="file"]');
            const fileList = document.querySelector('.md-file-list');
            
            if (fileInput && fileList) {
                // Prevent default drag behaviors
                ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                    dropZone.addEventListener(eventName, this.preventDefaults, false);
                    document.body.addEventListener(eventName, this.preventDefaults, false);
                });

                // Handle drag states
                ['dragenter', 'dragover'].forEach(eventName => {
                    dropZone.addEventListener(eventName, () => {
                        dropZone.classList.add('md-file-drop-zone--active');
                    });
                });

                ['dragleave', 'drop'].forEach(eventName => {
                    dropZone.addEventListener(eventName, () => {
                        dropZone.classList.remove('md-file-drop-zone--active');
                    });
                });

                // Handle dropped files
                dropZone.addEventListener('drop', e => {
                    const files = e.dataTransfer.files;
                    this.handleFiles(files, dropZone, fileList);
                });

                // Handle selected files
                fileInput.addEventListener('change', () => {
                    this.handleFiles(fileInput.files, dropZone, fileList);
                });
            }
        });
    }

    handleFiles(files, dropZone, fileList) {
        if (files.length) {
            dropZone.style.display = 'none';
            const fileNameElement = fileList.querySelector('.md-file-name');
            if (fileNameElement) {
                fileNameElement.textContent = files[0].name;
            }
            fileList.style.display = 'block';

            // Dispatch change event for compatibility
            const event = new Event('file-input-change', {
                bubbles: true,
                detail: { allFiles: files }
            });
            dropZone.dispatchEvent(event);
        }
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    setupExpansionPanels() {
        document.querySelectorAll('.md-expansion-panel__header').forEach(header => {
            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                header.setAttribute('aria-expanded', !isExpanded);
            });
        });
    }

    handleRipple(e) {
        const target = e.target.closest('.md-button, .md-expansion-panel__header');
        if (!target) return;

        const ripple = document.createElement('span');
        const rect = target.getBoundingClientRect();
        
        ripple.className = 'md-ripple';
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        
        target.appendChild(ripple);
        
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }
}

// Initialize theme on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    window.materialTheme = new MaterialTheme();
    window.materialTheme.setupFormElements();
});

// Initialize theme
const materialTheme = new MaterialTheme();

// Export for use in other scripts
window.materialTheme = materialTheme;
