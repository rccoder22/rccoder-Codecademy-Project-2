const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");

let isSearching = false;
let isSaving = false;

function saveButtonFavorite(decision, id) {
  if (!isSaving) {
    isSaving = true;

    if (decision) {
      fetch("/api/users/favorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          obd_id: id,
          user_id: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a",
        }),
      })
        .then((response) => {
          if (!response.ok) {
            console.log("Response is ", response.status);
            return null;
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            console.log("Favorite", data.data.id, "Saved!");
          }
        })
        .catch((error) => {
          console.log("Error:", error);
        });
      // obd_id, user_id
      //console.log("Save: ", id);
    } else {
      fetch("/api/users/favorite", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          obd_id: id,
          user_id: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a",
        }),
      })
        .then((response) => {
          if (!response.ok) {
            console.log("Response is ", response.status);
            return null;
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            console.log("Favorite", data.data.id, "Deleted!");
          }
        })
        .catch((error) => {
          console.log("Error:", error);
        });
      console.log("Delete: ", id);
    }
    isSaving = false;
  }
}

function displayItems(hasItems, data = {}) {
  results.replaceChildren();
  if (data && hasItems) {
    const mainList = document.createElement("ul");
    // Iterate over brewery data and put out to the screen
    data.map((brewery) => {
      const breweryName = brewery.name.replace(/[^a-zA-Z0-9 ]/g, "");
      const postalCode = brewery.postal_code.slice(0, 5);
      const listItem = document.createElement("li");
      const searchListDiv = document.createElement("div");
      const nameDiv = document.createElement("div");
      const buttonDiv = document.createElement("div");
      nameDiv.innerHTML = `
        <h2><a href="/search/1?bn=${brewery.id}">${breweryName}</a></h2>
        <br />
        <p>${brewery.address_1 || ""}<br />${brewery.city}, ${brewery.state_province} ${postalCode}<br /><br />
        <a href="${brewery.website_url || "#"}" target="_blank">${breweryName} Website</a></p>
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
        // console.log(`Favorite Id: ${favoriteButton.dataset.info}`);
        favoriteButton.classList.toggle("is-favorited");

        const buttonId = favoriteButton.dataset.info;

        if (buttonId && favoriteButton.classList.contains("is-favorited")) {
          saveButtonFavorite(true, buttonId);
        } else {
          saveButtonFavorite(false, buttonId);
        }
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
        } else {
          displayItems(false);
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
