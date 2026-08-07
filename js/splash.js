// A dedicated splash page: the main app is not loaded until this completes.
if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js');
setTimeout(() => { window.location.href = 'app.html'; }, 5000);
