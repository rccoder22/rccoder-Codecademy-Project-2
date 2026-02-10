async function getAllFavorites() {
  let finalData = {};
  await fetch("/api/users/favorites", {
    method: "POST",
    body: {
      userId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Get favorites response status ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      finalData = data;
    })
    .catch((error) => {
      console.log(error);
    });
  return finalData;
}

document.addEventListener("DOMContentLoaded", () => {
  const data = getAllFavorites();

  console.log(data);
});
