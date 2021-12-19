import "./../css/admin.css";

// import ExcursionsAPI from "./ExcursionsAPI";

const excursionsUrl = "http://localhost:3000/excursions";

document.addEventListener("DOMContentLoaded", init);

function init() {
  loadExcurisons();
  removeExcursions();
  addExcursions();
}

function loadExcurisons() {
  fetch(excursionsUrl)
    .then((resp) => {
      if (resp.ok) {
        return resp.json();
      }
      return Promise.reject(resp);
    })
    .then((data) => insertExcursions(data))
    .catch((err) => console.error(err));
}

function insertExcursions(excursionsArr) {
  const excursionItem = document.querySelector(".excursions__item");
  const excursionsList = document.querySelector(".panel__excursions");

  excursionsList.innerText = "";

  // ***
  //   above, we clear the entire list (including the prototype). This function recreates an element to be able to clone it at a later stage.
  // ***
  function createOneElementOfList() {
    const cloneExcursionsItem = excursionItem.cloneNode(true);
    excursionsList.appendChild(cloneExcursionsItem);
  }
  createOneElementOfList();

  excursionsArr.forEach((item) => {
    const cloneExcursionsItem = excursionItem.cloneNode(true);
    cloneExcursionsItem.classList.remove("excursions__item--prototype");

    //   get name of excursion
    const nameOfExcursion =
      cloneExcursionsItem.querySelector(".excursions__title");
    nameOfExcursion.innerText = item.name;

    // //   get description of excursion
    const descriptionOfExcursion = cloneExcursionsItem.querySelector(
      ".excursions__description"
    );
    descriptionOfExcursion.innerText = item.description;

    // //   get adult price of excursion
    const adultPriceOfExcursion = cloneExcursionsItem.querySelector(
      ".excursions__field-name--adult-price"
    );
    adultPriceOfExcursion.innerText = item.adultPrice;

    // //   get child price of excursion
    const childPriceOfExcursion = cloneExcursionsItem.querySelector(
      ".excursions__field-name--child-price"
    );
    childPriceOfExcursion.innerText = item.childPrice;

    cloneExcursionsItem.dataset.id = item.id;
    excursionsList.appendChild(cloneExcursionsItem);
  });
}

function removeExcursions() {
  const excursionsList = document.querySelector(".panel__excursions");

  excursionsList.addEventListener("click", (e) => {
    e.preventDefault();
    const targetEl = e.target;
    if (targetEl.classList.contains("excursions__field-input--remove")) {
      const removeBtnParent = targetEl.parentElement;
      const formElement = removeBtnParent.parentElement;
      const currentExcursionElement = formElement.parentElement;

      function getExcursionID() {
        const id = currentExcursionElement.dataset.id;
        return id;
      }
      const options = { method: "DELETE" };
      fetch(`${excursionsUrl}/${getExcursionID()}`, options)
        .then((resp) => console.log(resp))
        .catch((err) => console.error(err))
        .finally(loadExcurisons);
    }
  });
}

function addExcursions() {
  const orderForm = document.querySelector(".form");
  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.querySelector(".form__field--name");
    const description = document.querySelector(".form__field--description");
    const adultPrice = document.querySelector(".form__field--adultPrice");
    const childPrice = document.querySelector(".form__field--childPrice");

    const data = {
      name: name.value,
      description: description.value,
      adultPrice: adultPrice.value,
      childPrice: childPrice.value,
    };

    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };

    fetch(excursionsUrl, options)
      .then((resp) => console.log(resp))
      .catch((err) => console.error(err))
      .finally(loadExcurisons);
  });
}
