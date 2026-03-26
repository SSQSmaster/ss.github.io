// ========== 粒子背景效果 ==========
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制渐变背景
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#080812');
        gradient.addColorStop(0.5, '#0f0f1a');
        gradient.addColorStop(1, '#1a1a2e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 更新和绘制粒子
        this.particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            
            // 边界检测
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
            this.ctx.fill();
            
            // 连接附近的粒子
            for (let j = index + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ========== 导航栏滚动效果 ==========
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.menuToggle = document.getElementById('menuToggle');
        this.init();
    }
    
    init() {
        // 滚动效果
        window.addEventListener('scroll', () => this.onScroll());
        
        // 导航链接点击
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.onLinkClick(e, link));
        });
        
        // 移动端菜单
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMenu());
        }
        
        // 点击页面其他地方关闭菜单
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                this.closeMenu();
            }
        });
    }
    
    onScroll() {
        const scrollY = window.scrollY;
        
        // 添加阴影效果
        if (scrollY > 50) {
            this.navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            this.navbar.style.boxShadow = 'none';
        }
        
        // 高亮当前section的导航链接
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    onLinkClick(e, link) {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
            this.closeMenu();
        }
    }
    
    toggleMenu() {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('active');
    }
    
    closeMenu() {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.remove('active');
    }
}

// ========== 作品卡片动画 ==========
class WorkCards {
    constructor() {
        this.workCards = document.querySelectorAll('.work-card');
        this.init();
    }
    
    init() {
        // 初始隐藏所有卡片
        this.workCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
        });
        
        // 滚动时显示卡片
        this.observeCards();
        
        // 视频播放按钮
        this.videoButtons = document.querySelectorAll('.view-work-btn');
        this.videoButtons.forEach(btn => {
            btn.addEventListener('click', () => this.openVideoModal(btn));
        });
    }
    
    observeCards() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });
        
        this.workCards.forEach(card => {
            observer.observe(card);
        });
    }
    
    openVideoModal(btn) {
        const videoFile = btn.dataset.video;
        const card = btn.closest('.work-card');
        const title = card.querySelector('.work-title').textContent;
        const description = card.querySelector('.work-description').textContent;
        
        const modal = document.getElementById('videoModal');
        const videoPlayer = document.getElementById('videoPlayer');
        const videoTitle = document.getElementById('videoTitle');
        const videoDescription = document.getElementById('videoDescription');
        
        // 设置视频路径
        videoPlayer.src = `videos/compressed/${videoFile}`;
        videoTitle.textContent = title;
        videoDescription.textContent = description;
        
        // 显示弹窗
        modal.classList.add('active');
        
        // 自动播放
        videoPlayer.play().catch(e => console.log('自动播放被阻止:', e));
        
        // 禁止背景滚动
        document.body.style.overflow = 'hidden';
    }
}

// ========== 视频弹窗控制 ==========
class VideoModal {
    constructor() {
        this.modal = document.getElementById('videoModal');
        this.closeBtn = document.getElementById('closeModal');
        this.videoPlayer = document.getElementById('videoPlayer');
        this.init();
    }
    
    init() {
        // 关闭按钮
        this.closeBtn.addEventListener('click', () => this.closeModal());
        
        // 点击弹窗外部关闭
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
        
        // 视频播放结束关闭弹窗
        this.videoPlayer.addEventListener('ended', () => {
            this.closeModal();
        });
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        this.videoPlayer.pause();
        this.videoPlayer.src = '';
        document.body.style.overflow = '';
    }
}

// ========== 表单验证 ==========
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // 输入框动画效果
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // 简单验证
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ef4444';
                setTimeout(() => {
                    input.style.borderColor = '';
                }, 3000);
            }
        });
        
        if (isValid) {
            // 模拟提交
            const submitBtn = this.form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = '发送中...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('感谢您的留言！我会尽快回复您。');
                this.form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }
    }
}

// ========== 滚动动画 ==========
class ScrollAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // 观察所有需要动画的元素
        const animatedElements = document.querySelectorAll('.section-title, .section-subtitle, .about-text, .skill-item');
        animatedElements.forEach(el => observer.observe(el));
    }
}

// ========== 初始化所有功能 ==========
document.addEventListener('DOMContentLoaded', () => {
    // 初始化粒子背景
    new ParticleSystem();
    
    // 初始化导航
    new Navigation();
    
    // 初始化作品卡片
    new WorkCards();
    
    // 初始化视频弹窗
    new VideoModal();
    
    // 初始化联系表单
    new ContactForm();
    
    // 初始化滚动动画
    new ScrollAnimations();
    
    // 添加CSS动画样式
    const style = document.createElement('style');
    style.textContent = `
        .work-card {
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .skill-item {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .skill-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .section-title,
        .section-subtitle,
        .about-text {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .section-title.animate-in,
        .section-subtitle.animate-in,
        .about-text.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* 响应式调整 */
        @media (max-width: 768px) {
            .navbar {
                padding: 1rem;
            }
            
            .hero-title {
                font-size: 2.5rem;
            }
            
            .works-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('3D作品集网站已加载完成！');
    console.log('🎮 Portfolio loaded successfully!');
});
