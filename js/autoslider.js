document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.slider-wrapper');

  sliders.forEach(wrapper => {
    const slider = wrapper.querySelector('.slider');
    const slides = Array.from(slider.querySelectorAll('img'));
    const prevBtn = wrapper.querySelector('.slider-btn.prev');
    const nextBtn = wrapper.querySelector('.slider-btn.next');
    const dots = wrapper.querySelectorAll('.slider-nav a');

    if (!slider || slides.length === 0) return;

    let currentIndex = 0;
    const autoPlayInterval = 3000;
    let autoPlayTimer;

    // Переменные для обработки перетаскивания (Drag / Swipe)
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let startTime = 0;

    function updateSlider(smooth = true) {
      const slideWidth = slides[0].offsetWidth;
      slider.scrollTo({
        left: currentIndex * slideWidth,
        behavior: smooth ? 'smooth' : 'auto'
      });

      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider(true);
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlider(true);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(nextSlide, autoPlayInterval);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    }

    // --- Обработка перетаскивания (Mouse & Touch) ---
    function getPositionX(e) {
      return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    const touchStartHandler = (e) => {
      isDown = true;
      slider.classList.add('grabbing');
      startX = getPositionX(e);
      scrollLeft = slider.scrollLeft;
      startTime = new Date().getTime();
      stopAutoPlay();
    };

    const touchMoveHandler = (e) => {
      if (!isDown) return;
      const x = getPositionX(e);
      const walk = (x - startX); // Смещение курсора/пальца
      slider.scrollLeft = scrollLeft - walk;
    };

    const touchEndHandler = (e) => {
      if (!isDown) return;
      isDown = false;
      slider.classList.remove('grabbing');

      const slideWidth = slides[0].offsetWidth;
      const x = e.type.includes('mouse') ? e.pageX : (e.changedTouches ? e.changedTouches[0].clientX : startX);
      const walk = x - startX;
      const timeDiff = new Date().getTime() - startTime;

      // Если свайп был быстрым или смещение больше трети ширины слайда — меняем слайд
      if (Math.abs(walk) > slideWidth / 3 || (Math.abs(walk) > 30 && timeDiff < 250)) {
        if (walk < 0) {
          currentIndex = Math.min(currentIndex + 1, slides.length - 1);
        } else {
          currentIndex = Math.max(currentIndex - 1, 0);
        }
      } else {
        // Иначе возвращаем на текущий слайд
        currentIndex = Math.round(slider.scrollLeft / slideWidth);
      }

      updateSlider(true);
      startAutoPlay();
    };

    // События мыши
    slider.addEventListener('mousedown', touchStartHandler);
    slider.addEventListener('mousemove', touchMoveHandler);
    slider.addEventListener('mouseup', touchEndHandler);
    slider.addEventListener('mouseleave', () => {
      if (isDown) {
        isDown = false;
        slider.classList.remove('grabbing');
        updateSlider(true);
        startAutoPlay();
      }
    });

    // События сенсорных экранов (телефон/планшет)
    slider.addEventListener('touchstart', touchStartHandler, { passive: true });
    slider.addEventListener('touchmove', touchMoveHandler, { passive: true });
    slider.addEventListener('touchend', touchEndHandler);

    // Предотвращаем дефолтное перетаскивание картинок браузером
    slides.forEach(img => {
      img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    // --- Кнопки управления ---
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

    // --- Точки (навигация) ---
    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        stopAutoPlay();
        currentIndex = index;
        updateSlider(true);
        startAutoPlay();
      });
    });

    // Пауза при наведении мыши (только для ПК)
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    // Инициализация
    updateSlider(false);
    startAutoPlay();
  });
});