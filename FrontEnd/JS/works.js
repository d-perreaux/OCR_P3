/**
 * Represents a Work with the properties provided by the API req
 */
export class Work {
    constructor(jsonWork) {
        jsonWork && Object.assign(this, jsonWork);
    }
}

/**
 * Generates HTML from Work properties 
 * Insert them into ".gallery" element
 * @param {object[]} array 
 */
export function generateWorks(array) {
    document.querySelector(".gallery").innerHTML = "";
    for (let work of array) {
        let workClass = new Work(work);
        document.querySelector(".gallery").innerHTML += `
    <figure>
        <image src="${workClass.imageUrl}" alt="${workClass.title}" id="work-${workClass.id}"/>
        <figcaption>${workClass.title}</figcaption>
    </figure>
    `;
    }
}
