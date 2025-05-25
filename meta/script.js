window.addEventListener('load', () => {
    const splashShown = localStorage.getItem('splashShown');

    if (!splashShown) {
        // Show splash screen
        document.getElementById('splash-screen').style.display = 'flex';
        document.querySelector('.home-page').style.display = 'none';

        setTimeout(() => {
            document.getElementById('splash-screen').style.display = 'none';
            document.querySelector('.home-page').style.display = 'flex';

            // Mark splash as shown
            localStorage.setItem('splashShown', 'true');
        }, 3500);
    } else {
        // Skip splash
        document.getElementById('splash-screen').style.display = 'none';
        document.querySelector('.home-page').style.display = 'flex';
    }
});
