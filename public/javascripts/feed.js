const images = document.querySelectorAll('ul > li');

images.forEach((image) => {
    image.addEventListener('click', () => {
        const src = image.querySelector('img').src;
        window.open(src, 'scrollbars=no,menubar=no,resizable=yes,toolbar=no,status=no');
    });
});