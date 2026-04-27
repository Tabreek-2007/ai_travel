document.addEventListener('DOMContentLoaded', () => {
    
    // --- Constants & Variables ---
    let myChart = null;
    let selectedInterests = ['Culture'];

    // --- DOM Elements ---
    const themeToggle = document.getElementById('theme-toggle');
    const budgetRange = document.getElementById('budgetRange');
    const budgetValue = document.getElementById('budgetValue');
    const tagsContainer = document.getElementById('interests-tags');
    const form = document.getElementById('travel-form');
    const destInput = document.getElementById('destination');
    const destGrid = document.getElementById('destinations-grid');
    const loadingScreen = document.getElementById('loading-screen');
    const resultsDashboard = document.getElementById('results-dashboard');
    const pdfBtn = document.getElementById('download-pdf-btn');
    const saveTripBtn = document.getElementById('save-trip-btn');
    const autocompleteList = document.getElementById('autocomplete-list');

    // --- Init ---
    initTheme();
    renderPopularDestinations();
    initScrollReveal();

    // Fade out preloader on load
    window.addEventListener('load', () => {
        const preloader = document.getElementById('page-preloader');
        if(preloader) {
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(animateCounters, 300);
            }, 600);
        } else {
            animateCounters();
        }
    });

    // Ripple Events
    document.addEventListener('click', function(e) {
        let btn = e.target.closest('.ripple-btn');
        if(btn) {
            let circle = document.createElement('span');
            let diameter = Math.max(btn.clientWidth, btn.clientHeight);
            let radius = diameter / 2;
            let rect = btn.getBoundingClientRect();
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.classList.add('ripple');
            const ripple = btn.querySelector('.ripple');
            if(ripple) ripple.remove();
            btn.appendChild(circle);
        }
    });

    // --- Event Listeners ---

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('ai_travel_theme', isDark ? 'dark' : 'light');
    });

    function initTheme() {
        const saved = localStorage.getItem('ai_travel_theme');
        if (saved === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }

    // Budget Slider
    budgetRange.addEventListener('input', (e) => {
        budgetValue.textContent = e.target.value;
    });

    // Tag Selection
    if (tagsContainer) {
        tagsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag')) {
                e.target.classList.toggle('active');
                const val = e.target.dataset.value;
                if (selectedInterests.includes(val)) {
                    selectedInterests = selectedInterests.filter(i => i !== val);
                } else {
                    selectedInterests.push(val);
                }
            }
        });
    }

    // Autocomplete With Debounce
    let debounceTimer;
    destInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const val = destInput.value.toLowerCase();
            autocompleteList.innerHTML = '';
            if (!val) {
                autocompleteList.style.display = 'none';
                return;
            }
            
            const cities = Object.keys(window.dataApp.ATTRACTIONS);
            const matches = cities.filter(c => c.toLowerCase().includes(val));
            
            if (matches.length > 0) {
                matches.forEach(match => {
                    const li = document.createElement('li');
                    li.textContent = match.charAt(0).toUpperCase() + match.slice(1);
                    li.addEventListener('click', () => {
                        destInput.value = li.textContent;
                        autocompleteList.style.display = 'none';
                    });
                    autocompleteList.appendChild(li);
                });
                autocompleteList.style.display = 'block';
            } else {
                autocompleteList.style.display = 'none';
            }
        }, 300);
    });

    document.addEventListener('click', (e) => {
        if (!destInput.contains(e.target) && !autocompleteList.contains(e.target)) {
            autocompleteList.style.display = 'none';
        }
    });

    // Form Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Gather data
        const dest = destInput.value;
        const days = parseInt(document.getElementById('days').value);
        const travelers = document.getElementById('travelers').value;
        const acc = document.getElementById('accommodation').value;
        const budget = parseInt(budgetRange.value);

        // UI Transition
        loadingScreen.style.display = 'flex';
        resultsDashboard.style.display = 'none';

        // Fake AI processing delay
        setTimeout(() => document.getElementById('loading-subtext').innerText = 'Gathering local insights...', 800);
        setTimeout(() => document.getElementById('loading-subtext').innerText = 'Optimizing itinerary routes...', 1600);
        
        // Fetch APIs concurrently
        const [weatherData, countryData] = await Promise.all([
            window.apiApp.getWeather(dest),
            window.apiApp.getCountryInfo(dest)
        ]);

        setTimeout(() => {
            generateDashboard(dest, days, travelers, acc, budget, selectedInterests, weatherData, countryData);
        }, 2200);
    });

    // Save Trip
    saveTripBtn.addEventListener('click', () => {
        saveTripBtn.innerHTML = '<i class="ph ph-check"></i> Saved';
        saveTripBtn.style.background = 'var(--accent-secondary)';
        saveTripBtn.style.color = 'white';
        // Mock save
        setTimeout(() => {
            saveTripBtn.innerHTML = '<i class="ph ph-bookmark-simple"></i> Save Trip';
            saveTripBtn.style.background = 'transparent';
            saveTripBtn.style.color = 'var(--accent-primary)';
        }, 3000);
    });

    // PDF Export
    pdfBtn.addEventListener('click', () => {
        const element = document.getElementById('pdf-content');
        
        // Optimization for html2pdf
        const opt = {
            margin:       10,
            filename:     'AI_Travel_Plan.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        pdfBtn.innerText = 'Generating...';
        html2pdf().set(opt).from(element).save().then(() => {
            pdfBtn.innerHTML = '<i class="ph ph-download-simple"></i> Download PDF';
        });
    });

    // --- Core Functions ---
    
    function animateCounters() {
        const counters = document.querySelectorAll('.counter-val');
        counters.forEach(c => {
            const target = +c.getAttribute('data-target');
            const inc = target / 40;
            let current = 0;
            const update = setInterval(() => {
                current += inc;
                if(current >= target) { 
                    c.innerText = target.toLocaleString(); 
                    clearInterval(update); 
                } else { 
                    c.innerText = Math.ceil(current).toLocaleString(); 
                }
            }, 30);
        });
    }

    function renderPopularDestinations() {
        if (!destGrid) return;
        const destinations = window.dataApp.POPULAR_DESTINATIONS;
        
        destGrid.innerHTML = destinations.map(d => `
            <div class="destination-card" onclick="document.getElementById('destination').value='${d.city}'; document.getElementById('planner-section').scrollIntoView();">
                <div class="dest-img-wrapper">
                    <div class="dest-badge">${d.budget}</div>
                    <img src="${d.img}" alt="${d.city}" loading="lazy">
                </div>
                <div class="dest-content">
                    <div class="dest-loc">${d.country}</div>
                    <h3>${d.city}</h3>
                    <p>${d.desc}</p>
                    <div class="dest-meta">
                        <span><i class="ph ph-sun"></i> ${d.season}</span>
                        <span style="color:var(--accent-primary); font-weight:600;">Plan Trip <i class="ph ph-arrow-right"></i></span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function generateDashboard(dest, days, travelers, acc, budget, interests, weather, country) {
        // --- Populate Summary ---
        document.getElementById('r-destination').innerText = dest;
        document.getElementById('r-days').innerText = days;
        document.getElementById('r-travelers').innerText = travelers;
        document.getElementById('r-accommodation').innerText = acc;
        
        document.getElementById('r-temp').innerText = weather.temp;
        document.getElementById('r-condition').innerText = weather.main;
        document.getElementById('r-weather-icon').src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
        
        document.getElementById('r-currency').innerText = `${country.currency.name} (${country.currency.symbol})`;
        
        // Advanced Metrics Dashboard
        document.getElementById('r-est-cost').innerText = '$' + budget.toLocaleString();
        
        const isWarm = weather.temp > 20;
        document.getElementById('r-best-time').innerText = isWarm ? 'Now (Warm & Sunny)' : 'Summer Months';
        
        let comfort = acc === 'Luxury' ? 98 : (acc === 'Standard' ? 88 : 75);
        document.getElementById('r-comfort').innerText = `${comfort}/100`;

        let weatherScore = 10 - Math.abs(weather.temp - 24) / 4;
        if(weatherScore < 4) weatherScore = 4;
        if(weather.main === 'Rain') weatherScore -= 2;
        document.getElementById('r-weather-rating').innerText = `${weatherScore.toFixed(1)}/10`;

        // Packing Logic
        let packKey = 'moderate';
        if (weather.temp > 26) packKey = 'hot';
        else if (weather.temp < 15) packKey = 'cold';
        document.getElementById('r-packing').innerText = window.dataApp.PACKING_TIPS[packKey].join(', ');
        
        // Food Logic
        const destKey = Object.keys(window.dataApp.FOOD_RECOMMENDATIONS).find(k => dest.toLowerCase().includes(k));
        const foods = destKey ? window.dataApp.FOOD_RECOMMENDATIONS[destKey] : ['Local Street Food', 'Signature Regional Dish', 'Artisan Coffee'];
        document.getElementById('r-food').innerText = foods.slice(0, 3).join(', ');

        const safeties = ['Keep belongings secure in crowded areas.', 'Use official taxis or ride-shares.', 'Stay hydrated.', 'Save emergency contacts offline.'];
        document.getElementById('r-safety').innerText = safeties[Math.floor(Math.random() * safeties.length)];

        // --- Generate Itinerary ---
        const itineraryContainer = document.getElementById('itinerary-container');
        itineraryContainer.innerHTML = '';
        
        let availableAttractions = [];
        if (destKey && window.dataApp.ATTRACTIONS[destKey]) {
            availableAttractions = [...window.dataApp.ATTRACTIONS[destKey]];
        }
        
        // Fill up to needed count if lacking
        while(availableAttractions.length < days * 3) {
            availableAttractions = availableAttractions.concat(window.dataApp.GENERAL_ATTRACTIONS);
            // Shuffle
            availableAttractions.sort(() => 0.5 - Math.random());
        }

        let attIndex = 0;
        for(let d = 1; d <= days; d++) {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            
            let morning = availableAttractions[attIndex++] || "Explore downtown";
            let afternoon = availableAttractions[attIndex++] || "Local market tour";
            let evening = availableAttractions[attIndex++] || "Dinner at local restaurant";

            item.innerHTML = `
                <h3 class="day-title">Day ${d}</h3>
                <div class="attraction-list">
                    <div class="attraction-item">
                        <i class="ph-fill ph-sun"></i>
                        <div>
                            <strong>Morning:</strong>
                            <p>${morning}</p>
                        </div>
                    </div>
                    <div class="attraction-item">
                        <i class="ph-fill ph-sun-horizon"></i>
                        <div>
                            <strong>Afternoon:</strong>
                            <p>${afternoon}</p>
                        </div>
                    </div>
                    <div class="attraction-item">
                        <i class="ph-fill ph-moon-stars"></i>
                        <div>
                            <strong>Evening:</strong>
                            <p>${evening}</p>
                        </div>
                    </div>
                </div>
            `;
            itineraryContainer.appendChild(item);
        }

        // --- Render Final View ---
        loadingScreen.style.display = 'none';
        resultsDashboard.style.display = 'block';
        resultsDashboard.scrollIntoView({ behavior: 'smooth' });
        
        // --- Render Chart ---
        renderChart(budget);

        // --- Init Map ---
        window.apiApp.initMap('map', country.latlng);
    }

    function renderChart(totalBudget) {
        document.getElementById('r-budget-total').innerText = totalBudget.toLocaleString();
        
        const ctx = document.getElementById('budgetChart').getContext('2d');
        if (myChart) myChart.destroy();

        // Ratios
        const flight = Math.round(totalBudget * 0.3);
        const hotel = Math.round(totalBudget * 0.35);
        const food = Math.round(totalBudget * 0.15);
        const act = Math.round(totalBudget * 0.15);
        const misc = totalBudget - (flight + hotel + food + act);

        myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Flights/Transport', 'Accommodation', 'Food', 'Activities', 'Misc'],
                datasets: [{
                    data: [flight, hotel, food, act, misc],
                    backgroundColor: [
                        '#4f46e5',
                        '#06b6d4',
                        '#8b5cf6',
                        '#f59e0b',
                        '#10b981'
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                family: "'Inter', sans-serif"
                            },
                            color: document.body.classList.contains('dark-mode') ? '#cbd5e1' : '#64748b'
                        }
                    }
                }
            }
        });
    }

    // Scroll Reveal Intersection Observer
    function initScrollReveal() {
        const reveals = document.querySelectorAll('.scroll-reveal');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        reveals.forEach(el => observer.observe(el));
        
        // trigger initial ones
        setTimeout(() => {
            document.querySelectorAll('.scroll-reveal').forEach(el => {
                const rect = el.getBoundingClientRect();
                if(rect.top < window.innerHeight) {
                    el.classList.add('active');
                }
            });
        }, 100);
    }

});
