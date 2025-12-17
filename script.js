document.addEventListener('DOMContentLoaded', () => {
    const movieGrid = document.querySelector('.movie-grid');
    const movieDetailsSection = document.getElementById('movie-details');
    const heroSection = document.getElementById('hero-section');
    const moviesListSection = document.getElementById('movies-list');
    const backBtn = document.getElementById('back-to-home');
    const heroBtn = document.getElementById('hero-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mainNav = document.querySelector('.main-nav');
    const adOverlay = document.getElementById('ad-overlay'); // الطبقة الشفافة

    let moviesData = [
        {
            "id": 3,
            "title": "اغنيه العيد ",
            "description": "اغانيه رومانسيه ",
            "poster": "https://zaaednews.com/wp-content/uploads/2024/09/%D8%AD%D9%81%D9%84-%D8%A3%D9%86%D8%BA%D8%A7%D9%85-%D9%84%D9%8A%D8%A7%D9%84%D9%8A-%D9%85%D8%B5%D8%B1-%D9%81%D9%8A-%D8%A7%D9%84%D9%85%D8%AA%D8%AD%D9%81-%D8%A7%D9%84%D9%85%D8%B5%D8%B1%D9%8A-%D8%A7%D9%84%D9%83%D8%A8%D9%8A%D8%B1.jpg0_.jpg",
            "year": "2024",
            "category": "رومانسي",
            "director": "انغام",
            "stars": ["ممثل 1", "ممثل 2"],
            "embed_url": "https://player.vimeo.com/video/1091276533"
        }
        // يمكن إضافة المزيد من الأفلام هنا
    ];

    // Toggle mobile menu
    if (mobileMenu && mainNav) {
        mobileMenu.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // ** بداية منطق الطبقة الشفافة والإعلان المعدّل **
    function openAdInNewTab() {
        // تم تحديث هذا السطر باستخدام الرابط الذي قدمته
        const adUrl = 'https://multicoloredsister.com/bw3uVl0.PL3Wp/vkb/mJVUJhZQDT0-2vNvTTM/y/NIz/Mj4MLGT_Y/1bMmzTIF3tM/zTkV'; 

        try {
            const newTab = window.open(adUrl, '_blank');
            if (newTab) {
                // قد لا يعمل التركيز دائمًا بسبب سياسات المتصفح، لكنها محاولة
                newTab.focus();
                // يمكن هنا إخفاء الـ overlay إذا كان الإعلان يفتح بنجاح
                // adOverlay.style.display = 'none'; 
            } else {
                console.warn('Pop-up blocked! Please allow pop-ups for this site.');
                alert('لقد تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة للموقع.');
            }
        } catch (e) {
            console.error('Failed to open ad pop-up:', e);
            alert('حدث خطأ أثناء محاولة فتح الإعلان. يرجى التأكد من السماح بالنوافذ المنبثقة.');
        }
    }

    // ربط النقر على الطبقة الشفافة بدالة فتح الإعلان
    if (adOverlay) {
        adOverlay.addEventListener('click', openAdInNewTab);
    }
    // ** نهاية منطق الطبقة الشفافة والإعلان المعدّل **

    // تحديث رابط URL مع تغيير الحالة (pushState)
    function updateUrl(id = null) {
        if (id) {
            history.pushState({ movieId: id }, null, `?id=${id}`);
        } else {
            history.pushState({}, null, window.location.pathname);
        }
    }

    // عرض قائمة الأفلام
    function displayMovies() {
        movieDetailsSection.style.display = 'none';
        moviesListSection.style.display = 'block';
        heroSection.style.display = 'block';

        movieGrid.innerHTML = '';

        moviesData.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.setAttribute('role', 'listitem');

            const movieLink = document.createElement('a');
            movieLink.href = `?id=${movie.id}`;
            movieLink.dataset.id = movie.id;

            movieLink.innerHTML = `
                <img loading="lazy" src="${movie.poster}" alt="بوستر فيلم ${movie.title}">
                <h3>${movie.title}</h3>
            `;

            movieCard.appendChild(movieLink);
            movieGrid.appendChild(movieCard);
        });

        const featuredMovie = moviesData.find(m => m.id === 1) || moviesData[0];
        if (featuredMovie) {
            heroSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${featuredMovie.poster}')`;
            heroSection.querySelector('h2').textContent = featuredMovie.title;
            heroSection.querySelector('p').textContent = featuredMovie.description.substring(0, 150) + '...';
            heroBtn.href = `?id=${featuredMovie.id}`;
            heroBtn.dataset.id = featuredMovie.id;
        }
    }

    // عرض تفاصيل فيلم
    function displayMovieDetails(movie) {
        if (!movie) return;

        moviesListSection.style.display = 'none';
        heroSection.style.display = 'none';
        movieDetailsSection.style.display = 'block';

        movieDetailsSection.querySelector('.movie-title').textContent = movie.title;
        movieDetailsSection.querySelector('.movie-description').textContent = movie.description;
        movieDetailsSection.querySelector('.director').textContent = movie.director;
        movieDetailsSection.querySelector('.stars').textContent = movie.stars.join(', ');
        movieDetailsSection.querySelector('.category').textContent = movie.category;
        movieDetailsSection.querySelector('.year').textContent = movie.year;

        const videoPlayerContainer = movieDetailsSection.querySelector('.movie-player-container');
        videoPlayerContainer.innerHTML = `
            <iframe src="${movie.embed_url}" frameborder="0" allowfullscreen
                title="مشغل فيديو لفيلم ${movie.title}"
                loading="lazy"></iframe>
        `;
    }

    // التنقل داخل الصفحة بدون إعادة تحميل
    function navigateToMovie(id) {
        const movie = moviesData.find(m => m.id == id);
        if (movie) {
            displayMovieDetails(movie);
            updateUrl(id);
            setActiveNav(false);
        } else {
            displayMovies();
            updateUrl(null);
            setActiveNav(true);
        }
    }

    // تفعيل أو إلغاء تمييز القائمة
    function setActiveNav(isHome) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (isHome && link.dataset.action === 'home') {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // التعامل مع الروابط الداخلية بدون إعادة تحميل الصفحة
    document.body.addEventListener('click', (e) => {
        // نتأكد أن النقر لم يكن على الطبقة الشفافة نفسها
        if (e.target.id === 'ad-overlay') {
            return; // دع معالج حدث الـ overlay الخاص يقوم بعمله
        }

        const target = e.target.closest('a');
        if (!target) return;

        if (target.dataset.id) {
            e.preventDefault();
            const id = target.dataset.id;
            navigateToMovie(id);
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        } else if (target.dataset.action === 'home') {
            e.preventDefault();
            displayMovies();
            updateUrl(null);
            setActiveNav(true);
        }
    });

    // زر العودة للرئيسية من صفحة تفاصيل الفيلم
    backBtn.addEventListener('click', () => {
        displayMovies();
        updateUrl(null);
        setActiveNav(true);
    });

    // زر الفيلم المميز في الـ hero
    heroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = e.currentTarget.dataset.id;
        navigateToMovie(id);
    });

    // التعامل مع زر الرجوع في المتصفح
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.movieId) {
            navigateToMovie(event.state.movieId);
        } else {
            displayMovies();
            setActiveNav(true);
        }
    });

    // عند بداية تحميل الصفحة، عرض الفيلم إذا كان في الرابط
    function init() {
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');
        if (movieId) {
            navigateToMovie(movieId);
        } else {
            displayMovies();
            setActiveNav(true);
        }
    }

    init();
});


