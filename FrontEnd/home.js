/* 
    ---- Handle Display of the Welcome Page ----
*/
import { addListernerFilters, generateWorks } from "./JS/works.js";
import { Auth } from "./JS/auth.js";
import { Work } from "./JS/works.js";


class AddWork {
    constructor(form, fields) {
        this.form = form;
        this.fields = fields;
        // this.validateOnSubmit();
        this.formData = new FormData();
    }

    postWorkAPI() {
        let token = window.sessionStorage.getItem("token")
        let configurationObject = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "accept": "application/json"
            },
            body: this.formData
        };
        return configurationObject;
    }
}


function getIdWorkToDelete() {
    const trashesList = document.querySelectorAll(".fa-trash-can");
    trashesList.forEach(trashe => {
        trashe.addEventListener("click", () => {
            // html icon id = "work-number-${item.id}"
            // split the string to just keep id as an integer
            let workIdString = trashe.getAttribute('id');
            let workIdStringSplit = workIdString.split("work-number-");
            let workId = parseInt(workIdStringSplit[1]);
            deleteWorksAPI(workId);
        })
    })
}


async function deleteWorksAPI(id) {
    fetch(`http://localhost:5678/api/works/${id}`,
        createReqDeleteAPI())
        .then((response) => {
            if (response.status === 204) {
                const elementToDeleteGallery = document.getElementById(`work-${id}`);
                const gallery = elementToDeleteGallery.parentNode;
                gallery.remove();
                const elementToDeleteModal = document.getElementById(`work-number-${id}`);
                const parentElementToDeleteModal = elementToDeleteModal.closest(".div-wrapper");
                parentElementToDeleteModal.remove();
            }
        })
}


function createReqDeleteAPI() {
    let token = window.sessionStorage.getItem("token")
    let configurationObject = {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    };
    return configurationObject;
}


//    ---- Add EventListener which close Modal ----
function closeModal(element) {
    const modalButton = document.querySelector(element);
    const target = document.querySelector(".modal");
    modalButton.addEventListener("click", function (e) {
        //close the modal
        target.style.display = "none";
        //delete the modal content

        document.querySelector(".modal-title h3").innerHTML = "";
        const wrapperModalMenuContent = document.querySelector(".modal-content");
        while (wrapperModalMenuContent.firstChild) {
            wrapperModalMenuContent.removeChild(wrapperModalMenuContent.firstChild);
        }
        document.querySelector(".modal-footer").innerHTML = "";
        //remove the closeListeners
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

    //add the wrapper with grid property
    const wrapperModalMenuContent = document.createElement("div");

    wrapperModalMenuContent.classList.add("wrapper-modal-content");
    modalContent.appendChild(wrapperModalMenuContent);

    //generate the content of <.wrapper-modal-content>: 
    // - picture of the works
    // - icons on each picture
    for (let item of list) {
        const divWrapper = document.createElement("div");
        const divImgWrapper = document.createElement("div");
        const img = document.createElement("img");
        const divIconWrapper = document.createElement("div");
        const divMovePosition = document.createElement("div");
        const iconMovePosition = document.createElement("i");
        const divIconContainer = document.createElement("div");
        const iconTrashCan = document.createElement("i");
        const spanEdit = document.createElement("span");

        divWrapper.appendChild(divImgWrapper);
        divImgWrapper.appendChild(img);
        divImgWrapper.appendChild(divIconWrapper);
        divIconWrapper.appendChild(divMovePosition);
        divMovePosition.appendChild(iconMovePosition);
        divIconWrapper.appendChild(divIconContainer);
        divIconContainer.appendChild(iconTrashCan);
        divWrapper.appendChild(spanEdit);
        wrapperModalMenuContent.appendChild(divWrapper);

        divWrapper.classList.add("div-wrapper");
        divImgWrapper.classList.add("wrapper-img");
        divIconWrapper.classList.add("icon-wrapper");
        divMovePosition.classList.add("icon-container", "move-position");
        iconMovePosition.classList.add("fa-solid", "fa-up-down-left-right", "fa-sm");
        divIconContainer.classList.add("icon-container");
        iconTrashCan.classList.add("fa-solid", "fa-trash-can", "fa-sm");
        iconTrashCan.setAttribute("id", `work-number-${item.id}`);
        img.setAttribute("src", item.imageUrl);
        img.setAttribute("alt", item.title);
        spanEdit.textContent = "éditer";
    }

    //generate the content of <.modal-footer>:
    document.querySelector(".modal-footer").innerHTML += `
        <div class="bottom-border"></div>
		<button id="open-modal-add-work">Ajouter une photo</button>
        <div id="delete-gallery">Supprimer la galerie</div>
        `

    // Function to delete to works
    getIdWorkToDelete();
}


function displayFormImageSelected() {
    const input = document.getElementById('imageUrl');
    const label = document.querySelector('.custom-file-upload');

    // add EventListener "when the file is selected"
    input.addEventListener('change', function () {
        // check if a file is selected
        if (input.files && input.files[0]) {
            // create Object FileReader()
            const reader = new FileReader();

            // add listener to detect the end of the display of the image
            reader.onload = function (e) {
                // Create the image
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '50%';

                // Replace the display of the Label
                label.innerHTML = '';
                label.appendChild(img);
            };

            // Read the picture selected
            reader.readAsDataURL(input.files[0]);
        }
    });
}


async function openModalAddWork() {
    //add listener on the button which open "ajouter une photo" of the previous <.modal-footer> content
    const buttonOpenModalAddWork = document.querySelector("#open-modal-add-work");
    buttonOpenModalAddWork.addEventListener("click", async (e) => {
        // Delete the prevous modal content
        document.querySelector(".modal-title h3").innerHTML = "";
        document.querySelector(".modal-footer").innerHTML = "";
        generateDisplayModalMenuTitle("Ajout photo");
        // generate the content of <.modal-content>:
        // - form to add a word to the datas
        const modalContent = document.querySelector(".modal-content");
        modalContent.innerHTML = `<div class="wrapper-modal-addwork-content"></div>`;
        const wrapperModalAddWorkContent = document.querySelector(".wrapper-modal-addwork-content");
        wrapperModalAddWorkContent.innerHTML += `
        <form id="add-form">
            <div class="wrapper-form-img">
                <label for="imageUrl" class="custom-file-upload">
                    <i class="fa-regular fa-image fa-4x"></i>
                    <p id="button-ad-picture">+ Ajouter photo</p>
                    <p>jpg, png : 4mo max</p>
                </label>
                <input type="file" id="imageUrl" name="imageUrl" accept=".jpg, .png" style="display: none">
            </div>
            <label for="title">Titre</label><br> 
            <input type="text" name="title" id="title" required>
            <label for="category">Catégorie</label>
            <select id="category" name="category">
            <option value="" selected></option>
            <option value="1">Objets</option>
            <option value="2">Appartements</option>
            <option value="3">Hotels & restaurants</option>
            </select>
        </form>
        `
        //Replace the label by the image selected
        displayFormImageSelected()

        // generate the content of <.modal-footer>:
        // - button <#open-modal-add-work> linked to the previous form
        document.querySelector(".modal-footer").innerHTML = `
        <div class="bottom-border"></div>
		<button id="open-modal-add-work" type="submit" form:"add-form">Valider</button>`
        const formAddWorkSubmit = document.querySelector("#open-modal-add-work")
        // add EventListener() to this button :
        // - preventDefault()
        // - collect the data of the form
        // - API call (Work/Post)
        formAddWorkSubmit.addEventListener("click", async function (e) {
            e.preventDefault();
            // let inputsList = document.querySelectorAll("#add-form input");
            // let valid = true;
            // for (let input of inputsList) {

            // }
            // Creat instance of Work to add it through API call
            const fields = ["imageUrl", "title", "category"];
            const workToAdd = new AddWork(formAddWorkSubmit, fields);
            workToAdd.formData.append("image", document.querySelector("#imageUrl").files[0]);
            workToAdd.formData.append("title", document.querySelector("#title").value);
            workToAdd.formData.append("category", parseInt(document.querySelector("#category").value));

            fetch("http://localhost:5678/api/works",
                workToAdd.postWorkAPI())
                .then((response) => {
                    if (response.status === 201) {
                        displayAddWorkInGallery();
                    } else {
                        openModalAddWork();
                    };
                });
        });
    })

}


async function displayAddWorkInGallery() {
    const newListWorks = await fetch("http://localhost:5678/api/works")
        .then(newListWorks => newListWorks.json());
    const lastWork = newListWorks.slice(-1)[0];
    let workClass = new Work(lastWork);
    const gallery = document.querySelector('.gallery');

    const figure = document.createElement('figure');
    const image = document.createElement('img');
    const figcaption = document.createElement('figcaption');

    image.src = workClass.imageUrl;
    image.alt = workClass.title;
    image.id = `work-${workClass.id}`;
    figcaption.textContent = workClass.title;

    figure.appendChild(image);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
}


function openModal(element, list) {
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


//    ---- Create JSON Datas from API ----
let ListWorks = await fetch("http://localhost:5678/api/works")
    .then(ListWorks => ListWorks.json());

//    ---- Initial Display of .gallery: complete WorksList ----
generateWorks(ListWorks);

//    ---- Change the Display of the selected filter button ----
//    ---- Display of .gallery according to the filter selected ----
addListernerFilters(ListWorks);


//    ---- Store the userId when Login complete ----
let userId = window.sessionStorage.getItem("userId");

if (userId != "" && userId != null) {
    Auth.addAuthCss();
    Auth.generateAuthDisplay();
    Auth.getLogout();
    Auth.homeDisplayTopHeader();
    Auth.homeDisplayDivModify();
    openModal("#gallery-modal-button", ListWorks);
};