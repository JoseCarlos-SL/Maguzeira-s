/* ============================================================
   MAGUZEIRA'S STORE — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. HAMBURGER MENU
  ---------------------------------------------------------- */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const overlay     = document.getElementById('overlay');
  const closeBtn    = document.getElementById('closeMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    mobileMenu.classList.add('open');
    overlay.classList.add('visible');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    overlay.classList.remove('visible');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));


  /* ----------------------------------------------------------
     2. CARD TAGS — build pills from data-tags attribute
  ---------------------------------------------------------- */
  document.querySelectorAll('.product-card').forEach(card => {
    const rawTags = card.getAttribute('data-tags');
    const tagsEl  = card.querySelector('.card-tags');

    if (!rawTags || !tagsEl) return;

    const tags = rawTags.split(',').map(t => t.trim());
    tags.forEach(tag => {
      const pill = document.createElement('span');
      pill.className = 'tag-pill';
      pill.textContent = tag;
      tagsEl.appendChild(pill);
    });
  });


  /* ----------------------------------------------------------
     3. HEADER SCROLL OPACITY
  ---------------------------------------------------------- */
  const header = document.getElementById('header');

  function onScroll() {
    if (window.scrollY > 20) {
      header.style.background = 'rgba(5, 5, 5, 0.9)';
    } else {
      header.style.background = 'rgba(5, 5, 5, 0.75)';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });


  /* ----------------------------------------------------------
     4. SMOOTH SCROLL + ACTIVE NAV HIGHLIGHTING
  ---------------------------------------------------------- */
  const sections    = document.querySelectorAll('section[id]');
  const navLinks    = document.querySelectorAll('.nav-desktop a');

  const observerOpts = {
    root: null,
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.opacity = link.getAttribute('href') === `#${id}` ? '1' : '0.85';
          link.style.color   = link.getAttribute('href') === `#${id}` ? 'var(--blue)' : '';
        });
      }
    });
  }, observerOpts);

  sections.forEach(s => sectionObserver.observe(s));


  /* ----------------------------------------------------------
     5. SCROLL-REVEAL ANIMATION
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll(
    '.product-card, .section-header, .contact-card, .hero-content, .hero-image, .store-controls, .faq-accordion-container'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;
    revealObserver.observe(el);
  });

  const style = document.createElement('style');
  style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);


  /* ----------------------------------------------------------
     6. HERO IMAGE — fallback visibility
  ---------------------------------------------------------- */
  const heroImg      = document.querySelector('.hero-image img');
  const phoneFallback = document.querySelector('.hero-phone-fallback');

  if (heroImg) {
    heroImg.addEventListener('load', () => {
      if (phoneFallback) phoneFallback.style.display = 'none';
    });
    heroImg.addEventListener('error', () => {
      heroImg.style.display = 'none';
      if (phoneFallback) phoneFallback.style.display = 'flex';
    });
  }


  /* ----------------------------------------------------------
     7. BACK TO TOP — smooth
  ---------------------------------------------------------- */
  const backTop = document.querySelector('.back-top');
  if (backTop) {
    backTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ============================================================
     NEW FEATURE: 1. COLOR DOT PICKER
     ============================================================ */
  const colorDots = document.querySelectorAll('.color-dot');
  
  colorDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation(); // Evita abrir o Quick View Modal
      const targetColor = dot.getAttribute('data-color');
      const targetImgUrl = dot.getAttribute('data-img');
      const card = dot.closest('.product-card');
      
      // Atualizar classe ativa nas bolinhas
      const siblingDots = card.querySelectorAll('.color-dot');
      siblingDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      
      // Atualizar imagem do card
      const cardImg = card.querySelector('.card-image img');
      if (cardImg && targetImgUrl) {
        cardImg.src = targetImgUrl;
      }
      
      // Atualizar nome da cor ativa
      const colorText = card.querySelector('.active-color-name');
      if (colorText) {
        colorText.textContent = targetColor;
      }
    });
  });


  /* ============================================================
     NEW FEATURE: 2. PRODUCT FILTER & SEARCH
     ============================================================ */
  const searchInput = document.getElementById('productSearch');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card');
  const categorySections = document.querySelectorAll('section[data-section-category]');

  let activeCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardTitle = card.querySelector('h3').textContent.toLowerCase();
      const cardTags = (card.getAttribute('data-tags') || '').toLowerCase();
      
      const categoryMatch = activeCategory === 'all' || cardCategory === activeCategory;
      const searchMatch = cardTitle.includes(searchQuery) || cardTags.includes(searchQuery);

      if (categoryMatch && searchMatch) {
        card.style.display = '';
        // Pequena reanimação
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      } else {
        card.style.display = 'none';
      }
    });

    // Ocultar seções vazias para estética premium
    categorySections.forEach(section => {
      const visibleCards = section.querySelectorAll('.product-card:not([style*="display: none"])');
      if (visibleCards.length === 0) {
        section.style.display = 'none';
      } else {
        section.style.display = '';
      }
    });
  }

  // Listener para busca textual
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }

  // Listener para abas de categoria
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.getAttribute('data-category');
      applyFilters();
    });
  });


  /* ============================================================
     NEW FEATURE: 3. SHOPPING CART (BUDGET BUILDER)
     ============================================================ */
  let cart = JSON.parse(localStorage.getItem('maguzeira_cart')) || [];

  const cartToggle = document.getElementById('cartToggle');
  const closeCart = document.getElementById('closeCart');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartEmptyMessage = document.getElementById('cartEmptyMessage');
  const cartDrawerFooter = document.getElementById('cartDrawerFooter');
  const cartTotalVal = document.getElementById('cartTotalVal');
  const cartBadge = document.getElementById('cartBadge');
  const btnCheckoutWA = document.getElementById('btnCheckoutWA');

  // Toggle do Carrinho
  if (cartToggle) cartToggle.addEventListener('click', () => cartDrawer.classList.add('open'));
  if (closeCart) closeCart.addEventListener('click', () => cartDrawer.classList.remove('open'));

  // Adicionar ao carrinho
  const addCartButtons = document.querySelectorAll('.btn-add-cart');
  addCartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Evita abrir o Quick View
      const card = btn.closest('.product-card');
      addToCartFromCard(card);
    });
  });

  function addToCartFromCard(card) {
    const name = card.querySelector('h3').textContent;
    const priceText = card.querySelector('.card-price');
    const price = priceText ? parseFloat(priceText.getAttribute('data-price')) : 0;
    
    // Obter cor ativa se houver
    const colorEl = card.querySelector('.active-color-name');
    const color = colorEl ? colorEl.textContent : '';
    
    // Imagem do produto ou ilustração HTML
    let img = '';
    const imgEl = card.querySelector('.card-image img');
    if (imgEl && imgEl.style.display !== 'none') {
      img = imgEl.src;
    } else {
      // Se for ilustração, pegamos o HTML interno da representação
      const visualEl = card.querySelector('.card-image').firstElementChild;
      if (visualEl) img = visualEl.outerHTML;
    }

    addToCart(name, price, color, img);
  }

  function addToCart(name, price, color, img) {
    // ID único baseado no nome + cor
    const id = `${name}_${color}`.replace(/\s+/g, '_');
    
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id, name, price, color, img, quantity: 1 });
    }
    
    saveCart();
    renderCart();
    
    // Abrir o carrinho automaticamente com micro-delay para feedback tátil
    setTimeout(() => {
      cartDrawer.classList.add('open');
    }, 150);
  }

  function saveCart() {
    localStorage.setItem('maguzeira_cart', JSON.stringify(cart));
  }

  function renderCart() {
    if (!cartItemsList) return;
    
    cartItemsList.innerHTML = '';
    
    if (cart.length === 0) {
      cartEmptyMessage.style.display = 'flex';
      cartDrawerFooter.style.display = 'none';
      if (cartBadge) cartBadge.textContent = '0';
      return;
    }

    cartEmptyMessage.style.display = 'none';
    cartDrawerFooter.style.display = 'block';
    
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      
      // Tratamento de imagem vs ilustração HTML
      let mediaHTML = '';
      if (item.img.startsWith('http') || item.img.startsWith('data')) {
        mediaHTML = `<img src="${item.img}" alt="${item.name}" />`;
      } else {
        mediaHTML = `<div style="transform: scale(0.4); transform-origin: center; display: flex; align-items: center; justify-content: center; width: 150px; height: 150px;">${item.img}</div>`;
      }

      itemEl.innerHTML = `
        <div class="cart-item-img">${mediaHTML}</div>
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          ${item.color ? `<span class="cart-item-color">${item.color}</span>` : ''}
          <span class="cart-item-price">R$ ${item.price.toLocaleString('pt-BR')}</span>
          <div class="cart-item-controls">
            <button class="cart-qty-btn decrease" data-id="${item.id}">-</button>
            <span class="cart-qty-val">${item.quantity}</span>
            <button class="cart-qty-btn increase" data-id="${item.id}">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-id="${item.id}" aria-label="Remover item">✕</button>
      `;

      cartItemsList.appendChild(itemEl);
    });

    if (cartBadge) cartBadge.textContent = totalItems;
    if (cartTotalVal) cartTotalVal.textContent = `R$ ${totalPrice.toLocaleString('pt-BR')}`;

    // Adicionar listeners nos botões de controle de quantidade e remover
    document.querySelectorAll('.cart-qty-btn.increase').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = cart.find(i => i.id === id);
        if (item) {
          item.quantity += 1;
          saveCart();
          renderCart();
        }
      });
    });

    document.querySelectorAll('.cart-qty-btn.decrease').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = cart.find(i => i.id === id);
        if (item) {
          item.quantity -= 1;
          if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
          }
          saveCart();
          renderCart();
        }
      });
    });

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        cart = cart.filter(i => i.id !== id);
        saveCart();
        renderCart();
      });
    });
  }

  // Inicializa o carrinho
  renderCart();

  // Enviar pedido no WhatsApp
  if (btnCheckoutWA) {
    btnCheckoutWA.addEventListener('click', () => {
      if (cart.length === 0) return;
      
      let message = 'Olá! Gostaria de solicitar um orçamento para os seguintes produtos:\n\n';
      let totalPrice = 0;
      
      cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        const colorText = item.color ? ` (Cor: ${item.color})` : '';
        message += `${index + 1}. ${item.quantity}x ${item.name}${colorText} - R$ ${itemTotal.toLocaleString('pt-BR')}\n`;
      });
      
      message += `\n*Subtotal Estimado: R$ ${totalPrice.toLocaleString('pt-BR')}*\n\n`;
      message += 'Por favor, confirme o prazo de entrega e as formas de parcelamento. Aguardo retorno!';
      
      const encodedMsg = encodeURIComponent(message);
      const waUrl = `https://wa.me/5500000000000?text=${encodedMsg}`;
      window.open(waUrl, '_blank');
    });
  }


  /* ============================================================
     NEW FEATURE: 4. FAQ ACCORDION
     ============================================================ */
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentItem = btn.closest('.faq-item');
      const isActive = currentItem.classList.contains('active');
      
      // Fechar todos
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // Abrir o atual se não estava ativo
      if (!isActive) {
        currentItem.classList.add('active');
      }
    });
  });


  /* ============================================================
     NEW FEATURE: 5. QUICK VIEW MODAL
     ============================================================ */
  const modal = document.getElementById('quickViewModal');
  const closeModalBtn = document.getElementById('closeModal');
  const modalMedia = document.getElementById('modalMedia');
  const modalLabel = document.getElementById('modalLabel');
  const modalTitle = document.getElementById('modalTitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalSpecsList = document.getElementById('modalSpecsList');
  const modalOptionsSec = document.getElementById('modalOptionsSec');
  const btnModalAddCart = document.getElementById('btnModalAddCart');

  let activeModalProduct = null;

  function openQuickView(card) {
    const category = card.getAttribute('data-category');
    const name = card.querySelector('h3').textContent;
    const priceText = card.querySelector('.card-price');
    const priceVal = priceText ? priceText.textContent : '';
    const rawTags = card.getAttribute('data-tags') || '';
    
    // Armazenar referência do card atual no modal
    activeModalProduct = card;

    // Categorias formatadas
    const categoryNames = {
      'iphone': 'LINHA IPHONE',
      'acessorios': 'ESSENCIAIS APPLE',
      'dispositivos': 'ECOSSISTEMA APPLE'
    };
    modalLabel.textContent = categoryNames[category] || 'PRODUTO';
    modalTitle.textContent = name;
    modalPrice.textContent = priceVal;

    // Adicionar Especificações/Tags
    modalSpecsList.innerHTML = '';
    if (rawTags) {
      rawTags.split(',').forEach(tag => {
        const li = document.createElement('li');
        li.textContent = tag.trim();
        modalSpecsList.appendChild(li);
      });
    }

    // Copiar Mídia (Imagem ou Ilustração)
    modalMedia.innerHTML = '';
    const imgEl = card.querySelector('.card-image img');
    if (imgEl && imgEl.style.display !== 'none') {
      const cloneImg = imgEl.cloneNode(true);
      // Remove classes/estilos de hover
      cloneImg.style.transform = 'none';
      cloneImg.style.animation = 'none';
      modalMedia.appendChild(cloneImg);
    } else {
      // É uma ilustração HTML
      const visualContainer = card.querySelector('.card-image');
      const cloneVisual = visualContainer.cloneNode(true);
      cloneVisual.className = 'visual-wrapper-modal';
      // Limpa os tags absolutos
      const tagPill = cloneVisual.querySelector('.card-tags');
      if (tagPill) tagPill.remove();
      modalMedia.appendChild(cloneVisual);
    }

    // Clonar seletor de cores se houver
    modalOptionsSec.innerHTML = '';
    const colorPicker = card.querySelector('.color-picker');
    if (colorPicker) {
      modalOptionsSec.innerHTML = '<h3>Cor selecionada</h3>';
      const clonePicker = colorPicker.cloneNode(true);
      modalOptionsSec.appendChild(clonePicker);
      
      // Adicionar novos listeners de clique no seletor do modal
      const modalDots = clonePicker.querySelectorAll('.color-dot');
      modalDots.forEach(dot => {
        dot.addEventListener('click', () => {
          const colorName = dot.getAttribute('data-color');
          const imgUrl = dot.getAttribute('data-img');
          
          modalDots.forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
          
          // Atualizar imagem no modal
          const modalImg = modalMedia.querySelector('img');
          if (modalImg && imgUrl) {
            modalImg.src = imgUrl;
          }
          
          // Atualizar o seletor correspondente no card original para manter em sincronia
          const originalDots = card.querySelectorAll('.color-dot');
          originalDots.forEach(oDot => {
            if (oDot.getAttribute('data-color') === colorName) {
              // Simular clique ou rodar lógica
              originalDots.forEach(d => d.classList.remove('active'));
              oDot.classList.add('active');
              const origImg = card.querySelector('.card-image img');
              if (origImg) origImg.src = imgUrl;
              const origColorText = card.querySelector('.active-color-name');
              if (origColorText) origColorText.textContent = colorName;
            }
          });
        });
      });
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    if (!mobileMenu.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  }

  // Click no Card para Quick View
  productCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Abrir modal apenas se não clicou nos botões ou bolinhas
      if (!e.target.closest('.color-dot') && !e.target.closest('.btn-add-cart') && !e.target.closest('.tag-pill')) {
        openQuickView(card);
      }
    });
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Ação de adicionar ao carrinho dentro do modal
  if (btnModalAddCart) {
    btnModalAddCart.addEventListener('click', () => {
      if (activeModalProduct) {
        addToCartFromCard(activeModalProduct);
        closeModal();
      }
    });
  }

});
