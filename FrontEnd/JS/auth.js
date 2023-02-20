export class Auth {
    //    ---- Add auth.css
    static addAuthCss() {
        const linkCss = document.createElement("link")
        linkCss.setAttribute("rel", "stylesheet");
        linkCss.setAttribute("href", "./assets/auth.css");
        document.querySelector("head").appendChild(linkCss);
    }

    //    ---- Change display of last link of nav
    static generateAuthDisplay() {
        const logout = document.getElementById("log");
        logout.innerText = "logout";
    }

    //    ---- last link of nav : preventDefault() ----
    //    ---- last link of nav : addEventListener ----
    //    ---- clear sessionStorage ----
    static getLogout() {
        const logout = document.getElementById("log");
        logout.addEventListener("click", (e) => {
            e.preventDefault();
            //    ---- delete the token and id of auth ----
            window.sessionStorage.clear();
            window.location.href = "./index.html";
        })
    }

    //    ---- Add top-header ----
    static homeDisplayTopHeader() {
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
    static homeDisplayDivModify() {
        let wrapperModifyElements = `
        <div class="wrapper-auth-modify">
            <div><i class="fa-regular fa-pen-to-square fa-lg"></i></div>
            <div type="button">modifier</div>
        </div>
        `; 
        document.querySelector("#introduction").insertAdjacentHTML('afterend', wrapperModifyElements);
        document.querySelector("#portfolio div h2").insertAdjacentHTML('afterend', wrapperModifyElements);
        
    
}
}