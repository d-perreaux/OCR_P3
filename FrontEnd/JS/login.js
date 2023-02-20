/**
 * Handle VERIFICATION and INTERACTIONS of LOGIN FORM
 * Load the Auth Token in the Local Storage
 **/

//    ---- Constructor Class Login ----
class Login {
    constructor(form, fields) {
        this.form = form;
        this.fields = fields;
        this.validateOnSubmit();
        this.data = { email: "", password: "" };
        this.token = "";
    }

    //    ---- Method() : Generate the Configuration Object of API call ----
    postAPI() {
        let configurationObject = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.data)
        };
        return configurationObject;
    }

    //    ---- Method() : collect the values of labels ----
    //                reportValidity() of each input of labels
    validateOnSubmit() {
        this.form.addEventListener("click", (e) => {
            e.preventDefault();
            let valid = true;
            for (let field of this.fields) {
                const input = document.querySelector(`#${field}`);
                valid = valid && input.reportValidity();
                if (!valid) {
                    // Stop the checking at the first false test
                    break;
                } else {
                    // If both the inputs are corrects, write this.data
                    if (field === "email") {
                        this.data.email = input.value;
                    } else {
                        this.data.password = input.value;
                    }
                }
            }
            // After the loop (so if all the inputs are correct) :
            //    ---- postAPI(): Calls login API ----
            try {
                const response = fetch("http://localhost:5678/api/users/login",
                    this.postAPI())
                    .then(response => {
                        // Check the response.status
                        if (response.status == 401) {
                            const elementMessage = document.querySelector("#message");
                            elementMessage.innerText = "Email et/ou Mot de passe non reconnus";
                        } else if (response.status == 200) {
                            // If response OK : save the Token and the Id in the Session Storage
                            response = response.json().then(response => {
                                const storageToken = JSON.stringify(response.token);
                                const storageUserId = JSON.stringify(response.userId);
                                window.sessionStorage.setItem("token", storageToken);
                                window.sessionStorage.setItem("userId", storageUserId);
                                window.location.href = "./index.html";
                                
                            })
                        } else {
                            window.location.href = "./login.html";
                        }
                    }
                    )
            } catch (error) {
                console.log(error);
            }
        })
    }
}


//    ---- Create INSTANCE of Login ----
//    ---- Automatically 
//          - create the eventListener
//          - call the reportValidity()
//          - collect datas for login API call
//          - store Auth Token and Id in Local Storage

const formSubmit = document.querySelector("#login-submit");

if (formSubmit) {
    const fields = ["email", "password"];
    const validator = new Login(formSubmit, fields)
};

