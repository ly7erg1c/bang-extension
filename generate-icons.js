// Icon generation functionality

function drawIcon(size) {
  const canvas = document.getElementById(`canvas${size}`);
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.clearRect(0, 0, size, size);
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // Draw exclamation mark (!)
  ctx.fillStyle = 'white';
  
  // Scale font size based on canvas size
  const fontSize = size * 0.7;
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Draw the exclamation mark
  ctx.fillText('!', size / 2, size / 2);
}

function downloadIcon(size) {
  const canvas = document.getElementById(`canvas${size}`);
  const link = document.createElement('a');
  link.download = `icon-${size}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function downloadAll() {
  downloadIcon(48);
  setTimeout(() => downloadIcon(96), 200);
  setTimeout(() => downloadIcon(128), 400);
}

// Draw all icons on page load
window.addEventListener('DOMContentLoaded', () => {
  drawIcon(48);
  drawIcon(96);
  drawIcon(128);
  
  // Add event listeners to buttons
  document.getElementById('btn48').addEventListener('click', () => downloadIcon(48));
  document.getElementById('btn96').addEventListener('click', () => downloadIcon(96));
  document.getElementById('btn128').addEventListener('click', () => downloadIcon(128));
  document.getElementById('btnAll').addEventListener('click', downloadAll);
});
