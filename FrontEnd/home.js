/* 
    ---- Handle Display of the Welcome Page ----
*/

//    ---- Import Class Work ----
import { Work } from "./JS/works.js";

//    ---- Create JSON Datas from API ----
const ListWorks = await fetch("http://localhost:5678/api/works")
    .then(ListWorks => ListWorks.json());


//    ---- Function() : create instances of class Work to Display them on the Browser ----
function generateWorks(List) {
    document.querySelector(".gallery").innerHTML = "";
    for (let work of List) {
        let workClass = new Work(work);
        document.querySelector(".gallery").innerHTML += `
    <figure>
        <image src="${workClass.imageUrl}" alt="${workClass.title}"></image>
        <figcaption>${workClass.title}</figcaption>
    </figure>`
    };
}


//    ---- Function() : Filters LISTENERS ----
function addListernerFilters(ListWorks) {
    const filterButtonList = document.querySelectorAll(".filters .btn");

    for (let i = 0; i < filterButtonList.length; i++) {
        filterButtonList[i].addEventListener("click", function (event) {
            //    ---- Select which filter button is active ----
            filterButtonList.forEach((button) => button.classList.remove("active"));
            event.target.classList.add("active");
            const filteredListWorks = ListWorks.filter(function (ListWorks) {
                //    ---- Case first load of the page OR All Filter Selected ----
                if (event.target.id === "") {
                    console.log(event.target.id);
                    //    ---- Filter don't modify the List ----
                    return true;
                } else {
                    //    ---- List is filtered according to the category ----
                    return ListWorks.categoryId == event.target.id;
                }
            });

            //    ---- Class the function which create instances of Work
            //         to display them ----
            generateWorks(filteredListWorks);
        })
    };
}

//    ---- Initial Display of .gallery: complete WorksList ----
generateWorks(ListWorks);

//    ---- Change the Display of the selected filter button ----
//    ---- Display of .gallery according to the filter selected ----
addListernerFilters(ListWorks);


//    ---- Store the userId when Login complete ----
let userId = window.sessionStorage.getItem("userId");

//    ---- 
if (userId != "" && userId != null) { console.log(userId) };


