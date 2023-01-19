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
const closeBtn = document.querySelectorAll("[data-close-modal]");
const $confirm = document.querySelector(".modal-confirmation");


// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));
closeBtn.forEach((btn) => btn.addEventListener("click", closeModal));

// launch modal form
function launchModal() {
  modalbg.style.display = "block";
}

function closeModal(){
  modalbg.style.display = "none";
  resetModal();
}

/*
* Called on form submit
*
* Check the form fields and if they are valid
*
* */
function validate(e, form) {

  if(e) e.preventDefault();
  // We remove all previous error messages
  removeErrors();
  //console.log(form);
  // Put all form data in data var
  let data = new FormData(form);

  //console.log(data.entries());

  let validated = true;
  // Will contains all error messages if fields are invalid
  let error_container = [];
  //let required = ["first", "last", "email", "location", "consent"];
  // Get the condition json to validate each field
  let input_cond = getInputConditions();

  // We go through our condition object
  for(let key in input_cond){

    // If input is present in the DataForm
    if(data.has(key)){
      let val = data.get(key);

      // We try to validate the value of the input
      if(!validateField(val, input_cond[key])){
        let check = input_cond[key].check;

        // If input not valid, we create an error
        if((check.hasOwnProperty("required") && check.required === true) || !isEmpty(val))
        {
          let err = createError(input_cond[key].error);
          error_container.push(err);
        }

      }

    }
    else
    {


      let cond = input_cond[key].check;

      // We check if the element is required, and if it is then we create an error
      if(cond.hasOwnProperty("required") && cond.required === true){
        let err = createError(input_cond[key].error);
        error_container.push(err);
      }

    }

  }


  // If there is at least 1 error
  if(!isEmpty(error_container)){

    //console.error("Error in form required fields", error_container);

    for(let i = 0; i < error_container.length; i++){
      showError(error_container[i].error);
    }
  }
  // Else we confirm the registration
  else{
    confirmModal();
  }

}

/*
*
* Check if a variable is empty
*
* Return bool (true if empty, false if not)
*
* */
function isEmpty(val){

  let res = false;

  if(val === null || val === undefined || val === "" || val.length === 0){
    res = true;
  }

  return res;

}

/*
* Verify if a field is correct with given value and conditions
*
* Return bool (true if val is valid, else false)
* */
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

/*
*
* Returns the json object containing all the fields conditions
*
* */
function getInputConditions() {

  const email_regexp = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  return {
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
        err_message: "L'adresse e-mail doit être renseignée et dans un format valide <span class='text-italic'>exemple@gmail.com</span>",
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
        err_message: "Veuillez accepter les conditions d'utilisation",
        input: "#checkbox1"
      }
    }
  };

}

/*
*
* Show the confirmation div for registration
*
* */
function confirmModal(){

  if(!isEmpty($confirm)){

    $confirm.classList.add("active");

  }

}

/*
*
* Reset the modal :
*   - remove confirmation message
*   - Reset form inputs
*
* */
function resetModal(){

  if(!isEmpty($confirm)){

    $confirm.classList.remove("active");

  }

  let $form = document.querySelector("#reserve");

  if(!isEmpty($form)) {

    $form.reset();

  }

}

/*
* Field Check function
*
* Check if val is required and not empty
*
*
* Return bool (true if value is valid, else false)
*
* */
function required(val, cond){

  let res = false;

  if(!isEmpty(val) && cond === true) res = true;
  else if(cond === false) res = true;

  return res;

}

/*
* Field Check function
*
* Check if val type is of the type provided in the "cond" parameter
*
* Return bool (true if value is valid, else false)
*
* */
function type(val, cond){

  let res = false;

  if(typeof val == cond) res = true;
  else if(cond === "number")
  {
    if(parseInt(val) == val) res = true;
  }

  return res;

}

/*
* Field Check function
*
* Check if val type has enough characters
*
* Return bool (true if value is valid, else false)
*
* */
function min_char(val, cond) {

  let res = false;

  if(val.length >= cond) res = true;

  return res;

}

/*
* Field Check function
*
* Check if val is following correctly the given pattern
*
* Return bool (true if value is valid, else false)
*
* */
function pattern(val, cond){

  let res = false;

  if(cond.test(val)) res = true;

  return res;

}

/*
* Field Check function
*
* Check if the val type minimum is equal or higher than given number
*
* Return bool (true if value is valid, else false)
*
* */
function min(val, cond){

  let res = false;

  if(val >= cond) res = true;

  return res;

}

/*
* Field Check function
*
* Check if the val has the correct value (useful for checkbox)
*
* Return bool (true if value is valid, else false)
*
* */
function value(val, cond){

  let res = false;

  if(val == cond) res = true;

  return res;

}

/*
*
* Create and return a json object containing the error infos
*
*  */
function createError(error_data){

  return {
    error: error_data
  };

}

/*
*
* Show all error message for all invalid inputs in form
*
*  */
function showError(err) {


  let $elem = document.querySelector(err.input);

  //console.log($elem);

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

/*
*
* Removes all the error messages for all inputs in the register form
*
* */
function removeErrors(){

  let $errors = document.querySelectorAll(".errorDiv");

  $errors.forEach( (div) => div.remove());

}

