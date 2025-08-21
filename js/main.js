// ====================================
// REDES SOCIALES RESPONSABLES - JS
// Funcionalidades interactivas mejoradas
// Version: 2.0.0
// License: MIT
// ====================================

'use strict';

/**
 * Estado global de la aplicación
 * @type {Object}
 */
const AppState = {
    isMenuOpen: false,
    isScrolling: false,
    currentLanguage: 'es', // Default language
    animations: {
        progressBar: null,
        scrollAnimations: []
    },
    version: '2.0.0'
};

/**
 * Inicialización principal de la aplicación
 * Se ejecuta cuando el DOM está completamente cargado
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Verificar compatibilidad del navegador
        if (!checkBrowserCompatibility()) {
            console.warn('Navegador con compatibilidad limitada detectado');
        }
        
        // Inicializar todas las funcionalidades con manejo de errores
        initProgressBar();
        initMobileMenu();
        initSmoothScroll();
        initScrollAnimations();
        initNetworkCardInteractions();
        initKeyboardNavigation();
        initLazyLoading();
        initLanguageToggle(); // Initialize language functionality
        detectBrowser();
        
        console.log('🌐 Redes Responsables v' + AppState.version + ' - Página cargada correctamente');
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        // Reportar error para análisis
        reportError('Initialization Error', error);
    }
});

/**
 * Verificar compatibilidad básica del navegador
 * @returns {boolean} True si el navegador es compatible
 */
function checkBrowserCompatibility() {
    return !!(
        window.requestAnimationFrame &&
        window.addEventListener &&
        document.querySelector &&
        document.classList &&
        Array.prototype.forEach
    );
}

/**
 * Reportar errores para análisis (puede integrarse con servicios de monitoreo)
 * @param {string} context - Contexto del error
 * @param {Error} error - Objeto de error
 */
function reportError(context, error) {
    // En un entorno de producción, esto podría enviar errores a un servicio de monitoreo
    console.group('🚨 Error Report');
    console.log('Context:', context);
    console.log('Error:', error);
    console.log('User Agent:', navigator.userAgent);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
}

// ====================================
// BARRA DE PROGRESO MEJORADA
// ====================================
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    
    if (!progressBar) {
        console.warn('Elemento progressBar no encontrado');
        return;
    }
    
    // Usar throttle para optimizar performance
    const updateProgress = throttle(function() {
        try {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            
            if (docHeight <= 0) return;
            
            const scrollPercent = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
            progressBar.style.width = scrollPercent + '%';
        } catch (error) {
            console.error('Error al actualizar barra de progreso:', error);
        }
    }, 16); // ~60fps
    
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
}

// ====================================
// MENÚ MÓVIL MEJORADO
// ====================================
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (!hamburger || !navMenu) {
        console.warn('Elementos de navegación no encontrados');
        return;
    }
    
    // Manejar click en hamburger
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Cerrar menú al hacer click en un enlace
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Cerrar menú al hacer click fuera
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && AppState.isMenuOpen) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');
    
    AppState.isMenuOpen = !AppState.isMenuOpen;
    
    if (AppState.isMenuOpen) {
        navMenu.classList.add('active');
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    } else {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    if (!AppState.isMenuOpen) return;
    
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');
    
    AppState.isMenuOpen = false;
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// ====================================
// SCROLL SUAVE MEJORADO
// ====================================
function initSmoothScroll() {
    // Scroll suave para enlaces de navegación con validación
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            
            // Validar que el ID no esté vacío
            if (!targetId) return;
            
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                scrollToElement(targetElement);
            } else {
                console.warn(`Elemento con ID "${targetId}" no encontrado`);
            }
        });
    });
}

function scrollToElement(element, offset = 80) {
    if (!element) return;
    
    try {
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetTop = elementTop - offset;
        
        window.scrollTo({
            top: Math.max(0, offsetTop),
            behavior: 'smooth'
        });
    } catch (error) {
        console.error('Error en scroll suave:', error);
        // Fallback para navegadores que no soportan smooth scroll
        element.scrollIntoView();
    }
}

// ====================================
// ANIMACIONES AL HACER SCROLL MEJORADAS
// ====================================
function initScrollAnimations() {
    // Verificar soporte para IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver no soportado, saltando animaciones');
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                try {
                    entry.target.classList.add('animate');
                    
                    // Para tarjetas con retrasos secuenciales
                    if (entry.target.classList.contains('stat-card')) {
                        animateStatNumbers(entry.target);
                    }
                    
                    // Dejar de observar una vez animado para performance
                    observer.unobserve(entry.target);
                } catch (error) {
                    console.error('Error en animación de scroll:', error);
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos que necesitan animación
    const elementsToAnimate = document.querySelectorAll(
        '.stat-card, .guide-card, .tip-card, .resource-card'
    );
    
    elementsToAnimate.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    // Guardar referencia para cleanup
    AppState.animations.scrollAnimations.push(observer);
}

// ====================================
// ANIMACIÓN DE NÚMEROS EN ESTADÍSTICAS MEJORADA
// ====================================
function animateStatNumbers(statCard) {
    const numberElement = statCard.querySelector('.stat-number');
    if (!numberElement) return;
    
    const finalNumber = numberElement.textContent.trim();
    const isPercentage = finalNumber.includes('%');
    const isBillion = finalNumber.includes('B');
    
    // Extraer valor numérico de forma más robusta
    const numericValue = parseFloat(finalNumber.replace(/[^0-9.]/g, ''));
    
    if (isNaN(numericValue) || numericValue <= 0) {
        console.warn('Valor numérico inválido:', finalNumber);
        return;
    }
    
    // Animar el contador con cancelación posible
    let currentNumber = 0;
    const duration = 2000; // 2 segundos
    const steps = 60; // 60 pasos
    const increment = numericValue / steps;
    const stepDuration = duration / steps;
    
    let animationFrame;
    let stepCount = 0;
    
    function animateStep() {
        if (stepCount >= steps) {
            // Asegurar valor final exacto
            displayNumber(numericValue, numberElement, isPercentage, isBillion);
            return;
        }
        
        currentNumber += increment;
        stepCount++;
        
        displayNumber(currentNumber, numberElement, isPercentage, isBillion);
        
        animationFrame = setTimeout(animateStep, stepDuration);
    }
    
    // Comenzar animación
    animateStep();
    
    // Guardar referencia para posible cancelación
    statCard.dataset.animationFrame = animationFrame;
}

function displayNumber(value, element, isPercentage, isBillion) {
    try {
        let displayValue;
        
        if (isPercentage) {
            displayValue = Math.floor(value) + '%';
        } else if (isBillion) {
            displayValue = value.toFixed(1) + 'B';
        } else {
            displayValue = Math.floor(value).toLocaleString();
        }
        
        element.textContent = displayValue;
    } catch (error) {
        console.error('Error al mostrar número:', error);
    }
}

// ====================================
// INTERACCIONES DE TARJETAS DE REDES MEJORADAS
// ====================================
function initNetworkCardInteractions() {
    const networkCards = document.querySelectorAll('.guide-card, .tip-card, .resource-card');
    
    networkCards.forEach(card => {
        // Hacer las tarjetas focusables para accesibilidad
        if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
        }
        
        // Efecto hover mejorado con transiciones suaves
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('card-animating')) {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('card-animating')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
        
        // Efecto de click con debounce
        let clickTimeout;
        card.addEventListener('click', function() {
            if (clickTimeout) return; // Prevenir clicks múltiples
            
            this.classList.add('card-animating');
            this.style.transform = 'translateY(-5px) scale(0.98)';
            
            clickTimeout = setTimeout(() => {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                this.classList.remove('card-animating');
                clickTimeout = null;
            }, 150);
            
            // Scroll suave a la tarjeta si no está completamente visible
            scrollToElementIfNeeded(this);
        });
        
        // Soporte para navegación con teclado
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Focus/blur para accesibilidad
        card.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-color)';
            this.style.outlineOffset = '2px';
        });
        
        card.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

// ====================================
// NAVEGACIÓN CON TECLADO
// ====================================
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Navegación rápida con teclas
        switch(e.key) {
            case 'Home':
                if (e.ctrlKey) {
                    e.preventDefault();
                    scrollToElement(document.getElementById('inicio'));
                }
                break;
            case 'End':
                if (e.ctrlKey) {
                    e.preventDefault();
                    scrollToElement(document.getElementById('contacto'));
                }
                break;
        }
    });
}

// ====================================
// FUNCIONES AUXILIARES MEJORADAS
// ====================================

// Scroll a elemento si no está visible (mejorado)
function scrollToElementIfNeeded(element) {
    if (!element) return;
    
    try {
        const elementRect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const threshold = 100;
        
        if (elementRect.top < threshold || elementRect.bottom > windowHeight - threshold) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    } catch (error) {
        console.error('Error en scrollToElementIfNeeded:', error);
    }
}

// Scroll hacia una sección específica (mejorado)
function scrollToSection(sectionId) {
    if (!sectionId) return;
    
    const element = document.getElementById(sectionId);
    if (element) {
        scrollToElement(element);
    } else {
        console.warn(`Sección "${sectionId}" no encontrada`);
    }
}

// ====================================
// FUNCIONALIDADES ADICIONALES MEJORADAS
// ====================================

// Detectar navegador para optimizaciones específicas
function detectBrowser() {
    try {
        const userAgent = navigator.userAgent;
        
        if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edge') === -1) {
            document.body.classList.add('chrome');
        } else if (userAgent.indexOf('Firefox') > -1) {
            document.body.classList.add('firefox');
        } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
            document.body.classList.add('safari');
        } else if (userAgent.indexOf('Edge') > -1) {
            document.body.classList.add('edge');
        }
    } catch (error) {
        console.error('Error al detectar navegador:', error);
    }
}

// Lazy loading para imágenes (mejorado)
function initLazyLoading() {
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver no soportado para lazy loading');
        return;
    }
    
    const images = document.querySelectorAll('img[data-src]');
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                img.addEventListener('load', () => {
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                });
                
                img.addEventListener('error', () => {
                    img.classList.add('error');
                    console.error('Error al cargar imagen:', img.dataset.src);
                });
                
                img.src = img.dataset.src;
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Función para copiar texto al portapapeles (mejorada)
async function copyToClipboard(text) {
    if (!text) {
        showNotification('No hay texto para copiar', 'warning');
        return false;
    }
    
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            showNotification('¡Texto copiado al portapapeles!', 'success');
            return true;
        } else {
            // Fallback para navegadores sin soporte de Clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const result = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (result) {
                showNotification('¡Texto copiado al portapapeles!', 'success');
                return true;
            } else {
                throw new Error('execCommand falló');
            }
        }
    } catch (error) {
        console.error('Error al copiar:', error);
        showNotification('Error al copiar texto', 'error');
        return false;
    }
}

// Sistema de notificaciones mejorado
function showNotification(message, type = 'info', duration = 3000) {
    if (!message) return;
    
    try {
        // Remover notificaciones existentes del mismo tipo
        const existingNotifications = document.querySelectorAll(`.notification-${type}`);
        existingNotifications.forEach(notification => {
            notification.remove();
        });
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        // Estilos dinámicos
        const colors = {
            success: '#4caf50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196f3'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1002;
            max-width: 300px;
            word-wrap: break-word;
            animation: slideInRight 0.3s ease;
            cursor: pointer;
        `;
        
        // Permitir cerrar con click
        notification.addEventListener('click', () => {
            removeNotification(notification);
        });
        
        document.body.appendChild(notification);
        
        // Auto-remover después del tiempo especificado
        setTimeout(() => {
            removeNotification(notification);
        }, duration);
        
    } catch (error) {
        console.error('Error al mostrar notificación:', error);
    }
}

function removeNotification(notification) {
    if (!notification || !notification.parentNode) return;
    
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ====================================
// EVENTOS DE PERFORMANCE OPTIMIZADOS
// ====================================

// Throttle mejorado para eventos de scroll
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce mejorado para eventos de resize
function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
}

// Optimización del resize con cleanup
const optimizedResize = debounce(function() {
    try {
        // Recalcular dimensiones si es necesario
        if (AppState.isMenuOpen && window.innerWidth > 768) {
            closeMobileMenu();
        }
        
        console.log('Ventana redimensionada:', window.innerWidth, 'x', window.innerHeight);
    } catch (error) {
        console.error('Error en resize:', error);
    }
}, 250);

window.addEventListener('resize', optimizedResize, { passive: true });

// ====================================
// INICIALIZACIÓN FINAL MEJORADA
// ====================================

// Función que se ejecuta cuando todo está cargado
window.addEventListener('load', function() {
    try {
        // Detectar navegador
        detectBrowser();
        
        // Inicializar lazy loading si hay imágenes
        initLazyLoading();
        
        // Ocultar cualquier spinner de carga
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = 'none';
        }
        
        // Mostrar el contenido con una transición suave
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
        
        console.log('✅ Página completamente cargada');
        
        // Opcional: mostrar notificación de bienvenida
        setTimeout(() => {
            showNotification('¡Bienvenido a Redes Responsables! 🌐', 'success', 2000);
        }, 1000);
        
    } catch (error) {
        console.error('Error en inicialización final:', error);
    }
});

// Manejo de errores globales mejorado
window.addEventListener('error', function(e) {
    console.error('Error en la página:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
    });
    
    // Opcional: mostrar notificación de error al usuario
    if (e.message && !e.message.includes('Script error')) {
        showNotification('Se produjo un error. Por favor, recarga la página.', 'error');
    }
});

// Manejo de promesas rechazadas
window.addEventListener('unhandledrejection', function(e) {
    console.error('Promesa rechazada no manejada:', e.reason);
    e.preventDefault(); // Prevenir que aparezca en la consola del navegador
});

// Cleanup al salir de la página
window.addEventListener('beforeunload', function() {
    try {
        // Limpiar animaciones activas
        AppState.animations.scrollAnimations.forEach(observer => {
            if (observer && observer.disconnect) {
                observer.disconnect();
            }
        });
        
        // Limpiar timeouts activos
        const cards = document.querySelectorAll('[data-animation-frame]');
        cards.forEach(card => {
            const frame = card.dataset.animationFrame;
            if (frame) {
                clearTimeout(frame);
            }
        });
        
    } catch (error) {
        console.error('Error en cleanup:', error);
    }
});

// ====================================
// EXPORTAR FUNCIONES GLOBALES MEJORADAS
// ====================================

// Hacer funciones disponibles globalmente con validación
window.RedesSociales = {
    scrollToSection: (sectionId) => {
        if (typeof sectionId === 'string' && sectionId.trim()) {
            scrollToSection(sectionId);
        } else {
            console.warn('scrollToSection requiere un ID válido');
        }
    },
    
    showNotification: (message, type = 'info', duration = 3000) => {
        if (typeof message === 'string' && message.trim()) {
            showNotification(message, type, duration);
        } else {
            console.warn('showNotification requiere un mensaje válido');
        }
    },
    
    copyToClipboard: async (text) => {
        if (typeof text === 'string' && text.trim()) {
            return await copyToClipboard(text);
        } else {
            console.warn('copyToClipboard requiere texto válido');
            return false;
        }
    },
    
    // Método para obtener estado de la aplicación
    getAppState: () => ({ ...AppState }),
    
    // Método para cerrar menú móvil externamente
    closeMobileMenu: () => closeMobileMenu(),
    
    // Métodos de traducción
    switchLanguage: (lang) => switchLanguage(lang),
    getCurrentLanguage: () => AppState.currentLanguage
};

/**
 * Inicializa la funcionalidad de cambio de idioma
 */
function initLanguageToggle() {
    try {
        // Cargar idioma guardado desde localStorage
        const savedLanguage = localStorage.getItem('preferred-language') || 'es';
        AppState.currentLanguage = savedLanguage;
        
        // Aplicar idioma inicial
        applyTranslations(savedLanguage);
        
        // Configurar botón de cambio de idioma
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', function() {
                const newLanguage = AppState.currentLanguage === 'es' ? 'qu' : 'es';
                switchLanguage(newLanguage);
            });
        }
        
        console.log('✅ Funcionalidad de idiomas inicializada');
    } catch (error) {
        console.error('Error al inicializar idiomas:', error);
        reportError('Language Toggle Error', error);
    }
}

/**
 * Cambia el idioma de la aplicación
 * @param {string} language - Código del idioma ('es' o 'qu')
 */
function switchLanguage(language) {
    try {
        if (!translations[language]) {
            console.warn(`Idioma no soportado: ${language}`);
            return;
        }
        
        AppState.currentLanguage = language;
        localStorage.setItem('preferred-language', language);
        
        // Aplicar traducciones
        applyTranslations(language);
        
        // Actualizar botón de idioma
        updateLanguageToggleButton(language);
        
        // Actualizar atributo lang del HTML
        document.documentElement.lang = language === 'qu' ? 'qu' : 'es';
        
        console.log(`🌐 Idioma cambiado a: ${language.toUpperCase()}`);
    } catch (error) {
        console.error('Error al cambiar idioma:', error);
        reportError('Language Switch Error', error);
    }
}

/**
 * Aplica las traducciones a todos los elementos con data-translate
 * @param {string} language - Código del idioma
 */
function applyTranslations(language) {
    try {
        const elementsToTranslate = document.querySelectorAll('[data-translate]');
        const translationSet = translations[language];
        
        if (!translationSet) {
            console.warn(`No hay traducciones disponibles para: ${language}`);
            return;
        }
        
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = translationSet[key];
            
            if (translation) {
                // Aplicar traducción preservando HTML interno si es necesario
                if (element.innerHTML.includes('<')) {
                    // Si contiene HTML, solo actualizar el texto principal
                    const textNode = Array.from(element.childNodes).find(node => 
                        node.nodeType === Node.TEXT_NODE && node.textContent.trim()
                    );
                    if (textNode) {
                        textNode.textContent = translation;
                    } else {
                        element.innerHTML = translation;
                    }
                } else {
                    element.textContent = translation;
                }
            } else {
                console.warn(`Traducción no encontrada para clave: ${key} en idioma: ${language}`);
            }
        });
        
        console.log(`🔄 Traducciones aplicadas para ${language.toUpperCase()}`);
    } catch (error) {
        console.error('Error al aplicar traducciones:', error);
        reportError('Translation Apply Error', error);
    }
}

/**
 * Actualiza el botón de cambio de idioma
 * @param {string} language - Código del idioma actual
 */
function updateLanguageToggleButton(language) {
    try {
        const languageToggle = document.getElementById('languageToggle');
        const langText = languageToggle?.querySelector('.lang-text');
        const langFlag = languageToggle?.querySelector('.lang-flag');
        
        if (langText && langFlag) {
            if (language === 'qu') {
                langText.textContent = 'QU';
                langFlag.textContent = '🏴';
                languageToggle.title = 'Español rimayman tikray / Cambiar a español';
            } else {
                langText.textContent = 'ES';
                langFlag.textContent = '🏴';
                languageToggle.title = 'Cambiar idioma / Rimay tikray';
            }
        }
    } catch (error) {
        console.error('Error al actualizar botón de idioma:', error);
    }
}

// Congelar el objeto para prevenir modificaciones
Object.freeze(window.RedesSociales);
