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
