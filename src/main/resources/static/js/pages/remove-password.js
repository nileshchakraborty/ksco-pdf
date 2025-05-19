// Remove Password page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const submitBtn = document.getElementById('submitBtn');
    const passwordInput = document.getElementById('password');
    const dropZone = document.getElementById('dropZone');
    const fileList = document.getElementById('fileList');
    const fileInput = document.querySelector('input[type="file"]');
    const removeFileBtn = document.getElementById('removeFile');
    
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

    // Password visibility toggle
    const container = passwordInput.closest('.md-text-field');
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'md-button md-button--icon md-password-toggle';
    toggleBtn.innerHTML = '<span class="material-symbols-rounded">visibility_off</span>';
    
    toggleBtn.addEventListener('click', () => {
        const isVisible = passwordInput.type === 'text';
        passwordInput.type = isVisible ? 'password' : 'text';
        toggleBtn.innerHTML = `<span class="material-symbols-rounded">${isVisible ? 'visibility_off' : 'visibility'}</span>`;
    });
    
    container.appendChild(toggleBtn);

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!passwordInput.value) {
            materialTheme.showAlert('Please enter the PDF password', 'error');
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
