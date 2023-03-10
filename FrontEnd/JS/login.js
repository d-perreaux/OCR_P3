/**
 * Handle VERIFICATION and INTERACTIONS of LOGIN FORM
 * Load the Auth Token in the Local Storage
 **/

/**
 * Represents a login form and provides validation and submission functionnality
 * 
 * @class
 * @param {HTMLElement} form - The login formButton element
 * @param {string[]} fields - An Array of field names to validate
 */
class Login {
    constructor(form) {
        this.form = form;
        this.validateOnSubmit();
        this.data = { email: "", password: "" };
        this.token = "";
    }

    /**
     * Set post configuration
     * @returns Generates the configuration object for the login API req
     * @returns {object}
     */
    postAPI() {
        return {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.data)
        }
    }

    /**
     * Checks the validity of the email
     * if valid : complete the dataform
     * if !valid : display the error message
     * @method
     * @returns {boolean} - 'true' if the email field.value is valid
     */
    checkValidityEmail() {
        document.getElementById("email-error").innerText = "";
        const inputEmail = document.querySelector(`#email`);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(inputEmail.value)) {
            this.data.email = inputEmail.value;
        } else {
            document.getElementById("email-error").innerText =
                "Veuillez saisir email valide.";
        }
        return emailRegex.test(inputEmail.value);
    }

    /**
     * Checks the validity of the password
     * if valid : complete the dataform
     * if !valid : display the error message
     * @method
     * @returns {boolean} - 'true' if the passeword field.value is valid
     */
    checkValidityPassword() {
        document.getElementById("password-error").innerText = "";
        const inputPassword = document.querySelector(`#password`);
        const passwordRegex = /^\S+$/;
        if (passwordRegex.test(inputPassword.value)) {
            this.data.password = inputPassword.value;
        } else {
            document.getElementById("password-error").innerText =
                "Veuillez saisir un mot de passe valide.";
        }
        return passwordRegex.test(inputPassword.value);

    }
    /**
     * Adds eventListener on the form submit button
     * Submits the login data to the API if all fields are valid
     */
    validateOnSubmit() {
        this.form.addEventListener("click", (e) => {
            e.preventDefault();
            let validEmail = this.checkValidityEmail();
            let validPassword = this.checkValidityPassword();
            if (validEmail && validPassword) {
                fetch("http://localhost:5678/api/users/login",
                    this.postAPI())
                    .then(response => {
                        if (response.status === 404) {
                            const elementMessage = document.querySelector("#error-login");
                            elementMessage.innerText = "Email et/ou Mot de passe non reconnus.";
                        } 
                        if (response.status === 401) {
                            const elementMessage = document.querySelector("#error-login");
                            elementMessage.innerText = "Erreur dans l’identifiant ou le mot de passe.";
                        }
                        if (response.status === 200) {
                            response.json().then(response => {
                                const storageToken = response.token;
                                const storageUserId = response.userId;
                                window.sessionStorage.setItem("token", storageToken);
                                window.sessionStorage.setItem("userId", storageUserId);
                                window.location.href = "./index.html";
                            })
                        }
                    }
                    )
            }
        })
    }
}

const formSubmit = document.querySelector("#login-submit");
new Login(formSubmit);
