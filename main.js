const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".header__image img", {
  ...scrollRevealOption,
  origin: "right",
});
ScrollReveal().reveal(".header__content .section__subheader", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".header__content h1", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".header__content p", {
  ...scrollRevealOption,
  delay: 1500,
});
ScrollReveal().reveal(".header__btns", {
  ...scrollRevealOption,
  delay: 2000,
});

ScrollReveal().reveal(".service__card", {
  duration: 1000,
  interval: 500,
});

ScrollReveal().reveal(".destination__card", {
  ...scrollRevealOption,
  interval: 500,
});

ScrollReveal().reveal(".trip__image img", {
  ...scrollRevealOption,
  origin: "right",
});
ScrollReveal().reveal(".trip__content .section__subheader", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".trip__content .section__header", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".trip__list li", {
  ...scrollRevealOption,
  delay: 1500,
  interval: 500,
});

ScrollReveal().reveal(".client__content .section__subheader", {
  ...scrollRevealOption,
});
ScrollReveal().reveal(".client__content .section__header", {
  ...scrollRevealOption,
  delay: 500,
});

const swiper = new Swiper(".swiper", {
  direction: "vertical",
  autoHeight: true,
  slidesPerView: 1,
});

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');
    let providersData = null;
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    async function performSearch() {
        const country = document.getElementById('country').value;
        const transport = document.getElementById('transport').value;

        if (!country || !transport) {
            alert('Please select both country and transport type');
            return;
        }

        try {
            const response = await fetch('data.json');
            const data = await response.json();
            providersData = data.providers_info;

            const countryData = data.destinations.find(dest => dest.country === country);
            
            if (!countryData) {
                searchResults.innerHTML = '<p>No results found for this country.</p>';
                return;
            }

            if (!countryData.transport.includes(transport)) {
                searchResults.innerHTML = `<p>No ${transport} services found for ${country}.</p>`;
                return;
            }

            const relevantProviders = countryData.providers.filter(provider => 
                provider.types.includes(transport)
            );

            if (relevantProviders.length === 0) {
                searchResults.innerHTML = '<p>No providers found for this combination.</p>';
                return;
            }

            let resultsHTML = `<h3>Available Providers for ${transport} in ${country}</h3>`;
            
            relevantProviders.forEach((provider, index) => {
                const providerInfo = providersData[provider.name];
                resultsHTML += `
                    <div class="result-card">
                        <h3>${provider.name}</h3>
                        <p>Services: ${provider.types.join(', ')}</p>
                        <div class="result-buttons">
                            <a href="${provider.url}" target="_blank" class="provider-link">Visit Website</a>
                            <button class="info-btn" onclick="toggleInfo(${index})">Info</button>
                        </div>
                        <div class="provider-info" id="provider-info-${index}">
                            <div class="provider-info-content">
                                <div class="description">
                                    ${providerInfo.description}
                                </div>
                                <div class="features">
                                    <h4>Features</h4>
                                    <ul>
                                        ${providerInfo.features.map(feature => `<li>${feature}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="rules">
                                    <h4>Booking Rules</h4>
                                    <ul>
                                        ${providerInfo.rules.map(rule => `<li>${rule}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            searchResults.innerHTML = resultsHTML;

        } catch (error) {
            console.error('Error fetching data:', error);
            searchResults.innerHTML = '<p>Error loading results. Please try again.</p>';
        }
    }

    // Make toggleInfo available globally
    window.toggleInfo = function(index) {
        const infoSection = document.getElementById(`provider-info-${index}`);
        const allInfoSections = document.querySelectorAll('.provider-info');
        
        // Close all other sections
        allInfoSections.forEach((section, i) => {
            if (i !== index) {
                section.classList.remove('expanded');
            }
        });

        // Toggle the clicked section
        infoSection.classList.toggle('expanded');
    };
});
