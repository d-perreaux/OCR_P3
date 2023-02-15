import { Work } from "./works.js";

/* 
    ---- Handle Display of the Welcome Page -----
*/

const jsonListWorks = await fetch("http://localhost:5678/api/works")
    .then(jsonListWorks => jsonListWorks.json());

/*
----- Create instances of Work to Displan them on the Browser ----
*/

for (let jsonWork of jsonListWorks) {
    let work = new Work(jsonWork);
    document.querySelector(".gallery").innerHTML += `
    <figure>
        <image src="${work.imageUrl}" alt="${work.title}"></image>
        <figcaption>${work.title}</figcaption>
    </figure>`
};

