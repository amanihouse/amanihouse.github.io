// Page portfolio : clic sur une photo = agrandissement plein ecran, fleches et clavier pour naviguer
const galleryLinks = [...document.querySelectorAll('.gallery-item')];
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
let photoIndex = 0;

function showPhoto(i) {
  photoIndex = (i + galleryLinks.length) % galleryLinks.length;
  lightboxImg.src = galleryLinks[photoIndex].href;
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

if (lightbox) {
  galleryLinks.forEach((link, i) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showPhoto(i);
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(photoIndex - 1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(photoIndex + 1));
  // clic sur le fond noir (hors photo et boutons) = fermer
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPhoto(photoIndex - 1);
    if (e.key === 'ArrowRight') showPhoto(photoIndex + 1);
  });
}
