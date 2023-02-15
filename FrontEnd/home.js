/* 
    ---- Handle Display of the Welcome Page ----
*/

//    ---- Import Class Work ----
import { Work } from "./JS/works.js";

//    ---- Create JSON Datas from API ----
const jsonListWorks = await fetch("http://localhost:5678/api/works")
    .then(jsonListWorks => jsonListWorks.json());

//    ---- Function : create instances of class Work to Display them on the Browser ----
function generateWorks(jsonList) {
    document.querySelector(".gallery").innerHTML = "";
    for (let jsonWork of jsonList) {
        let work = new Work(jsonWork);
        document.querySelector(".gallery").innerHTML += `
    <figure>
        <image src="${work.imageUrl}" alt="${work.title}"></image>
        <figcaption>${work.title}</figcaption>
    </figure>`
    };
}

//    ---- Function : Filters LISTENERS ----
function addListernerFilters(jsonListWorks) {
    const filterButtonList = document.querySelectorAll(".filters .btn");

    for (let i = 0; i < filterButtonList.length; i++) {
        filterButtonList[i].addEventListener("click", function (event) {
            filterButtonList.forEach((button) => button.classList.replace("btn-active", "btn"));
            event.target.classList.replace("btn", "btn-active");
            const filteredJsonListWorks = jsonListWorks.filter(function (jsonListWorks) {
                //    ---- Case first load of the page OR All Filter Selected ----
                //    ---- Filter don't modify the List ----
                if (event.target.id == 0) {
                    return true;
                } else {
                //    ---- List is filtered according to the category ----
                    return jsonListWorks.categoryId == event.target.id;
                }
            });
            generateWorks(filteredJsonListWorks);
        })
    };
}

//    ---- Initial Display of .gallery: complete WorksList ----
generateWorks(jsonListWorks);

//    ---- Display of .gallery according to the filter selected ----
addListernerFilters(jsonListWorks);

