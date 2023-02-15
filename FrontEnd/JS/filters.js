//    ---- Create JSON CATEGORIES Name from API ----
const jsonFilters = await fetch("http://localhost:5678/api/categories")
    .then(jsonFilters => jsonFilters.json());

//    ---- Create and Display Filters Categories ----
for (let filter of jsonFilters) {
    document.querySelector(".filters").innerHTML +=
    `<button class="btn" type="button" id="${filter.id}">${filter.name}</button>`
};


