const slider = document.querySelector('.slider');
const btnPrev = document.querySelector('.prev');
const btnNext = document.querySelector('.next');

btnPrev.addEventListener('click', () => {
  slider.scrollBy({ left: -320, behavior: 'smooth' });
});

btnNext.addEventListener('click', () => {
  slider.scrollBy({ left: 320, behavior: 'smooth' });
});
