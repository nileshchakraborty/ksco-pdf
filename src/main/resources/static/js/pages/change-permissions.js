// Change Permissions page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const submitBtn = document.getElementById('submitBtn');
    const dropZone = document.getElementById('dropZone');
    const fileList = document.getElementById('fileList');
    const fileInput = document.querySelector('input[type="file"]');
    const removeFileBtn = document.getElementById('removeFile');
    const checkboxes = document.querySelectorAll('.md-checkbox__input');
    
    // File Upload Handling
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('md-file-drop-zone--active');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('md-file-drop-zone--active');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('md-file-drop-zone--active');
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            showFileDetails(e.dataTransfer.files[0]);
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            showFileDetails(e.target.files[0]);
        }
    });
    
    removeFileBtn.addEventListener('click', () => {
        fileInput.value = '';
        fileList.style.display = 'none';
        dropZone.style.display = 'block';
    });
    
    function showFileDetails(file) {
        dropZone.style.display = 'none';
        fileList.querySelector('.md-file-name').textContent = file.name;
        fileList.style.display = 'block';
    }

    // Checkbox interactions
    checkboxes.forEach(checkbox => {
        const container = checkbox.closest('.md-checkbox');
        
        // Add ripple effect to checkboxes
        container.addEventListener('click', (e) => {
            if (e.target === checkbox) return;
            
            const ripple = document.createElement('span');
            const rect = container.getBoundingClientRect();
            
            ripple.className = 'md-ripple';
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            
            container.appendChild(ripple);
            
            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });

        // Handle keyboard interaction
        container.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                checkbox.checked = !checkbox.checked;
            }
        });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Check if at least one permission is selected
        const hasPermissions = Array.from(checkboxes).some(cb => cb.checked);
        
        if (!hasPermissions) {
            materialTheme.showAlert('Please select at least one permission to change', 'warning');
            return;
        }

        const oldText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="material-symbols-rounded md-spin">sync</span> Processing...';
        
        // Submit the form
        form.submit();
        
        // Reset button after timeout
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = oldText;
        }, 2000);
    });
});
