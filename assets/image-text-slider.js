// image-text-slider.js
class ImageTextSlider extends HTMLElement {
  constructor() {
    super();
  }
}

class ImageTextSliderComponent {
  constructor(config) {
    this.sectionId = config.sectionId;
    this.slider = document.getElementById(`slider-${this.sectionId}`);
    this.indicatorsContainer = document.getElementById(`indicators-${this.sectionId}`);
    this.prevButton = document.querySelector(`#slider-${this.sectionId}`)?.closest('.image-text-slider__slider-container')?.querySelector('.image-text-slider__nav-button--prev');
    this.nextButton = document.querySelector(`#slider-${this.sectionId}`)?.closest('.image-text-slider__slider-container')?.querySelector('.image-text-slider__nav-button--next');
    this.indicators = this.indicatorsContainer?.querySelectorAll('.image-text-slider__indicator');
    
    this.currentSlide = 0;
    this.slidesPerView = this.getSlidesPerView();
    this.totalSlides = this.slider?.children.length || 0;
    this.autoRotate = config.autoRotate || false;
    this.autoRotateSpeed = config.autoRotateSpeed || 5000;
    this.autoRotateInterval = null;
    
    this.init();
  }
  
  getSlidesPerView() {
    return window.innerWidth <= 989 ? 2 : 1;
  }
  
  init() {
    if (!this.slider || this.totalSlides === 0) return;
    
    this.updateSliderWidth();
    this.setupEventListeners();
    this.updateSlider();
    
    if (this.autoRotate) {
      this.startAutoRotate();
    }
    
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      const newSlidesPerView = this.getSlidesPerView();
      if (newSlidesPerView !== this.slidesPerView) {
        this.slidesPerView = newSlidesPerView;
        this.updateSliderWidth();
        this.goToSlide(0);
      }
    });
  }
  
  updateSliderWidth() {
    if (this.slidesPerView > 1) {
      this.slider.style.width = `${(this.totalSlides / this.slidesPerView) * 100}%`;
    } else {
      this.slider.style.width = `${this.totalSlides * 100}%`;
    }
  }
  
  setupEventListeners() {
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => this.prevSlide());
    }
    
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.nextSlide());
    }
    
    if (this.indicators) {
      this.indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => this.goToSlide(index));
      });
    }
    
    // 暂停自动轮播当鼠标悬停
    this.slider.addEventListener('mouseenter', () => {
      this.stopAutoRotate();
    });
    
    this.slider.addEventListener('mouseleave', () => {
      if (this.autoRotate) {
        this.startAutoRotate();
      }
    });
  }
  
  updateSlider() {
    if (!this.slider) return;
    
    const slideWidth = 100 / this.slidesPerView;
    const translateX = -(this.currentSlide * slideWidth);
    this.slider.style.transform = `translateX(${translateX}%)`;
    
    // 更新指示器
    if (this.indicators) {
      this.indicators.forEach((indicator, index) => {
        const isActive = index === this.currentSlide;
        indicator.classList.toggle('active', isActive);
        indicator.setAttribute('aria-current', isActive);
      });
    }
  }
  
  goToSlide(slideIndex) {
    if (!this.slider) return;
    
    const maxSlide = Math.ceil(this.totalSlides / this.slidesPerView) - 1;
    
    if (slideIndex < 0) {
      this.currentSlide = maxSlide;
    } else if (slideIndex > maxSlide) {
      this.currentSlide = 0;
    } else {
      this.currentSlide = slideIndex;
    }
    
    this.updateSlider();
  }
  
  nextSlide() {
    this.goToSlide(this.currentSlide + 1);
  }
  
  prevSlide() {
    this.goToSlide(this.currentSlide - 1);
  }
  
  startAutoRotate() {
    this.stopAutoRotate();
    this.autoRotateInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoRotateSpeed);
  }
  
  stopAutoRotate() {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
      this.autoRotateInterval = null;
    }
  }
}

if (!customElements.get('image-text-slider')) {
  customElements.define('image-text-slider', ImageTextSlider);
}

// 导出类以供外部使用
window.ImageTextSlider = ImageTextSliderComponent;