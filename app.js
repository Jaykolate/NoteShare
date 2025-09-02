document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Main Page Navigation ---
    const allNavLinks = document.querySelectorAll('.nav-links a, .nav-links-mobile a, .logo');
    const desktopNavLinks = document.querySelectorAll('.nav-links a');
    const homeButtons = document.querySelectorAll('.home-btn');
    const pages = document.querySelectorAll('main');

    function showPage(targetId) {
        pages.forEach(page => page.style.display = 'none');
        const targetPage = document.getElementById(targetId);
        if (targetPage) {
            targetPage.style.display = 'block';
        }
    }
    
    function handleNavClick(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href').substring(1);
        
        desktopNavLinks.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-links a[href="#${targetId}"]`);
        
        if (activeLink) {
            activeLink.classList.add('active');
        } else {
             document.querySelector('.nav-links a[href="#home"]').classList.add('active');
        }
        
        showPage(targetId);
        document.getElementById('nav-links-mobile').style.display = 'none';
    }

    allNavLinks.forEach(link => link.addEventListener('click', handleNavClick));
    homeButtons.forEach(button => button.addEventListener('click', handleNavClick));


    // --- 2. Upload Form Toggling (Notes vs. PYQ) ---
    const showNotesBtn = document.getElementById('showNotesFormBtn');
    const showPyqBtn = document.getElementById('showPyqFormBtn');
    const notesForm = document.getElementById('notes-form-container');
    const pyqForm = document.getElementById('pyq-form-container');

    if (showNotesBtn) {
        showNotesBtn.addEventListener('click', () => {
            notesForm.style.display = 'block';
            pyqForm.style.display = 'none';
            showNotesBtn.classList.add('active');
            showPyqBtn.classList.remove('active');
        });
    }
    if (showPyqBtn) {
        showPyqBtn.addEventListener('click', () => {
            pyqForm.style.display = 'block';
            notesForm.style.display = 'none';
            showPyqBtn.classList.add('active');
            showNotesBtn.classList.remove('active');
        });
    }

    // --- 3. Filter & Show More Logic ---
    function setupFilterAndShowMore(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const searchInput = section.querySelector('.filter-input');
        const yearFilter = section.querySelector('select[id*="yearFilter"]');
        const branchFilter = section.querySelector('select[id*="branchFilter"]');
        const universityFilter = section.querySelector('select[id*="universityFilter"]');
        const allCards = section.querySelectorAll('.cards-grid .card');
        const applyBtn = section.querySelector('button[id*="applyFiltersBtn"]');
        const resetBtn = section.querySelector('button[id*="resetFiltersBtn"]');
        const showMoreBtn = section.querySelector('button[id*="showMoreBtn"]');
        let visibleCardCount = 0;

        function applyFilters() {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedYear = yearFilter.value;
            const selectedBranch = branchFilter.value;
            const selectedUniversity = universityFilter.value;

            allCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const subject = card.querySelector('.subject').textContent.toLowerCase();
                const cardYear = card.dataset.year;
                const cardBranch = card.dataset.branch;
                const cardUniversity = card.dataset.university;

                const searchMatch = title.includes(searchTerm) || subject.includes(searchTerm);
                const yearMatch = selectedYear === 'all' || !cardYear || selectedYear === cardYear;
                const branchMatch = selectedBranch === 'all' || !cardBranch || selectedBranch === cardBranch;
                const universityMatch = selectedUniversity === 'all' || !cardUniversity || selectedUniversity === cardUniversity;

                if (searchMatch && yearMatch && branchMatch && universityMatch) {
                    card.classList.remove('hidden-by-filter');
                } else {
                    card.classList.add('hidden-by-filter');
                }
            });
            resetAndShowCards();
        }

        function resetFilters() {
            searchInput.value = '';
            yearFilter.value = 'all';
            branchFilter.value = 'all';
            universityFilter.value = 'all';
            applyFilters();
        }

        function resetAndShowCards() {
            const cardsToShow = 6;
            allCards.forEach(card => card.style.display = 'none');
            const visibleCards = Array.from(allCards).filter(card => !card.classList.contains('hidden-by-filter'));
            
            visibleCards.slice(0, cardsToShow).forEach(card => card.style.display = 'block');
            visibleCardCount = Math.min(cardsToShow, visibleCards.length);
            
            if (showMoreBtn) {
                showMoreBtn.style.display = visibleCards.length > cardsToShow ? 'inline-block' : 'none';
            }
        }

        function showMore() {
            const cardsPerClick = 3;
            const visibleCards = Array.from(allCards).filter(card => !card.classList.contains('hidden-by-filter'));
            const nextCards = visibleCards.slice(visibleCardCount, visibleCardCount + cardsPerClick);
            
            nextCards.forEach(card => card.style.display = 'block');
            visibleCardCount += nextCards.length;

            if (visibleCardCount >= visibleCards.length) {
                showMoreBtn.style.display = 'none';
            }
        }

        applyBtn.addEventListener('click', applyFilters);
        resetBtn.addEventListener('click', resetFilters);
        if (showMoreBtn) {
            showMoreBtn.addEventListener('click', showMore);
        }
        applyFilters(); // Initial load
    }

    // Initialize logic for both sections
    setupFilterAndShowMore('notes');
    setupFilterAndShowMore('papers');


    // --- 4. Mobile Menu Toggle ---
    const menuBtn = document.getElementById("menu-btn");
    const navLinksMobile = document.getElementById("nav-links-mobile");

    menuBtn.addEventListener("click", () => {
        const isVisible = navLinksMobile.style.display === "flex";
        navLinksMobile.style.display = isVisible ? "none" : "flex";
    });
});