import { generateWorks } from "./works.js";

/**
 * Create a set of uniques Id from an array of Works
 * Use this set to create an array of objects {id: categoryName}
 * @param {object[]} array An array of all the works from the API req
 * @returns {object[]} An array of objects representing unique categories 
 *                      associated with his category name
 */
function createUniqueCategoriesList(array) {
    /**
     * Extracts an array of categories ID from the given array
     * @type {number[]}
     */
    let arrayIdCategories = array.map(work => work.category.id);

    /**
     * Creates a set of unique categories ID
     * @type {Set<number>}
     */
    let setCategoriesId = new Set(arrayIdCategories);

    /**
     * Extracts an array of category objects from the given list
     * @type {object[]} object: {id: categoryName}
     */
    let arrayObjectCategories = array.map(work => work.category);

    /**
     * Creates an array of unique IDs by spreading the set
     * @type {object[]}
     */
    let uniqueCategories = [...setCategoriesId].map(id => {
        /**
         * Creates objects into that array:
         * Unique object {id : categoryName} using the array of unique IDs
         * and the array of objects {id: categoryName}
         */
        let uniqueCategoryObject = arrayObjectCategories.find(cat =>
            cat.id === id);
        return { id: id, name: uniqueCategoryObject.name };
    }
    )
    return uniqueCategories;
}

/**
 * Generates and displays filters categories
 * @param {object[]} array An array of unique objects {id: categoryName}
 */
export function displayGeneratedFilters(array) {
    let arrayUniqueCategories = createUniqueCategoriesList(array);
    //    ---- Create and Display Filters Categories ----
    for (let category of arrayUniqueCategories) {
        document.querySelector(".filters").innerHTML +=
        `<button class="btn" type="button" id="${category.id}">${category.name}</button>`;
    }
}

/**
 * Adds eventListeners to filter buttons
 * Then create of filtered array according to the filter id clicked
 * Display that array
 * @param {object[]} arrayWorks Array of objects representing instances of Work
 */
export function addListenerFilters(arrayWorks) {
    const filterButtonList = document.querySelectorAll(".filters .btn");

    for (let i = 0; i < filterButtonList.length; i++) {
        filterButtonList[i].addEventListener("click", function (event) {
            // Select which filter button is active
            filterButtonList.forEach((button) => button.classList.remove("active"));
            event.target.classList.add("active");
            const filteredarrayWorks = arrayWorks.filter(function (arrayWorks) {
                if (event.target.id) {
                    // Array is filtered according to the category id
                    return arrayWorks.categoryId == event.target.id;
                }
                // Case first load of the page or 'all' filter selected
                // The array is not filtered
                return true;
            })

            generateWorks(filteredarrayWorks);
        })
    }
}
