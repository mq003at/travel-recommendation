// Constants for DOM elements
const searchInput = document.querySelector(".search-bar input");
const searchButton = document.querySelector(".search-bar button.search");
const clearButton = document.querySelector(".search-bar button.clear");
const recommendationArea = document.getElementById("recommendation-area");

// Fetch data from the JSON file
let travelData = {};

fetch("travel-api.json")
  .then((response) => response.json())
  .then((data) => {
    travelData = data; // Store the data for later use
  })
  .catch((error) => console.error("Error fetching JSON:", error));

// Search functionality
searchButton.addEventListener("click", () => {
  const query = searchInput.value.toLowerCase(); // Convert input to lowercase for case-insensitive matching
  recommendationArea.innerHTML = ""; // Clear previous results

  if (!query) return; // If no input, do nothing

  let results = [];

  // Handle specific keywords for category-wide results
  if (query === "beach" || query === "beaches") {
    results = travelData.beaches || [];
  } else if (query === "temple" || query === "temples") {
    results = travelData.temples || [];
  } else if (query === "country" || query === "countries") {
    travelData.countries.forEach((country) => {
      results = results.concat(country.cities);
    });
  } else {
    // General search for matching names in beaches, temples, and countries
    if (travelData.beaches) {
      results = results.concat(
        travelData.beaches.filter((beach) =>
          beach.name.toLowerCase().includes(query)
        )
      );
    }

    if (travelData.temples) {
      results = results.concat(
        travelData.temples.filter((temple) =>
          temple.name.toLowerCase().includes(query)
        )
      );
    }

    if (travelData.countries) {
      travelData.countries.forEach((country) => {
        const matchedCities = country.cities.filter((city) =>
          city.name.toLowerCase().includes(query)
        );
        results = results.concat(matchedCities);
      });
    }
  }

  // Display results
  displayRecommendations(results);
});

// Function to display recommendations
function displayRecommendations(results) {
  recommendationArea.innerHTML = ""; // Clear previous results
  if (results.length > 0) {
    results.forEach((result) => {
      const recommendationCard = document.createElement("div");
      recommendationCard.className = "recommendation-card";
      recommendationCard.innerHTML = `
          <img src="${result.imageUrl}" alt="${result.name}">
          <h3>${result.name}</h3>
          <p>${result.description}</p>
          <button class="visit-button">Visit</button>
        `;
      recommendationArea.appendChild(recommendationCard);
    });
  } else {
    recommendationArea.innerHTML =
      "<p>No results found. Try another keyword!</p>";
  }
}

// Clear functionality
clearButton.addEventListener("click", () => {
  searchInput.value = ""; // Clear the search input
  recommendationArea.innerHTML = ""; // Clear the recommendation area
});
