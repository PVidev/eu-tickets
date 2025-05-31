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
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    async function loadCountryData(country) {
        try {
            const response = await fetch(`data/${country.toLowerCase().replace(' ', '_')}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading country data:', error);
            return null;
        }
    }

    async function performSearch() {
        const country = document.getElementById('country').value;
        const transport = document.getElementById('transport').value;

        if (!country || !transport) {
            alert('Please select both country and transport type');
            return;
        }

        try {
            const countryData = await loadCountryData(country);
            
            if (!countryData) {
                searchResults.innerHTML = '<p>No data found for this country.</p>';
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
                resultsHTML += `
                    <div class="result-card">
                        <h3>${provider.name}</h3>
                        <p>Services: ${provider.types.join(', ')}</p>
                        <div class="result-buttons">
                            <a href="${provider.url}" target="_blank" class="provider-link">Visit Website</a>
                            <button class="info-btn" onclick="toggleInfo(${index})">Info</button>
                            <button class="details-btn" onclick="showProviderDetails('${provider.name}', '${country}')">More Details</button>
                        </div>
                        <div class="provider-info" id="provider-info-${index}">
                            <div class="provider-info-content">
                                <div class="description">
                                    ${provider.description}
                                </div>
                                <div class="features">
                                    <h4>Features:</h4>
                                    <ul>
                                        ${provider.features.map(feature => `<li>${feature}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="rules">
                                    <h4>Booking Rules:</h4>
                                    <ul>
                                        ${provider.rules.map(rule => `<li>${rule}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="advantages">
                                    <h4>Advantages:</h4>
                                    <p>${provider.advantages}</p>
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

    // Make showProviderDetails available globally
    window.showProviderDetails = async function(providerName, country) {
        try {
            // Check if this provider's details are already expanded
            const resultCards = document.querySelectorAll('.result-card');
            const currentCard = Array.from(resultCards).find(card => 
                card.querySelector('h3').textContent === providerName
            );
            
            if (currentCard) {
                const existingDetails = currentCard.querySelector('.provider-details');
                if (existingDetails && existingDetails.classList.contains('expanded')) {
                    // If details are already expanded, collapse them
                    existingDetails.classList.remove('expanded');
                    return;
                }
                
                // Remove any other expanded details
                document.querySelectorAll('.provider-details.expanded').forEach(details => {
                    details.classList.remove('expanded');
                });
            }

            const countryData = await loadCountryData(country);
            if (!countryData) {
                throw new Error('Could not load country data');
            }

            const provider = countryData.providers.find(p => p.name === providerName);
            if (!provider) {
                throw new Error(`Provider "${providerName}" not found in ${country}`);
            }

            const detailsSection = document.createElement('div');
            detailsSection.className = 'provider-details';
            detailsSection.innerHTML = `
                <div class="provider-details-content">
                    <div class="description">
                        ${provider.description}
                    </div>
                    <div class="features">
                        <h3>Features</h3>
                        <ul>
                            ${provider.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="rules">
                        <h3>Booking Rules</h3>
                        <ul>
                            ${provider.rules.map(rule => `<li>${rule}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="advantages">
                        <h3>Advantages</h3>
                        <p>${provider.advantages}</p>
                    </div>
                    <div class="contacts">
                        <h3>Contacts</h3>
                        <ul>
                            ${provider.contacts ? provider.contacts.map(contact => `<li>${contact}</li>`).join('') : '<li>No contact information available</li>'}
                        </ul>
                    </div>
                    <div class="refunds">
                        <h3>Refund Policy</h3>
                        <ul>
                            ${provider.refunds ? provider.refunds.map(refund => `<li>${refund}</li>`).join('') : '<li>No refund information available</li>'}
                        </ul>
                    </div>
                </div>
            `;

            // Find the result card for this provider
            const resultCard = Array.from(resultCards).find(card => 
                card.querySelector('h3').textContent === providerName
            );
            
            if (resultCard) {
                // Remove any existing details section
                const existingDetails = resultCard.querySelector('.provider-details');
                if (existingDetails) {
                    existingDetails.remove();
                }
                
                // Add the new details section
                resultCard.appendChild(detailsSection);
                
                // Add animation class
                setTimeout(() => {
                    detailsSection.classList.add('expanded');
                }, 10);
            } else {
                throw new Error(`Could not find result card for provider: ${providerName}`);
            }
        } catch (error) {
            console.error('Error showing provider details:', error);
            // Show error message to user
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = `Error: ${error.message}. Please try again.`;
            errorMessage.style.color = 'red';
            errorMessage.style.padding = '1rem';
            errorMessage.style.marginTop = '1rem';
            errorMessage.style.backgroundColor = '#fff3f3';
            errorMessage.style.borderRadius = '0.5rem';
            errorMessage.style.border = '1px solid #ffcdd2';
            
            // Find the search results container
            const searchResults = document.getElementById('searchResults');
            if (searchResults) {
                searchResults.appendChild(errorMessage);
                // Remove error message after 5 seconds
                setTimeout(() => {
                    errorMessage.remove();
                }, 5000);
            }
        }
    };

    // Remove modal-related code
    const modal = document.getElementById('infoModal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        }
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});
