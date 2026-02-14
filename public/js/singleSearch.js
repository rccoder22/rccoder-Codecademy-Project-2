const favoriteButton = document.getElementById("favoriteButton");

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
          user_id: "",
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
          user_id: "",
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
            console.log("Favorite Deleted");
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

favoriteButton.addEventListener("click", () => {
  favoriteButton.classList.toggle("is-favorited");

  const buttonId = favoriteButton.dataset.info;

  if (buttonId && favoriteButton.classList.contains("is-favorited")) {
    saveButtonFavorite(true, buttonId);
  } else {
    saveButtonFavorite(false, buttonId);
  }
});
