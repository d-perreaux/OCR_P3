import { generateWorks } from "./works.js";


function createListUniqueCategories(list) {
    let ListIdCategories = list.map(work => work.category.id)
    let ListObjectCategories = list.map(work => work.category)

    let setCategoriesId = new Set(ListIdCategories);

    let uniqueCategories = [...setCategoriesId].map(id => {
        let uniqueCategoryObject = ListObjectCategories.find(cat =>
            cat.id === id);
        return { id: id, name: uniqueCategoryObject.name };
    }
    )
    return uniqueCategories;
}

export function displayGeneratedFilters(list) {
    let listUniqueCategories = createListUniqueCategories(list);
    //    ---- Create and Display Filters Categories ----
    for (let category of listUniqueCategories) {
        document.querySelector(".filters").innerHTML +=
            `<button class="btn" type="button" id="${category.id}">${category.name}</button>`
    };
}

//    ---- Function() : Filters LISTENERS ----
export function addListenerFilters(listWorks) {
    const filterButtonList = document.querySelectorAll(".filters .btn");

    for (let i = 0; i < filterButtonList.length; i++) {
        filterButtonList[i].addEventListener("click", function (event) {
            //    ---- Select which filter button is active ----
            filterButtonList.forEach((button) => button.classList.remove("active"));
            event.target.classList.add("active");
            const filteredlistWorks = listWorks.filter(function (listWorks) {
                if (event.target.id)
                //    ---- List is filtered according to the category id----
                { return listWorks.categoryId == event.target.id }
                else
                //    ---- Case first load of the page or 'all' filter selected ----
                //    ---- The list is not filtered ----
                { return true };
            });

            //    ---- Class the function which create instances of Work
            //         to display them ----
            generateWorks(filteredlistWorks);
        })
    };
}
