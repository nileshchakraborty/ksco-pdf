// Track current sort state and add drag-and-drop interaction state
let currentSort = {
  field: null,
  descending: false,
};

// Handler for drag and drop functionality
const dropContainer = document.getElementById('dropContainer');
const fileInput = document.getElementById("fileInput-input");
let fileList = new WeakMap(); // Store file metadata

// Initialize Material ripple effect for buttons
function initMaterialRipple() {
    document.querySelectorAll('.md-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            ripple.classList.add('md-ripple');
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(button.offsetWidth, button.offsetHeight);
            const x = e.clientX - rect.left - size/2;
            const y = e.clientY - rect.top - size/2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Setup drop zone functionality
function initDropZone() {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropContainer.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropContainer.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropContainer.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropContainer.classList.add('drag-over');
    }

    function unhighlight() {
        dropContainer.classList.remove('drag-over');
    }

    dropContainer.addEventListener('drop', handleDrop, false);
}

// Handle dropped files
async function handleDrop(e) {
    const droppedFiles = e.dataTransfer.files;
    const pdfFiles = Array.from(droppedFiles).filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length) {
        // Create a new FileList-like object
        const dataTransfer = new DataTransfer();
        pdfFiles.forEach(file => dataTransfer.items.add(file));
        fileInput.files = dataTransfer.files;
        
        // Show material snackbar
        showSnackbar(`Added ${pdfFiles.length} PDF file${pdfFiles.length > 1 ? 's' : ''}`);
        await displayFiles(fileInput.files);
    } else {
        showSnackbar('Please drop PDF files only', 'error');
    }
}

// Show Material Design snackbar
function showSnackbar(message, type = 'info') {
    const snackbar = document.createElement('div');
    snackbar.className = `md-snackbar ${type}`;
    snackbar.textContent = message;
    document.body.appendChild(snackbar);
    
    // Trigger animation
    setTimeout(() => snackbar.classList.add('show'), 100);
    setTimeout(() => {
        snackbar.classList.remove('show');
        setTimeout(() => snackbar.remove(), 300);
    }, 3000);
}

// File input change handler
fileInput.addEventListener("file-input-change", async function() {
    if (this.files.length) {
        showSnackbar(`Selected ${this.files.length} file${this.files.length > 1 ? 's' : ''}`);
        await displayFiles(this.files);
    }
});

/**
 * @param {FileList} files
 */
async function displayFiles(files) {
    const list = document.getElementById("selectedFiles");
    list.innerHTML = '';
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const item = document.createElement("li");
        item.className = "list-group-item";
        item.setAttribute('draggable', 'true');
        
        // Get PDF metadata
        const pageCount = await getPDFPageCount(file);
        fileList.set(file, { pageCount });
        
        // Create file info section
        const fileInfo = createFileInfo(file, pageCount);
        
        // Create control buttons
        const controls = createControls();
        
        item.appendChild(fileInfo);
        item.appendChild(controls);
        list.appendChild(item);
        
        // Add fade-in animation with delay
        requestAnimationFrame(() => {
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
        });
    }
    
    attachListeners();
}

function createFileInfo(file, pageCount) {
    const container = document.createElement("div");
    container.className = "file-info-container";
    
    const icon = document.createElement("span");
    icon.className = "material-icons md-file-icon";
    icon.textContent = "picture_as_pdf";
    
    const nameLabel = document.createElement("span");
    nameLabel.className = "filename";
    nameLabel.textContent = file.name;
    
    const pageLabel = document.createElement("span");
    pageLabel.className = "page-count";
    pageLabel.textContent = `${pageCount} ${pageCount === 1 ? pageTranslation : pagesTranslation}`;
    
    container.append(icon, nameLabel, pageLabel);
    return container;
}

function createControls() {
    const container = document.createElement("div");
    container.className = "file-controls";
    
    const moveUp = createButton('arrow_upward', 'move-up');
    const moveDown = createButton('arrow_downward', 'move-down');
    const remove = createButton('delete', 'remove-file');
    
    container.append(moveUp, moveDown, remove);
    return container;
}

function createButton(icon, className) {
    const button = document.createElement("button");
    button.className = `md-button ${className}`;
    button.innerHTML = `<span class="material-icons">${icon}</span>`;
    return button;
}

// Update files after reordering
function updateFiles() {
    const dataTransfer = new DataTransfer();
    document.querySelectorAll("#selectedFiles li").forEach(li => {
        const fileName = li.querySelector(".filename").textContent;
        Array.from(fileInput.files).forEach(file => {
            if (file.name === fileName) {
                dataTransfer.items.add(file);
            }
        });
    });
    fileInput.files = dataTransfer.files;
}

// Attach event listeners
function attachListeners() {
    attachMoveButtons();
    attachDragAndDrop();
    initMaterialRipple();
}

// Initialize everything
window.addEventListener('DOMContentLoaded', () => {
    initDropZone();
    initMaterialRipple();
});

document.getElementById("sortByNameBtn").addEventListener("click", function () {
  if (currentSort.field === "name" && !currentSort.descending) {
    currentSort.descending = true;
    sortFiles((a, b) => b.name.localeCompare(a.name));
  } else {
    currentSort.field = "name";
    currentSort.descending = false;
    sortFiles((a, b) => a.name.localeCompare(b.name));
  }
});

document.getElementById("sortByDateBtn").addEventListener("click", function () {
  if (currentSort.field === "lastModified" && !currentSort.descending) {
    currentSort.descending = true;
    sortFiles((a, b) => b.lastModified - a.lastModified);
  } else {
    currentSort.field = "lastModified";
    currentSort.descending = false;
    sortFiles((a, b) => a.lastModified - b.lastModified);
  }
});

function sortFiles(comparator) {
  // Convert FileList to array and sort
  const sortedFilesArray = Array.from(document.getElementById("fileInput-input").files).sort(comparator);

  // Refresh displayed list
  displayFiles(sortedFilesArray);

  // Update the files property
  const dataTransfer = new DataTransfer();
  sortedFilesArray.forEach((file) => dataTransfer.items.add(file));
  document.getElementById("fileInput-input").files = dataTransfer.files;
}

function attachMoveButtons() {
  var moveUpButtons = document.querySelectorAll(".move-up");
  for (var i = 0; i < moveUpButtons.length; i++) {
    moveUpButtons[i].addEventListener("click", function (event) {
      event.preventDefault();
      var parent = this.closest(".list-group-item");
      var grandParent = parent.parentNode;
      if (parent.previousElementSibling) {
        grandParent.insertBefore(parent, parent.previousElementSibling);
        updateFiles();
      }
    });
  }

  var moveDownButtons = document.querySelectorAll(".move-down");
  for (var i = 0; i < moveDownButtons.length; i++) {
    moveDownButtons[i].addEventListener("click", function (event) {
      event.preventDefault();
      var parent = this.closest(".list-group-item");
      var grandParent = parent.parentNode;
      if (parent.nextElementSibling) {
        grandParent.insertBefore(parent.nextElementSibling, parent);
        updateFiles();
      }
    });
  }

  var removeButtons = document.querySelectorAll(".remove-file");
  for (var i = 0; i < removeButtons.length; i++) {
    removeButtons[i].addEventListener("click", function (event) {
      event.preventDefault();
      var parent = this.closest(".list-group-item");
      //Get name of removed file
      let filenameNode = parent.querySelector(".filename");
      var fileName = filenameNode.innerText;
      const fileId = filenameNode.getAttribute("data-file-id");
      parent.remove();
      updateFiles();
      //Dispatch a custom event with the name of the removed file
      var event = new CustomEvent("fileRemoved", { detail: fileId });
      document.dispatchEvent(event);
    });
  }

  // Add Material ripple effect
  initMaterialRipple();
}

// Enhanced drag and drop for file reordering
function setupDragAndDrop() {
  const items = document.querySelectorAll('.list-group-item');
  items.forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('drop', handleDrop);
    item.addEventListener('dragend', handleDragEnd);
  });
}

let draggedItem = null;

function handleDragStart(e) {
  draggedItem = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
  e.preventDefault();
  const rect = this.getBoundingClientRect();
  const midpoint = rect.top + rect.height / 2;
  
  if (e.clientY < midpoint) {
    this.classList.add('drag-above');
    this.classList.remove('drag-below');
  } else {
    this.classList.add('drag-below');
    this.classList.remove('drag-above');
  }
}

function handleDrop(e) {
  e.preventDefault();
  if (draggedItem === this) return;
  
  const rect = this.getBoundingClientRect();
  const midpoint = rect.top + rect.height / 2;
  
  if (e.clientY < midpoint) {
    this.parentNode.insertBefore(draggedItem, this);
  } else {
    this.parentNode.insertBefore(draggedItem, this.nextSibling);
  }
  
  updateFiles();
}

function handleDragEnd() {
  this.classList.remove('dragging');
  document.querySelectorAll('.list-group-item').forEach(item => {
    item.classList.remove('drag-above', 'drag-below');
  });
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    initDropZone();
    initMaterialRipple();
});
