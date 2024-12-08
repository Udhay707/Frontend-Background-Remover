// Get references to elements
const uploadArea = document.getElementById('upload-area');
const uploadBtn = document.getElementById('upload-btn');
const imageInput = document.getElementById('image-input');
const statusMessage = document.getElementById('status');
const imageArea = document.getElementById('image-area');
const outputImage = document.getElementById('output-image');
const uploadContainer = document.getElementById('upload-container');

// Handle file input change (upload via button)
uploadBtn.addEventListener('click', () => {
  imageInput.click();
});

imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    handleFileUpload(file);
  }
});

// Drag and drop functionality
uploadArea.addEventListener('dragover', (event) => {
  event.preventDefault();
  uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (event) => {
  event.preventDefault();
  uploadArea.classList.remove('dragover');
  const file = event.dataTransfer.files[0];
  if (file) {
    handleFileUpload(file);
  }
});

// Handle file upload logic
function handleFileUpload(file) {
  statusMessage.textContent = 'Uploading...';
  
  // Create FormData to send to the backend API
  const formData = new FormData();
  formData.append('image', file);

  fetch('http://localhost:5000/remove-bg', {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    // Handle the response after background removal (you'll fill in later)
    if (data.image) {
      statusMessage.textContent = 'Background removed successfully!';
      const imageUrl = `data:image/png;base64,${data.image}`;
      outputImage.src = imageUrl;
      imageArea.hidden=false
      uploadContainer.hidden = true
      document.getElementById('download-100x100').onclick = () => downloadImage(imageUrl, 100, 100);
      document.getElementById('download-200x200').onclick = () => downloadImage(imageUrl, 200, 200);
      document.getElementById('download-original').onclick = () => downloadImage(imageUrl, null, null);
      document.getElementById('upload-another').onclick = () => {
        location.reload()
      };
      // Show processed image or something else here
    } else {
      statusMessage.textContent = 'Failed to remove background.';
    }
  })
  .catch(error => {
    statusMessage.textContent = 'Error uploading image.';
    console.error(error);
  });
}

function downloadImage(base64Image, width, height) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  img.onload = () => {
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
    } else {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    }

    const link = document.createElement('a');
    link.download = `image-${width || 'original'}x${height || 'original'}.png`;
    link.href = canvas.toDataURL();
    link.click();
  }
  img.src = base64Image;
}
