export class Work {
    constructor(jsonWork) {
        jsonWork && Object.assign(this, jsonWork);
    }
}

//    ---- Function() : create instances of class Work to Display them on the Browser ----
export function generateWorks(List) {
    document.querySelector(".gallery").innerHTML = "";
    for (let work of List) {
        let workClass = new Work(work);
        document.querySelector(".gallery").innerHTML += `
    <figure>
        <image src="${workClass.imageUrl}" alt="${workClass.title}"  id="work-${workClass.id}"></image>
        <figcaption>${workClass.title}</figcaption>
    </figure>`
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
                //    ---- Case first load of the page OR All Filter Selected ----
                if (event.target.id === "") {
                    //    ---- Filter don't modify the List ----
                    return true;
                } else {
                    //    ---- List is filtered according to the category ----
                    return listWorks.categoryId == event.target.id;
                }
            });

            //    ---- Class the function which create instances of Work
            //         to display them ----
            generateWorks(filteredlistWorks);
        })
    };
}

