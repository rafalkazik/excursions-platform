import "./../css/client.css";

// import ExcursionsAPI from './ExcursionsAPI';

const excursionsUrl = "http://localhost:3000/excursions";
const ordersUrl = "http://localhost:3000/orders";
const basket = [];

document.addEventListener("DOMContentLoaded", init);

function init() {
  loadExcurisons();
  addExcursionToBasket();
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

function addExcursionToBasket() {
  const excursionsList = document.querySelector(".panel__excursions");
  const basketList = document.querySelector(".panel__summary");

  const orderListArr = basketList.querySelectorAll(".excursions__item ");

  excursionsList.addEventListener("click", (e) => {
    e.preventDefault();
    const targetEl = e.target;

    if (targetEl.classList.contains("excursions__field-input--submit")) {
      // ***
      // find child price value
      // ***
      const targetParent = targetEl.parentElement;
      const targetChildPriceParent = targetParent.previousElementSibling;

      function checkTargetExcursionChildPrice() {
        const childPrice = targetChildPriceParent.querySelector(
          ".excursions__field-name--child-price"
        ).innerText;
        return childPrice;
      }

      // ***
      // find adult price value
      // ***
      const targetAdultPriceParent =
        targetChildPriceParent.previousElementSibling;

      function checkTargetExcursionAdultPrice() {
        const adultPrice = targetAdultPriceParent.querySelector(
          ".excursions__field-name--adult-price"
        ).innerText;
        return adultPrice;
      }

      // ***
      //  get amout of children
      // ***
      function getAmountOfChildren() {
        const childrenAmount = targetChildPriceParent.querySelector(
          "input[name='children']"
        ).value;
        return childrenAmount;
      }

      // ***
      //  get amout of adults
      // ***
      function getAmountOfAdults() {
        const adultsAmount = targetAdultPriceParent.querySelector(
          "input[name='adults']"
        ).value;
        return adultsAmount;
      }

      //
      // FINAL PRICES FOR EXCURSION PER ADULT OR CHILD
      //
      function finalPriceForAdults() {
        return checkTargetExcursionAdultPrice() * getAmountOfAdults();
      }

      function finalPriceForChildren() {
        return checkTargetExcursionChildPrice() * getAmountOfChildren();
      }

      console.log(
        `Cena dla dorosłych: ${finalPriceForAdults()}, cena dla dzieci: ${finalPriceForChildren()}`
      );

      //
      //
      // FINAL PRICE FOR ALL //
      //
      //
      function finalPriceForAll() {
        return finalPriceForAdults() + finalPriceForChildren();
      }

      console.log(`Cena za CALE zamowienie: ${finalPriceForAll()}`);

      // ***
      // Show excursion in the basket
      // ***
      function showExcursionOrderInBasket() {
        // ***
        // find and get excursion name
        // ***
        const targetParent = targetEl.parentElement;
        const targetChildPriceParent = targetParent.previousElementSibling;
        const targetAdultPriceParent =
          targetChildPriceParent.previousElementSibling;
        const targetExcursionDataForm = targetAdultPriceParent.parentElement;
        const targetExcursionHeader =
          targetExcursionDataForm.previousElementSibling;

        const targetExcursionName =
          targetExcursionHeader.querySelector(".excursions__title").innerText;

        // EXCURSION NAME BASKET
        const excursionNameInBasket = (document.querySelector(
          ".summary__name"
        ).innerText = targetExcursionName);

        // EXCURSION DESCRIPTION
        const excursionDescriptionInBasket = (document.querySelector(
          ".summary__prices"
        ).innerText = `dorośli: ${getAmountOfAdults()} x ${checkTargetExcursionAdultPrice()} PLN, dzieci: ${getAmountOfChildren()} x ${checkTargetExcursionChildPrice()} PLN`);

        const basketExcursion = document.querySelector(".summary__item");
        const cloneBasketExcursion = basketExcursion.cloneNode(true);
        cloneBasketExcursion.classList.remove("summary__item--prototype");
        basketList.appendChild(cloneBasketExcursion);
      }
      showExcursionOrderInBasket();
    }
  });
}
