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
        console.log(configurationObject)
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
        .then(response => {
            console.log(response.status)
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
        document.querySelector(".wrapper-modal-content").innerHTML = "";
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
    modalContent.innerHTML = `<div class="wrapper-modal-content"></div>`;
    const wrapperModalMenuContent = document.querySelector(".wrapper-modal-content");
    //generate the content of <.wrapper-modal-content>: 
    // - picture of the works
    // - icons on each picture
    for (let item of list) {
        wrapperModalMenuContent.innerHTML += `
        <div>
            <div class="wrapper-img">
                <img src=${item.imageUrl} alt="${item.title}">
                <div class="icon-wrapper">
                    <div class="icon-container move-position">
                        <i class="fa-solid fa-up-down-left-right fa-sm"></i>
                    </div>
                    <div class="icon-container">
                        <i class="fa-solid fa-trash-can fa-sm" id="work-number-${item.id}"></i>
                    </div>
                </div>
        </div>
        <span>éditer</span>
    `
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


function openModalAddWork() {
    //add listener on the button which open "ajouter une photo" of the previous <.modal-footer> content
    const buttonOpenModalAddWork = document.querySelector("#open-modal-add-work");
    buttonOpenModalAddWork.addEventListener("click", (e) => {
        // Delete the prevous modal content
        document.querySelector(".modal-title h3").innerHTML = "";
        document.querySelector(".wrapper-modal-content").innerHTML = "";
        document.querySelector(".modal-footer").innerHTML = "";
        generateDisplayModalMenuTitle("Ajout photo");
        // generate the content of <.modal-content>:
        // - form to add a word to the datas
        const modalContent = document.querySelector(".modal-content");
        modalContent.innerHTML = `<div class="wrapper-modal-content"></div>`;
        const wrapperModalAddWorkContent = document.querySelector(".wrapper-modal-content");
        wrapperModalAddWorkContent.innerHTML += `
        <form id="add-form">
            <div class="wrapper-form-img>
                <label for="imageUrl" class="custom-file-upload">
                <i class="fa-regular fa-image"></i>
                <input type="file" id="imageUrl" name="imageUrl" accept=".jpg, .png">
                <p>jpg, png : 4mo max</p>
                </label>
            </div>
            <label for="title">Titre</label><br> 
            <input type="text" name="title" id="title" required>
            <label for="category">Catégorie</label>
            <select id="category" name="category">
            <option value="1">Objets</option>
            <option value="2">Appartements</option>
            <option value="3">Hotels & restaurants</option>
            </select>
        </form>
        `
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
        formAddWorkSubmit.addEventListener("click", function (e) {
            e.preventDefault();
            if (formAddWorkSubmit) {
                const fields = ["imageUrl", "title", "category"];
                const workToAdd = new AddWork(formAddWorkSubmit, fields);
                workToAdd.formData.append("image", document.querySelector("#imageUrl").files[0]);
                workToAdd.formData.append("title", document.querySelector("#title").value);
                workToAdd.formData.append("category", parseInt(document.querySelector("#category").value));

                fetch("http://localhost:5678/api/works",
                    workToAdd.postWorkAPI())
                    .then(response => {
                        console.log(response.status)
                    });
            }
        });
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


