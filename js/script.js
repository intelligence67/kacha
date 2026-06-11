document.addEventListener('DOMContentLoaded', () => {
  // Menu
  const header = document.querySelector('.header');
  const burger = document.querySelector('.header__burger');
  const menu = document.querySelector('.mobile-menu');
  const menuLinks = document.querySelectorAll('.mobile-menu a');

  if (header && burger && menu) {
    function closeMenu() {
      header.classList.remove('is-menu-open');
      menu.classList.remove('is-active');
      document.body.classList.remove('menu-open');
      burger.setAttribute('aria-label', 'Відкрити меню');
    }

    function openMenu() {
      header.classList.add('is-menu-open');
      menu.classList.add('is-active');
      document.body.classList.add('menu-open');
      burger.setAttribute('aria-label', 'Закрити меню');
    }

    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.contains('is-active') ? closeMenu() : openMenu();
    });

    menu.addEventListener('click', e => e.stopPropagation());

    document.addEventListener('click', () => {
      if (menu.classList.contains('is-active')) closeMenu();
    });

    menuLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // Scroll
  const anchorLinks = document.querySelectorAll(
    '.header__nav a[href^="#"], .mobile-menu__nav a[href^="#"], .footer__list a[href^="#"]'
  );

  anchorLinks.forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const offset = window.innerWidth <= 768 ? 80 : 100;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  // Calc
  const form = document.querySelector('.loan-selection__form');

  if (form) {
    const tabs = form.querySelectorAll('.loan-selection__tab');
    const typeInput = form.querySelector('[name="credit_type"]');
    const formTitle = form.querySelector('.loan-selection__form-title');
    const bonus = form.querySelector('.loan-selection__bonus');

    const progressValue = form.querySelector('.loan-selection__progress-value');
    const progressLine = form.querySelector('.loan-selection__progress-line span');

    const amountInput = form.querySelector('[name="amount"]');
    const fullNameInput = form.querySelector('[name="full_name"]');
    const phoneInput = form.querySelector('[name="phone"]');
    const emailInput = form.querySelector('[name="email"]');
    const birthDateInput = form.querySelector('[name="birth_date"]');
    const creditGoalInput = form.querySelector('[name="credit_goal"]');
    const genderInput = form.querySelector('[name="gender"]');
    const socialStatusInput = form.querySelector('[name="social_status"]');
    const creditHistoryInputs = form.querySelectorAll('[name="credit_history"]');

    let creditHistoryTouched = false;

    const progressFields = [
      { field: amountInput, weight: 10 },
      { field: fullNameInput, weight: 20 },
      { field: phoneInput, weight: 15 },
      { field: emailInput, weight: 15 },
      { field: birthDateInput, weight: 15 },
      { field: creditGoalInput, weight: 5 },
      { field: genderInput, weight: 5 },
      { field: socialStatusInput, weight: 5 },
      { name: 'credit_history', weight: 10 }
    ];

    if (birthDateInput) {
      birthDateInput.max = new Date().toISOString().split('T')[0];
    }

    function isFieldFilled(field) {
      return field && field.value.trim() !== '';
    }

    function updateProgress() {
      let percent = 0;

      progressFields.forEach(item => {
        if (item.name === 'credit_history') {
          const checked = form.querySelector('[name="credit_history"]:checked');

          if (checked && creditHistoryTouched) {
            percent += item.weight;
          }

          return;
        }

        if (isFieldFilled(item.field)) {
          percent += item.weight;
        }
      });

      percent = Math.min(percent, 100);

      if (progressValue) progressValue.textContent = `${percent}%`;
      if (progressLine) progressLine.style.width = `${percent}%`;
    }

    function clearError(input) {
      if (input) input.classList.remove('is-error');
    }

    function setError(input) {
      if (input) input.classList.add('is-error');
    }

    function toggleBonus() {
      if (!bonus || !fullNameInput) return;

      bonus.classList.toggle('is-hidden', fullNameInput.value.trim() !== '');
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const type = tab.dataset.type;

        tabs.forEach(item => {
          item.classList.toggle('is-active', item.dataset.type === type);
        });

        if (typeInput) typeInput.value = type;
        if (formTitle) formTitle.textContent = `${type} кредит`;
      });
    });

    if (amountInput) {
      amountInput.addEventListener('input', () => {
        amountInput.value = amountInput.value
          .replace(/\D/g, '')
          .replace(/^0+/, '')
          .slice(0, 5);

        updateProgress();
      });
    }

    if (fullNameInput) {
      fullNameInput.addEventListener('input', () => {
        fullNameInput.value = fullNameInput.value.replace(/[^А-Яа-яІіЇїЄєҐґʼ'\-\s]/g, '');

        toggleBonus();
        clearError(fullNameInput);
        updateProgress();
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        phoneInput.value = phoneInput.value.replace(/[^\d+]/g, '');

        clearError(phoneInput);
        updateProgress();
      });
    }

    if (emailInput) {
      emailInput.addEventListener('input', () => {
        clearError(emailInput);
        updateProgress();
      });
    }

    if (birthDateInput) {
      birthDateInput.addEventListener('change', () => {
        clearError(birthDateInput);
        updateProgress();
      });
    }

    creditHistoryInputs.forEach(input => {
      input.addEventListener('change', () => {
        creditHistoryTouched = true;
        updateProgress();
      });
    });

    form.addEventListener('input', updateProgress);
    form.addEventListener('change', updateProgress);

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      const phoneRegex = /^(\+?380|0)\d{9}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

      const emailValue = emailInput ? emailInput.value.trim().toLowerCase() : '';

      if (!fullNameInput || !fullNameInput.value.trim()) {
        setError(fullNameInput);
        isValid = false;
      }

      if (!phoneInput || !phoneRegex.test(phoneInput.value.trim())) {
        setError(phoneInput);
        isValid = false;
      }

      if (!emailInput || !emailRegex.test(emailValue) || emailValue.endsWith('@mail.ru')) {
        setError(emailInput);
        isValid = false;
      }

      if (!birthDateInput || !birthDateInput.value) {
        setError(birthDateInput);
        isValid = false;
      }

      if (!isValid) return;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      console.log(data);
    });

    toggleBonus();
    updateProgress();
  }

  // Reviews
  const reviewsSlider = document.querySelector('.reviews__slider');

  if (reviewsSlider && typeof Swiper !== 'undefined') {
    new Swiper(reviewsSlider, {
      slidesPerView: 'auto',
      spaceBetween: 20,
      grabCursor: true,
      watchOverflow: true,

      navigation: {
        nextEl: '.reviews__next',
        prevEl: '.reviews__prev',
      },
    });
  }

  // Rating
  const sortBtn = document.querySelector('.rating__sort');
  const ratingList = document.querySelector('.rating__list');

  if (sortBtn && ratingList) {
    let isAsc = false;

    sortBtn.addEventListener('click', () => {
      const items = Array.from(ratingList.querySelectorAll('.rating__item'));

      isAsc = !isAsc;

      items.sort((a, b) => {
        const ratingA = parseFloat(a.dataset.rating) || 0;
        const ratingB = parseFloat(b.dataset.rating) || 0;

        return isAsc ? ratingA - ratingB : ratingB - ratingA;
      });

      items.forEach(item => ratingList.append(item));

      sortBtn.classList.toggle('is-asc', isAsc);
    });
  }

  // Faq
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const button = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    if (!button || !answer) return;

    const setAnswerHeight = () => {
      item.style.setProperty('--answer-height', `${answer.scrollHeight + 18}px`);
    };

    setAnswerHeight();

    button.addEventListener('click', () => {
      item.classList.toggle('is-active');
      setAnswerHeight();
    });
  });

  // Footer
  const scrollTopBtn = document.querySelector('.footer__up');

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});