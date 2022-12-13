function editNav() {
  let x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");
const closeBtn = document.querySelectorAll(".close");


// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));
closeBtn.forEach((btn) => btn.addEventListener("click", closeModal));

// launch modal form
function launchModal() {
  modalbg.style.display = "block";
}

function closeModal(){
  modalbg.style.display = "none";
}

function validate(e, form) {

  if(e) e.preventDefault();
  removeErrors();
  //console.log(form);
  let data = new FormData(form);

  //console.log(data.entries());

  let validated = true;
  let error_container = [];
  //let required = ["first", "last", "email", "location", "consent"];
  const email_regexp = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;

  let input_cond = {
    first: {
      check: {
        required: true,
        type: "string",
        min_char: 2
      },
      error: {
        err_message: "Le prénom doit être renseigné et composé d'au moins 2 lettres",
        input: "#first"
      }
    },
    last:{
      check: {
        required: true,
        type: "string",
        min_char: 2
      },
      error: {
        err_message: "Le nom doit être renseigné et composé d'au moins 2 lettres",
        input: "#last"
      }

    },
    email: {
      check: {
        required: true,
        type: "string",
        pattern: email_regexp
      },
      error: {
        err_message: "L'adresse e-mail doit être renseignée et dans un format valide <span class='text-italic'>example@gmail.com</span>",
        input: "#email"
      }

    },
    quantity: {
      check: {
        required: false,
        type: "number",
        min: 0
      },
      error: {
        err_message: "La quantité doit être indiqué avec une valeur numérique uniquement",
        input : "#quantity"
      }

    },
    location: {
      check: {
        required: true,
        type: "string"
      },
      error : {
        err_message: "Champ obligatoire, veuillez renseigner une valeur",
        input : "#location1"
      }
    },
    consent: {
      check: {
        required: true,
        value: "on"
      },
      error : {
        err_message: "Champ obligatoire",
        input: "#checkbox1"
      }
    }
  }

  for(let key in input_cond){


    if(data.has(key)){
      let val = data.get(key);
      if(!validateField(val, input_cond[key])){
        let check = input_cond[key].check;
        if((check.hasOwnProperty("required") && check.required === true) || !isEmpty(val))
        {
          let err = createError(key, input_cond[key].error);
          error_container.push(err);
        }
      }
    }
    else
    {
      let cond = input_cond[key].check;
      if(cond.hasOwnProperty("required") && cond.required === true){
        let err = createError(key, input_cond[key].error);
        error_container.push(err);
      }
    }

  }

  /*for(let [key, val] of data.entries()){

    if(input_cond.hasOwnProperty(key))
    {
      if(!validateField(val, input_cond[key])){
        let error = {
          key: {
            error: input_cond[key].error
          }
        };
        error_container.push(error);
      }
    }

  }*/


  if(!isEmpty(error_container)){

    console.error("Error in form required fields", error_container);

    for(let i = 0; i < error_container.length; i++){
      showError(error_container[i].error);
    }
  }
  else{
    console.log("Form is ok to send !");
  }

}

function isEmpty(val){

  let res = false;

  if(val === null || val === undefined || val === "" || val.length === 0){
    res = true;
  }

  return res;

}

function validateField(val, conditions){

  let res = false;

  let check = conditions.check;

  for (let ch in check){

    //console.log(ch);
    if (check.hasOwnProperty(ch)) {

      if(typeof window[ch] !== undefined) {
        res = window[ch](val, check[ch]);
      }

      if(!res) break;

    }

  }

  return res;

}

function required(val, cond){

  let res = false;

  if(!isEmpty(val) && cond === true) res = true;
  else if(cond === false) res = true;

  return res;

}

function type(val, cond){

  let res = false;

  if(typeof val == cond) res = true;
  else if(cond === "number")
  {
    if(parseInt(val) == val) res = true;
  }

  return res;

}

function min_char(val, cond) {

  let res = false;

  if(val.length >= cond) res = true;

  return res;

}

function pattern(val, cond){

  let res = false;

  if(cond.test(val)) res = true;

  return res;

}

function min(val, cond){

  let res = false;

  if(val >= cond) res = true;

  return res;

}

function value(val, cond){

  let res = false;

  if(val == cond) res = true;

  return res;

}

function createError(key, error_data){

  let res = {
    error: error_data
  };

  return res;

}

function showError(err) {


  let $elem = document.querySelector(err.input);

  console.log($elem);

  if(!isEmpty($elem)) {
    let $container = $elem.closest(".formData");


    if(!isEmpty($container)) {

      let $error_div = document.createElement("div");
      $error_div.classList.add("errorDiv");
      let $message = document.createElement("p");
      $message.classList.add("errorDiv-message")
      $message.innerHTML = err.err_message;
      $error_div.appendChild($message);

      $container.appendChild($error_div);

    }
  }

}

function removeErrors(){

  let $errors = document.querySelectorAll(".errorDiv");

  $errors.forEach( (div) => div.remove());

}

