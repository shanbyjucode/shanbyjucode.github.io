window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        document.querySelector('.app').style.display = 'flex';
    }, 3500);
});

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then(function(reg) {
        console.log('Service Worker registered!', reg);
    });
}
