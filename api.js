const OPENWEATHER_API_KEY = 'ENTER_YOUR_API_KEY_HERE'; // Placeholder

async function getWeather(city) {
    try {
        if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'ENTER_YOUR_API_KEY_HERE') {
            return generateRealisticMockWeather(city);
        }

        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`);
        if (!res.ok) throw new Error('Weather fetch failed');
        const data = await res.json();
        
        return {
            temp: Math.round(data.main.temp),
            main: data.weather[0].main,
            icon: data.weather[0].icon,
            humidity: data.main.humidity,
            wind: Math.round(data.wind.speed * 3.6), // convert m/s to km/h
            isMock: false
        };
    } catch (err) {
        return generateRealisticMockWeather(city);
    }
}

function generateRealisticMockWeather(city) {
    // Generate a somewhat consistent pseudo-random temperature based on city string
    let hash = 0;
    for (let i = 0; i < city.length; i++) hash = city.charCodeAt(i) + ((hash << 5) - hash);
    const tempRange = hash % 20; 
    
    // Base temperature for some known cities
    const c = city.toLowerCase();
    let temp = 25; // default warm
    if (['tokyo', 'paris', 'new york', 'switzerland'].some(x => c.includes(x))) temp = 12 + Math.abs(tempRange);
    else if (['dubai', 'bali', 'goa', 'mumbai', 'singapore'].some(x => c.includes(x))) temp = 28 + Math.abs(tempRange % 10);
    else temp = 15 + Math.abs(tempRange);

    let main = temp > 25 ? 'Clear' : (temp < 15 ? 'Clouds' : 'Clear');
    if (hash % 10 === 0) main = 'Rain';

    return {
        temp: temp,
        main: main,
        icon: temp > 25 ? '01d' : '03d',
        humidity: 50 + Math.abs(hash % 30),
        wind: 10 + Math.abs(hash % 15),
        isMock: true
    };
}

async function getCountryInfo(countryQuery) {
    try {
        const query = countryQuery.split(',')[0].trim(); // Handle "City, Country"
        const res = await fetch(`https://restcountries.com/v3.1/name/${query}?fullText=false`);
        if (!res.ok) throw new Error('Country fetch failed');
        const data = await res.json();
        const country = data[0];
        
        let currencyInfo = { code: 'USD', symbol: '$', name: 'US Dollar' };
        if (country.currencies) {
            const code = Object.keys(country.currencies)[0];
            currencyInfo = {
                code: code,
                symbol: country.currencies[code].symbol || code,
                name: country.currencies[code].name
            };
        }

        return {
            name: country.name.common,
            latlng: country.latlng || [0, 0],
            flag: country.flags.png || country.flags.svg,
            currency: currencyInfo,
            region: country.region
        };
    } catch (err) {
        const c = query.toLowerCase();
        let fallbackLatLng = [20, 0];
        
        const FALLBACK_COORDS = {
            'tokyo': [35.6762, 139.6503],
            'paris': [48.8566, 2.3522],
            'dubai': [25.2048, 55.2708],
            'mumbai': [19.0760, 72.8777],
            'goa': [15.2993, 74.1240],
            'singapore': [1.3521, 103.8198],
            'new york': [40.7128, -74.0060]
        };

        for (let key in FALLBACK_COORDS) {
            if (c.includes(key)) {
                fallbackLatLng = FALLBACK_COORDS[key];
                break;
            }
        }

        return {
            name: countryQuery,
            latlng: fallbackLatLng,
            flag: 'https://via.placeholder.com/50x30?text=Flag',
            currency: { code: 'USD', symbol: '$', name: 'US Dollar' },
            region: 'Earth'
        };
    }
}

// Map management
let leafletMap = null;
function initMap(containerId, latlng) {
    // Check if leaflet is loaded
    if (typeof L === 'undefined') {
        console.warn('Leaflet not loaded.');
        return;
    }

    if (leafletMap) {
        leafletMap.remove();
    }

    const [lat, lng] = latlng;
    
    let zoomLevel = 10;
    if (lat === 20 && lng === 0) {
        zoomLevel = 2; // Default to world view
    }

    leafletMap = L.map(containerId).setView([lat, lng], zoomLevel);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(leafletMap);

    L.marker([lat, lng]).addTo(leafletMap)
        .bindPopup('<b>Destination Area</b><br>Enjoy your trip!')
        .openPopup();
        
    // Fix resize issues for floating panels
    setTimeout(() => {
        if(leafletMap) leafletMap.invalidateSize();
    }, 400);
}

window.apiApp = {
    getWeather,
    getCountryInfo,
    initMap
};
