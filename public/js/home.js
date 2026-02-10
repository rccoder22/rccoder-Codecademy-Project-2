const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");

let isSearching = false;

function displayItems(hasItems, data = {}) {
  results.replaceChildren();
  if (data && hasItems) {
    const mainList = document.createElement("ul");
    // Iterate over brewery data and put out to the screen
    data.map((brewery) => {
      const listItem = document.createElement("li");
      const searchListDiv = document.createElement("div");
      const nameDiv = document.createElement("div");
      const buttonDiv = document.createElement("div");
      nameDiv.innerHTML = `
        <h2><a href="/search/1?bn=${brewery.id}">${brewery.name}</a></h2>
        <br />
        <p>${brewery.address_1 || ""}<br />${brewery.city}, ${brewery.state_province} ${brewery.postal_code}<br /><br />
        <a href="${brewery.website_url}">${brewery.name} Website</a></p>
        `;
      const favoriteButton = document.createElement("button");

      // Add classes to objects
      listItem.classList.add("list-item");
      searchListDiv.classList.add("search-list-item");
      favoriteButton.classList.add("favorite-button");

      // Add data to button and text content
      favoriteButton.dataset.info = brewery.id;
      favoriteButton.innerHTML = `<span class="no-favorite-heart">🖤</span><span class="favorite-heart">🧡</span>`;

      // Button event Listener
      favoriteButton.addEventListener("click", (event) => {
        console.log(`Favorite Id: ${favoriteButton.dataset.info}`);
        favoriteButton.classList.toggle("is-favorited");
      });

      // Append everything to main items
      searchListDiv.appendChild(nameDiv);
      buttonDiv.appendChild(favoriteButton);
      listItem.appendChild(searchListDiv);
      listItem.appendChild(buttonDiv);

      // Append list item to unordered list
      mainList.appendChild(listItem);
    });
    results.appendChild(mainList);
  } else {
    results.textContent = "No Breweries Found!";
  }
}

// Function to search for what the user input
function searchAndDisplay(event) {
  event.preventDefault();

  if (isSearching) {
    return;
  }
  if (searchInput.value) {
    isSearching = true;
    fetch("/api/breweries/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        city: searchInput.value,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          displayItems(false);
          return response.json();
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          displayItems(true, data.data);
        }
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });

    setTimeout(() => {
      isSearching = false;
    }, 5000);
  }
}

searchButton.addEventListener("click", searchAndDisplay);
