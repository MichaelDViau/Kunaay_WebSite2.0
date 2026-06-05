(function () {
  const toggleSelector = '[data-language-toggle]';
  const translations = {
    text: (window.TRANSLATIONS_TEXT || {}),
    attributes: {
      'aria-label': {
        'Toggle menu': 'Abrir o cerrar el menú',
        'Switch site language to Spanish': 'Cambiar el idioma del sitio a español',
        'Switch site language to English': 'Cambiar el idioma del sitio a inglés',
        'Quick contact links': 'Enlaces de contacto rápido',
        'Visit Ku Naay on Facebook': 'Visitar Ku Naay en Facebook',
        'Chat with Ku Naay on WhatsApp': 'Chatear con Ku Naay en WhatsApp',
        'Previous review': 'Reseña anterior',
        'Next review': 'Reseña siguiente',
        'Previous month': 'Mes anterior',
        'Next month': 'Mes siguiente'
      },
      'placeholder': {
        'Your full name': 'Su nombre completo',
        'your@email.com': 'su@correo.com',
        'How can we help?': '¿Cómo podemos ayudar?',
        'Tell us about your ideal stay...': 'Cuéntenos sobre su estadía ideal...'
      }
    }
  };

  const state = {
    current: 'en',
    textNodes: [],
    attributeNodes: [],
    toggles: []
  };

  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE']);

  function normalizeText(value) {
    return value.replace(/\s+/g, ' ').trim();
  }

  function getStoredLanguage() {
    try {
      return localStorage.getItem('preferredLanguage') || 'en';
    } catch (e) {
      return 'en';
    }
  }

  function setStoredLanguage(lang) {
    try {
      localStorage.setItem('preferredLanguage', lang);
    } catch (e) {
      /* no-op */
    }
  }

  function collectTextNodes(root) {
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.textContent || !node.textContent.trim()) {
            return NodeFilter.FILTER_REJECT;
          }
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (SKIP_TAGS.has(parent.tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.matches && parent.matches(toggleSelector)) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      },
      false
    );

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const original = node.textContent;
      const key = normalizeText(original);
      if (key) {
        state.textNodes.push({ node, original, key });
      }
    }
  }

  function collectAttributeNodes() {
    const attributeMaps = translations.attributes || {};
    Object.keys(attributeMaps).forEach((attr) => {
      const map = attributeMaps[attr];
      document.querySelectorAll('[' + attr + ']').forEach((element) => {
        if (element.matches && element.matches(toggleSelector)) return;
        const value = element.getAttribute(attr);
        if (!value) return;
        const key = value.trim();
        if (!(key in map)) return;
        state.attributeNodes.push({ element, attr, key, original: value });
      });
    });
  }

  function updateToggleText(lang) {
    const nextLabel = lang === 'es' ? '🇺🇸 English' : '🇲🇽 Español';
    const ariaLabel = lang === 'es'
      ? 'Cambiar el idioma del sitio a inglés'
      : 'Switch site language to Spanish';

    state.toggles.forEach((button) => {
      button.textContent = nextLabel;
      button.setAttribute('aria-label', ariaLabel);
      button.dataset.currentLang = lang;
    });
  }

  function applyLanguage(lang) {
    state.current = lang;
    const isSpanish = lang === 'es';
    const textMap = translations.text;

    state.textNodes.forEach((item) => {
      if (isSpanish) {
        const t = textMap[item.key];
        if (t !== undefined) {
          item.node.textContent = t;
        }
      } else {
        item.node.textContent = item.original;
      }
    });

    state.attributeNodes.forEach((item) => {
      const map = translations.attributes[item.attr] || {};
      if (isSpanish) {
        const t = map[item.key];
        if (t !== undefined) {
          item.element.setAttribute(item.attr, t);
        }
      } else {
        item.element.setAttribute(item.attr, item.original);
      }
    });

    document.documentElement.setAttribute('lang', isSpanish ? 'es' : 'en');
    updateToggleText(lang);
    setStoredLanguage(lang);
  }

  function handleToggle(event) {
    event.preventDefault();
    applyLanguage(state.current === 'es' ? 'en' : 'es');
  }

  function collectToggles() {
    const seen = new Set(state.toggles);
    document.querySelectorAll(toggleSelector).forEach((button) => {
      if (seen.has(button)) return;
      button.addEventListener('click', handleToggle);
      state.toggles.push(button);
    });
    updateToggleText(state.current);
  }

  document.addEventListener('DOMContentLoaded', () => {
    collectTextNodes(document.body);
    collectAttributeNodes();
    collectToggles();
    applyLanguage(getStoredLanguage());
  });
})();
