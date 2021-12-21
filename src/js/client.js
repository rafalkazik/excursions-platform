import "./../css/client.css";

// import ExcursionsAPI from './ExcursionsAPI';

const excursionsUrl = "http://localhost:3000/excursions";
const ordersUrl = "http://localhost:3000/orders";
const basket = [];
const finalPriceBasket = [];

document.addEventListener("DOMContentLoaded", init);

function init() {
  loadExcurisons();
  addExcursionToBasket();
  // sumUpFinalPrice();
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
      // FINAL PRICE FOR ALL PER ONE EXCURSION //
      //
      //
      function finalPriceForAll() {
        return finalPriceForAdults() + finalPriceForChildren();
      }

      console.log(`Cena za CALE zamowienie: ${finalPriceForAll()}`);

      finalPriceBasket.push(finalPriceForAll());

      // VALIDATE FORM

      const childrenAmountInput = targetChildPriceParent.querySelector(
        "input[name='children']"
      );

      const adultsAmountInput = targetAdultPriceParent.querySelector(
        "input[name='adults']"
      );

      const childrenAmountInputValue = childrenAmountInput.value;

      const adultsAmountInputValue = adultsAmountInput.value;

      if (
        !isNaN(parseInt(childrenAmountInputValue)) &&
        !isNaN(parseInt(adultsAmountInputValue))
      ) {
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

          // DATA TO VALIDATE FORM
          const childrenAmount = targetChildPriceParent.querySelector(
            "input[name='children']"
          ).value;

          const adultsAmount = targetAdultPriceParent.querySelector(
            "input[name='adults']"
          ).value;
          //

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

          // EXCURSION PRICE IN BASKET
          const summaryPricePerExcursion = (document.querySelector(
            ".summary__total-price"
          ).innerText = `${finalPriceForAll()} PLN`);

          // Clone and append basket item
          const basketExcursion = document.querySelector(".summary__item");
          const cloneBasketExcursion = basketExcursion.cloneNode(true);
          cloneBasketExcursion.classList.remove("summary__item--prototype");
          basketList.appendChild(cloneBasketExcursion);
        }
        showExcursionOrderInBasket();
      }
      if (!isNaN(parseInt(childrenAmountInputValue))) {
        childrenAmountInput.classList.remove("excursions__field-input--error");
      }
      if (!isNaN(parseInt(adultsAmountInputValue))) {
        adultsAmountInput.classList.remove("excursions__field-input--error");
      }
      if (isNaN(parseInt(childrenAmountInputValue))) {
        childrenAmountInput.classList.add("excursions__field-input--error");
      }
      if (isNaN(parseInt(adultsAmountInputValue))) {
        adultsAmountInput.classList.add("excursions__field-input--error");
      }

      function sumUpFinalPrice() {
        const finalValuePrice = finalPriceBasket.reduce((a, b) => a + b);
        const totalOrderPrice = (document.querySelector(
          ".order__total-price-value"
        ).innerText = `${finalValuePrice} PLN`);
      }
      sumUpFinalPrice();
    }
  });
}

const orderSubmitBtn = document.querySelector(
  ".order__field-input[value='zamawiam']"
);

// function sumUpFinalPrice() {
//   const basketList = document.querySelector(".panel__summary");
//   const basketListItems = basketList.querySelectorAll(".summary__item");

//   basketListItems.forEach((item) => {
//     if (!item.classList.contains("summary__item--prototype")) {
//       const excursionInBasketPrice = item
//         .querySelector(".summary__total-price")
//         .innerText.slice(0, -4);

//       return excursionInBasketPrice;
//       // finalPriceBasket.push(parseInt(excursionInBasketPrice));

//       // totalOrderPrice.innerText = finalPriceBasket.reduce((a, b) => a + b);

//       // return parseInt(excursionInBasketPrice);
//     }
//   });
// }

function showNamesOfExcursionsInBasket(e) {
  e.preventDefault();

  const basketList = document.querySelector(".panel__summary");
  const basketListItems = basketList.querySelectorAll(".summary__item");

  basketListItems.forEach((item) => {
    if (!item.classList.contains("summary__item--prototype")) {
      const excursionInBasketName =
        item.querySelector(".summary__name").innerText;

      const excursionInBasketPrice = item.querySelector(
        ".summary__total-price"
      ).innerText;

      const excursionInBasketDescription =
        item.querySelector(".summary__prices").innerText;

      basket.push(
        `Miasto: ${excursionInBasketName}, cena za całość: ${excursionInBasketPrice} (${excursionInBasketDescription})`
      );
    }
  });
  const data = {
    fullBasket: basket,
    fullPrice: finalPriceBasket.reduce((a, b) => a + b),
  };

  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  };

  fetch(ordersUrl, options)
    .then((resp) => console.log(resp))
    .catch((err) => console.error(err))
    .finally(loadExcurisons);
}

orderSubmitBtn.addEventListener("click", showNamesOfExcursionsInBasket);
// orderSubmitBtn.addEventListener("click", sumUpFinalPrice);
