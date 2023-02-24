/* 
    ---- Handle Display of the Welcome Page ----
*/
import { addListernerFilters, generateWorks } from "./JS/works.js";
import { Auth } from "./JS/auth.js";
import * as Modal from "./JS/modal.js";

//    ---- Create JSON Datas from API ----
const ListWorks = await fetch("http://localhost:5678/api/works")
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
    Modal.openModal("#gallery-modal-button", ListWorks);
 };