// Split PDFs page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileList = document.getElementById('fileList');
    const fileInput = document.querySelector('input[type="file"]');
    const removeFileBtn = document.getElementById('removeFile');
    
    // Drag and drop functionality
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

    // Page number input validation
    const pageNumbersInput = document.getElementById('pageNumbers');
    pageNumbersInput.addEventListener('input', (e) => {
        // Remove any characters that aren't numbers, commas, or hyphens
        let value = e.target.value.replace(/[^0-9,-]/g, '');
        
        // Format consecutive commas
        value = value.replace(/,+/g, ',');
        
        // Format consecutive hyphens
        value = value.replace(/-+/g, '-');
        
        // Remove comma or hyphen from start
        value = value.replace(/^[,-]+/, '');
        
        // Remove comma or hyphen from end
        value = value.replace(/[,-]+$/, '');
        
        e.target.value = value;
    });

    // Form submission
    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const oldText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="material-symbols-rounded md-spin">sync</span> Processing...';
        
        // Submit the form
        form.submit();
        
        // Reset button after 2 seconds if form hasn't redirected
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = oldText;
        }, 2000);
    });
});
