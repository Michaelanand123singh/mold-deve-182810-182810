document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('nav a'); // Get all navigation links inside the menu
  const firstNavLink = navLinks[0]; // Get the first navigation link
  const lastNavLink = navLinks[navLinks.length - 1]; // Get the last navigation link

  if (menuToggle && nav) {
    let isMenuOpen = false;

    const toggleMenu = () => {
      isMenuOpen = !isMenuOpen;
      nav.classList.toggle('open');
      menuToggle.classList.toggle('open');
      document.body.classList.toggle('menu-open');  // Prevent background scrolling
      menuToggle.setAttribute('aria-expanded', isMenuOpen);

      if (isMenuOpen) {
        // Focus the first link when opening
        if (firstNavLink) {
          firstNavLink.focus();
        }
      }

    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        toggleMenu();
        menuToggle.focus(); // Return focus to the menu toggle button
      }
    });

    // Trap focus within the menu when it's open
    nav.addEventListener('keydown', (e) => {
      if (!isMenuOpen) return;

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstNavLink) {
            e.preventDefault();
            lastNavLink.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastNavLink) {
            e.preventDefault();
            firstNavLink.focus();
          }
        }
      }
    });
  }


  // Smooth Scroll & Back to Top
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });

        // Update URL hash (optional)
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          location.hash = targetId;
        }
      }
    });
  });

  const backToTopButton = document.querySelector('.back-to-top');

  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
    });

    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Testimonial Slider
  const slider = document.querySelector('.testimonial-slider');
  const slides = slider ? Array.from(slider.children) : [];
  const prevButton = document.querySelector('.testimonial-prev');
  const nextButton = document.querySelector('.testimonial-next');

  if (slider && slides.length > 0 && prevButton && nextButton) {
    let currentIndex = 0;
    const slideCount = slides.length;
    let autoSlideInterval;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slideCount;
      showSlide(currentIndex);
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + slideCount) % slideCount;
      showSlide(currentIndex);
    };

    const startAutoSlide = () => {
      autoSlideInterval = setInterval(nextSlide, 5000); // Adjust timing as needed
    };

    const stopAutoSlide = () => {
      clearInterval(autoSlideInterval);
    };

    prevButton.addEventListener('click', () => {
      stopAutoSlide();
      prevSlide();
      startAutoSlide();
    });

    nextButton.addEventListener('click', () => {
      stopAutoSlide();
      nextSlide();
      startAutoSlide();
    });

    showSlide(currentIndex); // Initial slide
    startAutoSlide();

    // Pause on hover
    slider.addEventListener('mouseover', stopAutoSlide);
    slider.addEventListener('mouseout', startAutoSlide);
  }


  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-content').setAttribute('aria-hidden', 'true');
        }
      });

      item.classList.toggle('open');
      content.setAttribute('aria-hidden', !isOpen);
    });
  });

  // Email Capture Form Validation
  const emailForm = document.querySelector('#email-capture-form');

  if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.querySelector('#email');
      const email = emailInput.value;

      if (!email) {
        alert('Please enter your email address.');
        return;
      }

      if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      // Simulate submission
      console.log('Email submitted:', email);
      emailInput.value = ''; // Clear the form

      // Optional: display a success message
      alert('Thank you for subscribing!');
    });
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // UTM-aware CTA click logging (stub)
  const ctaButtons = document.querySelectorAll('.cta-button');

  ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const utmParams = getUtmParams();
      console.log('CTA Clicked', {
        buttonText: button.textContent,
        utm: utmParams
      });
      // Add logic to send to analytics or backend here.
    });
  });

  function getUtmParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmTerm = urlParams.get('utm_term');
    const utmContent = urlParams.get('utm_content');

    return {
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_term: utmTerm,
      utm_content: utmContent
    };
  }
});