document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.slider-wrapper');

  sliders.forEach(wrapper => {
    const slider = wrapper.querySelector('.slider');
    const slides = Array.from(slider.querySelectorAll('img'));
    const prevBtn = wrapper.querySelector('.slider-btn.prev');
    const nextBtn = wrapper.querySelector('.slider-btn.next');
    const dots = wrapper.querySelectorAll('.slider-nav a');

    if (!slider || slides.length === 0) return; // пропускаем, если слайдера нет

    let currentIndex = 0;
    const autoPlayInterval = 3000;
    let autoPlayTimer;

    function updateSlider() {
      const slideWidth = slides[0].offsetWidth;
      slider.scrollTo({
        left: currentIndex * slideWidth,
        behavior: 'smooth'
      });

      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlider();
    }

    function startAutoPlay() {
      autoPlayTimer = setInterval(nextSlide, autoPlayInterval);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    }

    // Кнопки
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
      });
    }

    // Точки
    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        stopAutoPlay();
        currentIndex = index;
        updateSlider();
        startAutoPlay();
      });
    });

    // Пауза при наведении
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    startAutoPlay();
  });
});
