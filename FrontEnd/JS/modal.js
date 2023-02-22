
import { Work } from "./works.js";
//    ---- Add EventListener which open Modal ----


//    ---- Add EventListener which close Modal ----
function closeModal(element) {
    const modalButton = document.querySelector(element);
    const target = document.querySelector(".modal");
    modalButton.addEventListener("click", function (e) {
        target.style.display = "none";
        document.querySelector(".modal-title h3").innerHTML = "";
        document.querySelector(".wrapper-modal-menu-content").innerHTML = "";
        modalButton.removeEventListener("click", closeModal(element));
        document.querySelector(".wrapper-modal").removeEventListener("click", function (e) {
            e.stopPropagation();
        });
        target.removeEventListener("click", closeModal(".close-modal"));
    })
}

function generateDisplayModalMenuTitle(title) {
    const modalTitle = document.querySelector(".modal-title h3");
    modalTitle.innerText = title;
}

function generateDisplayModalMenuContent(list) {
    const modalContent = document.querySelector(".modal-content");
    modalContent.innerHTML = `<div class="wrapper-modal-menu-content"></div>`;
    const wrapperModalMenuContent = document.querySelector(".wrapper-modal-menu-content");
    for (let item of list) {
        let workClass = new Work(item);
        wrapperModalMenuContent.innerHTML += `
        <div>
            <div class="wrapper-img">
                <img src=${item.imageUrl} alt="${item.title}">
                <div class="icon-wrapper">
                    <div class="icon-container move-position">
                        <i class="fa-solid fa-up-down-left-right fa-sm"></i>
                    </div>
                    <div class="icon-container">
                        <i class="fa-solid fa-trash-can fa-sm"></i>
                    </div>
                </div>
        </div>
        <span>éditer</span>
    `
    }
}

function openModalAddWork() {
    const buttonOpenModalAddWork = document.querySelector("#open-modal-add-work");
    buttonOpenModalAddWork.addEventListener("click", (e) => {
        document.querySelector(".modal-title h3").innerHTML = "";
        document.querySelector(".wrapper-modal-menu-content").innerHTML = "";
        generateDisplayModalMenuTitle("Ajout photo");
        const modalContent = document.querySelector(".modal-content");
        modalContent.innerHTML = `<div class="wrapper-modal-add-work-content"></div>`;
        const wrapperModalAddWorkContent = document.querySelector(".wrapper-modal-add-work-content");
        wrapperModalAddWorkContent.innerHTML += `
        <form>
        <label for="imageUrl">+ Ajouter photo</label>
        <input type="file" id="imageUrl" name="imageUrl" accept=".jpg, .png">
        <label for="title">Titre</label><br> 
        <input type="text" name="title" id="title" required>
        </form>
        `
    })
}


export function openModal(element, list) {
    const modalButton = document.querySelector(element);
    const target = document.querySelector(".modal");

    modalButton.addEventListener("click", function (e) {
        target.style.display = "flex";
        generateDisplayModalMenuTitle("Galerie photo");
        generateDisplayModalMenuContent(list);
        //    ---- closeModal from button
        target.addEventListener("click", closeModal(".close-modal"));
        //    ---- closeModal from shadowed modal page
        target.addEventListener("click", closeModal(".modal"));
        //    ---- prevent propagation of the click to the internal modal
        document.querySelector(".wrapper-modal").addEventListener("click", function (e) {
            e.stopPropagation();
        })
        openModalAddWork();
    })
}


