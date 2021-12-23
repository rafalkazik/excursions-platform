import "./../css/admin.css";

import ExcursionsAPI from "./ExcursionsAPI";

const api = new ExcursionsAPI();

const excursionsUrl = "http://localhost:3000/excursions";

document.addEventListener("DOMContentLoaded", init);

function init() {
  loadExcurisons();
  removeExcursions();
  updateExcursions();
  addExcursions();
}

function loadExcurisons() {
  api
    .loadData()
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
      const id = currentExcursionElement.dataset.id;

      api
        .removeData(id)
        .catch((err) => console.error(err))
        .finally(loadExcurisons);
    }
  });
}

function updateExcursions() {
  const excursionsList = document.querySelector(".panel__excursions");

  excursionsList.addEventListener("click", (e) => {
    const targetEl = e.target;

    if (targetEl.classList.contains("excursions__field-input--update")) {
      const updateBtnParent = targetEl.parentElement;
      const formElement = updateBtnParent.parentElement;
      const currentExcursionElement = formElement.parentElement;
      const h2List = currentExcursionElement.querySelectorAll("h2");
      const pList = currentExcursionElement.querySelectorAll("p");
      const strongList = currentExcursionElement.querySelectorAll("strong");

      const editableItemsConcat = [...h2List, ...pList, ...strongList];

      const isEditable = editableItemsConcat.every(
        (item) => item.isContentEditable
      );

      if (isEditable) {
        const id = currentExcursionElement.dataset.id;
        console.log(targetEl);

        const data = {
          name: editableItemsConcat[0].innerText,
          description: editableItemsConcat[1].innerText,
          adultPrice: editableItemsConcat[2].innerText,
          childPrice: editableItemsConcat[3].innerText,
        };

        api
          .removeData(id, data)
          .catch((err) => console.error(err))
          .finally(() => {
            (targetEl.value = "edytuj"),
              targetEl.classList.remove(
                "excursions__field-input--update-active"
              );
            editableItemsConcat.forEach((item) => {
              item.contentEditable = false;
              item.classList.remove("excursions__field--active");
            });
          });
      } else {
        targetEl.value = "zapisz";
        targetEl.classList.add("excursions__field-input--update-active");

        editableItemsConcat.forEach((item) => {
          item.contentEditable = true;
          item.classList.add("excursions__field--active");
        });
      }
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

    api
      .addData(data)
      .catch((err) => console.error(err))
      .finally(loadExcurisons);
  });
}
