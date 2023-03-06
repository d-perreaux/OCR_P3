/* 
    ---- Handle Display of the Welcome Page ----
*/

import { generateWorks, Work } from "./JS/works.js";
import { Auth } from "./JS/auth.js";
import { addListenerFilters, displayGeneratedFilters } from "./JS/filters.js";

/**
 * Class representing the addition of a work
 * @constructor
 * @param {HTMLFormElement} form - the form elements to add a work
 * @param {Array} fields - Array of field elements 
 * @param {formData} formData - Prepare an empty formData for the API call
 */
class AddWork {
    constructor(form, fields) {
        this.form = form;
        this.fields = fields;
        this.formData = new FormData();
    }

    /**
     * @method
     * @returns {Object} - the configuration object used for adding a work
     */
    getPostWorkAPIConfigObject() {
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

/**
 * add eventListeners on all trash icons
 * event : get the id associated with the icon
 * then : deletes a work from the API and removes it from the DOM
 * @async
 * @function deleteWorkAPI
 * @param {number} id - the ID of the work to be deleted
 */

function addListenersToDeleteWork() {
    const trashesList = document.querySelectorAll(".fa-trash-can");
    trashesList.forEach(trashe => {
        trashe.addEventListener("click", () => {
            // html icon id = "work-number-${item.id}"
            // split the string to just keep id as an integer
            let workIdString = trashe.getAttribute('id');
            let workIdStringSplit = workIdString.split("work-number-");
            let workId = parseInt(workIdStringSplit[1]);
            deleteWorkAPI(workId);
        })
    })
}

/**
 * Deletes a work with the given ID from the database using the delete method
 * if database answer is ok : 
 * Updates the UI by removing the deleted work from both the gallery and modal
 * @async
 * @function deleteWorkAPI
 * @param {number} id - the ID of the work to be deleted
 * @returns {Promise} A promise representing the completion of the operation
 */
async function deleteWorkAPI(id) {
    fetch(`http://localhost:5678/api/works/${id}`,
        getDeleteAPIConfigObject())
        .then((response) => {
            if (response.status === 204) {
                const elementToDeleteGallery = document.getElementById(`work-${id}`);
                const gallery = elementToDeleteGallery.parentNode;
                gallery.remove();

                const elementTodeleteModalContent = document.getElementById(`work-number-${id}`);
                const parentElementTodeleteModalContent = elementTodeleteModalContent.closest(".div-wrapper");
                parentElementTodeleteModalContent.remove();

                listWorks = listWorks.filter(work => work.id !== id)
            }
        })
}

/**
 * Returns a configuration object for making a DELETE request to the API
 * @function
 * @returns {Object} - The configuration object for tje DELETE request
 */
function getDeleteAPIConfigObject() {
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

/**
 * Displays the image selected by the user in the form :
 * - Adds an event listener to the input element (listens for the change)
 * - If a file is selected, creates a FileReader object to read the image file
 *   then displays it in the form.
 *   Replaces the previous display of the label with the newly selected image
 */
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

/**
 * Adds a click event listener which opens the modal for adding a new work
 * deletes the previous modal content and generates new content for the modal
 * Adds a form with :
 *  - fields to add a new work to the database
 *  - button to submit the form
 * Adds an event listener to the submit button that collects the form data
 *  then makes an API req to add the new work
 */
async function addListenerToOpenModalAddWork() {
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
                    <p id="button-add-picture">+ Ajouter photo</p>
                    <p>jpg, png : 4mo max</p>
                </label>
                <input type="file" id="imageUrl" name="imageUrl" accept=".jpg, .png" style="display: none">
            </div>
            <div class="error-message" id="error-image"></div>
            <label for="title">Titre</label><br> 
            <input type="text" name="title" id="title" required>
            <div class="error-message" id="error-title"></div>
            <label for="category">Catégorie</label>
            <select id="category" name="category">
            <option selected></option>
            <option value="1">Objets</option>
            <option value="2">Appartements</option>
            <option value="3">Hotels & restaurants</option>
            </select>
            <div class="error-message" id="error-category"></div>
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
            const imageUrl = document.querySelector("#imageUrl").files[0]
            const titleValue = document.querySelector("#title").value;
            const categoryValue = parseInt(document.querySelector("#category").value)
            checkValidityFormInputs(imageUrl, titleValue, categoryValue);

            if (checkValidityFormInputs(imageUrl, titleValue, categoryValue)) {
                // Create instance of Work to add it through API call
                const fields = ["imageUrl", "title", "category"];
                const workToAdd = new AddWork(formAddWorkSubmit, fields);
                workToAdd.formData.append("image", imageUrl);
                workToAdd.formData.append("title", titleValue);
                workToAdd.formData.append("category", categoryValue);


                fetch("http://localhost:5678/api/works",
                    workToAdd.getPostWorkAPIConfigObject())
                    .then(async (response) => {
                        if (response.status === 201) {
                            displayWorkAdded();
                        } else {
                            addListenerToOpenModalAddWork();
                        };
                    })
            }
        });
    })
}


/**
 * Function which check the validity of the addWork form inputs
 * Display an error message if input not valid
 * @function
 * @param {File} fileImage - the first item of the array<File>
 * @param {string} title - the title of the new work
 * @param {number} categoryId - the id of the category
 * @returns {boolean}
 */
function checkValidityFormInputs(fileImage, title, categoryId) {
    if (!fileImage) {
        document.getElementById("error-image").innerText = "Veuillez ajouter une image.";
        document.getElementById("error-title").innerText = "";
        document.getElementById("error-category").innerText = "";
        return false;

    } else if (!title) {
        document.getElementById("error-image").innerText = "";
        document.getElementById("error-title").innerText = "Veuillez ajouter un titre.";
        document.getElementById("error-category").innerText = "";
        return false;

    } else if (!categoryId) {
        document.getElementById("error-image").innerText = "";
        document.getElementById("error-title").innerText = "";
        document.getElementById("error-category").innerText = "Veuillez sélectionner une catégorie.";
        return false;

    } else {
        return true;
    }
}


/**
 * Fetchs the list of works from the API and gets the last added.
 * Then :
 *  - add it to the DOM of .gallery,
 *  - update the list of works and update the modal menu
 * @async
 */
async function displayWorkAdded() {
    const newlistWorks = await fetch("http://localhost:5678/api/works")
        .then(newlistWorks => newlistWorks.json());
    const lastWork = newlistWorks.slice(-1)[0];
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

    listWorks = newlistWorks;
    updateModalMenuContent();
}

function updateModalMenuContent() {
    document.querySelector(".modal").style.display = "none";
    deleteModalContent();
    openModalMenu();
}

/**
 * Removes the content of the modal, including
 * the title, content and footer.
 * Removes the eventListeners attached to the modal
 */
function deleteModalContent() {
    document.querySelector(".modal-title h3").innerHTML = "";
    const wrapperModalMenuContent = document.querySelector(".modal-content");
    while (wrapperModalMenuContent.firstChild) {
        wrapperModalMenuContent.removeChild(wrapperModalMenuContent.firstChild);
    }
    document.querySelector(".modal-footer").innerHTML = "";
    document.querySelector(".wrapper-modal").removeEventListener("click", function (e) {
        e.stopPropagation();
    });
    document.querySelector(".modal").removeEventListener("click", addListenerToCloseModal(".close-modal"));
}

/**
 * Adds a listener to a modal close button, 
 * which closes the modal and delete its content.
 * @param {string} element - The CSS selector for the modal close button
 */
function addListenerToCloseModal(element) {
    const modalButton = document.querySelector(element);
    const target = document.querySelector(".modal");
    modalButton.addEventListener("click", function (e) {
        //close the modal
        target.style.display = "none";
        deleteModalContent();
    })
}


function generateDisplayModalMenuTitle(title) {
    const modalTitle = document.querySelector(".modal-title h3");
    modalTitle.innerText = title;
}

/**
 * Generates the content of the "menu" modal window including :
 * - pictures of the work, 
 * - icons to delete and to move(no fonctionnal) a work,
 * - button to add a work
 */
function generateDisplayModalMenuContent() {
    const modalContent = document.querySelector(".modal-content");

    //add the wrapper with grid property
    const wrapperModalMenuContent = document.createElement("div");

    wrapperModalMenuContent.classList.add("wrapper-modal-content");
    modalContent.appendChild(wrapperModalMenuContent);

    //generate the content of <.wrapper-modal-content>: 
    // - picture of the works
    // - icons on each picture
    for (let item of listWorks) {
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
    // add listeners on trash icons to delete a work thanx to his ID
    addListenersToDeleteWork();
}

function changeDisplayModaltoFlex(target) {
    target.style.display = "flex";
}

/**
 * Opens the modal menu and sets :
 *  - the necessary content,
 *  - event listeners to close the modal
 *  - event listener to change the content of the modal to add a work
 */
function openModalMenu() {
    const target = document.querySelector(".modal");
    changeDisplayModaltoFlex(target);
    generateDisplayModalMenuTitle("Galerie photo");
    generateDisplayModalMenuContent();
    //    ---- addListenerToCloseModal from button
    target.addEventListener("click", addListenerToCloseModal(".close-modal"));
    //    ---- addListenerToCloseModal from shadowed modal page
    target.addEventListener("click", addListenerToCloseModal(".modal"));
    //    ---- prevent propagation of the click to the internal modal
    document.querySelector(".wrapper-modal").addEventListener("click", function (e) {
        e.stopPropagation();
    })
    addListenerToOpenModalAddWork();
}

function addListenerOpenModal(element) {
    const buttonOpenModal = document.querySelector(element);

    buttonOpenModal.addEventListener("click", function (e) {
        openModalMenu();
    })
}


/**
 * Create JSON Datas from API
 */
let listWorks = await fetch("http://localhost:5678/api/works")
    .then(listWorks => listWorks.json());

/**
 * Initial Display of .gallery: complete WorksList
 */
generateWorks(listWorks);

/**
 * FILTERS
 */

displayGeneratedFilters(listWorks);

//    ---- Change the Display of the selected filter button ----
//    ---- Display of .gallery according to the filter selected ----
addListenerFilters(listWorks);


/**
 * AUTH
 */

//    ---- Store the userId when Login complete ----
let userId = window.sessionStorage.getItem("userId");

if (userId != "" && userId != null) {
    new Auth(userId);
    addListenerOpenModal("#gallery-modal-button");
};

