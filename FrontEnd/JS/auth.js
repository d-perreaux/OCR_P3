/**
 * Class representing authentification functionalities
 * @class
 * @constructor
 * @param {number} userId - The user ID when login
 */
export class Auth {

    constructor(userId) {
        this.userId = userId;
        this.addAuthCss();
        this.generateAuthDisplay();
        this.getLogout();
        this.homeDisplayTopHeader();
        this.homeDisplayDivModify();
    }
    //    ---- Add auth.css to <head>
    addAuthCss() {
        const linkCss = document.createElement("link")
        linkCss.setAttribute("rel", "stylesheet");
        linkCss.setAttribute("href", "./assets/auth.css");
        document.querySelector("head").appendChild(linkCss);
    }

    //    ---- Change display of last link of nav
    generateAuthDisplay() {
        const logout = document.getElementById("log");
        logout.innerText = "logout";
    }

    //    ---- last link of nav : preventDefault() ----
    //    ---- last link of nav : addEventListener() ----
    //    ---- clear sessionStorage ----
    //    ---- redirects to index.html without auth modifications
    getLogout() {
        const logout = document.getElementById("log");
        logout.addEventListener("click", (e) => {
            e.preventDefault();
            //    ---- delete the token and id of auth ----
            window.sessionStorage.clear();
            window.location.href = "./index.html";
        })
    }

    //    ---- Add top-header ----
    homeDisplayTopHeader() {
        const topHeaderElement = document.createElement("div");
        topHeaderElement.id = "top-header";
        const headerElement = document.querySelector("body header");
        document.querySelector("body").insertBefore(topHeaderElement, headerElement);
        document.querySelector("#top-header").innerHTML += `
    <div><i class="fa-regular fa-pen-to-square fa-lg"></i></div>
    <div>Mode édition</div>
    <div type="button">publier les changements</div>
    `;
    }

    //    ---- Add icon div + modify div
    homeDisplayDivModify() {
        let wrapperModifyElements = `
        <div class="wrapper-auth-modify">
            <div><i class="fa-regular fa-pen-to-square fa-lg"></i></div>
            <div type="button">modifier</div>
        </div>
        `;
        document.querySelector("#introduction").insertAdjacentHTML('afterend', wrapperModifyElements);
       
        // add an id to the modal gallery button
        wrapperModifyElements = `
        <div class="wrapper-auth-modify">
            <div><i class="fa-regular fa-pen-to-square fa-lg"></i></div>
            <div type="button" id="gallery-modal-button">modifier</div>
        </div>
        `;
        document.querySelector("#portfolio div h2").insertAdjacentHTML('afterend', wrapperModifyElements);
    }
}