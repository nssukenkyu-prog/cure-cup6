// ========================================
// スムーススクロール
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // モバイルメニューを閉じる
            if (window.innerWidth <= 768) {
                document.querySelector('.nav-menu').classList.remove('active');
                document.querySelector('.mobile-menu-toggle').classList.remove('active');
            }
        }
    });
});

// ========================================
// モバイルメニュー
// ========================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// ========================================
// スクロール時のナビゲーション
// ========================================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // スクロール方向に応じてナビゲーションの表示/非表示
    if (currentScroll <= 0) {
        navbar.style.transform = 'translateY(0)';
        navbar.style.boxShadow = 'none';
    } else if (currentScroll > lastScroll) {
        // 下にスクロール
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // 上にスクロール
        navbar.style.transform = 'translateY(0)';
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
    }
    
    lastScroll = currentScroll;
});

// ========================================
// トップに戻るボタン
// ========================================
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// スクロールアニメーション
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// アニメーション対象の要素
const animateElements = document.querySelectorAll('.detail-card, .benefit-card, .feature-item, .highlight-card');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ========================================
// カウントアップアニメーション
// ========================================
const countUpNumbers = () => {
    const numbers = document.querySelectorAll('.highlight-number');
    
    numbers.forEach(number => {
        const target = number.textContent;
        
        // 数値のみを抽出
        const numericValue = parseInt(target.replace(/[^0-9]/g, ''));
        
        if (!isNaN(numericValue)) {
            let current = 0;
            const increment = numericValue / 50;
            const prefix = target.match(/[^0-9]/g) ? target.match(/[^0-9]/g).join('') : '';
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    number.textContent = target;
                    clearInterval(timer);
                } else {
                    number.textContent = prefix + Math.floor(current);
                }
            }, 30);
        }
    });
};

// エントリーセクションが表示されたらカウントアップ
const entrySection = document.querySelector('.entry-section');
const entryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            countUpNumbers();
            entry.target.dataset.animated = 'true';
        }
    });
}, { threshold: 0.3 });

if (entrySection) {
    entryObserver.observe(entrySection);
}

// ========================================
// パララックス効果
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-background');
    
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ========================================
// 画像の遅延読み込み
// ========================================
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
});

// ========================================
// フォームのバリデーション（今後の拡張用）
// ========================================
const validateForm = (form) => {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
};

// ========================================
// 外部リンクの処理
// ========================================
document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.hostname.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

// ========================================
// ページ読み込み完了時の処理
// ========================================
window.addEventListener('load', () => {
    // ヒーローセクションのアニメーション
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
    }
});

// ========================================
// レスポンシブ対応：ウィンドウリサイズ時の処理
// ========================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // デスクトップビューに戻った時はモバイルメニューを閉じる
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    }, 250);
});

// ========================================
// エラーハンドリング
// ========================================
window.addEventListener('error', (e) => {
    console.error('エラーが発生しました:', e.error);
});

// ========================================
// パフォーマンス最適化：デバウンス関数
// ========================================
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// スクロールイベントの最適化
const optimizedScroll = debounce(() => {
    // スクロール時の追加処理があればここに記述
}, 100);

window.addEventListener('scroll', optimizedScroll);

// ========================================
// アクセシビリティ: キーボードナビゲーション
// ========================================
document.addEventListener('keydown', (e) => {
    // Escapeキーでモバイルメニューを閉じる
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
});

// ========================================
// 初期化
// ========================================
console.log('CURE CUP 2026 - Website Initialized');
console.log('日本体育大学スポーツキュアセンター横浜・健志台接骨院 10周年記念');
