const apiData = `https://api.pujakaitem.com/api/products`;
const cartElm = document.querySelector(".cart");
const cartIconElm = document.querySelector(".cart-icon");
const cartCloseElm = document.querySelector(".cart-close");
const porductContentElm = document.querySelector(".product-content");
const filterListElm = document.querySelector(".filter-list");
const searchInputElm = document.querySelector(".search__input");
let allCategory = [];
let allFilteredCategory = [];
let productData = [];

cartIconElm.addEventListener("click", () => {
  cartElm.classList.add("active");
});

cartCloseElm.addEventListener("click", () => {
  cartElm.classList.remove("active");
});

// ============================== Show Cart Data ==============================
const showData = (data) => {
  const cartContainer = data.map((curProduct) => {
    if (!allCategory.includes(curProduct.category)) {
      filterListElm.innerHTML += `
         <li><label><input type="checkbox" onclick="handleFilter()" value=${curProduct.category}>${curProduct.category}</label></li>
    `;
      allCategory.push(curProduct.category);
    }

    if (allFilteredCategory.length === 0) {
      allFilteredCategory = allCategory;
    }

    if (allFilteredCategory.includes(curProduct.category)) {
      return `
            <div class="product-box">
                <div class="img-box">
                    <img src="${curProduct.image}" alt="">
                </div>
                <h2 class="product-name">${curProduct.name}</h2>
                <div class="price-and-cart">
                    <span class="price">${curProduct.price}</span>
                    <button class="add-cart">Add to cart</button>
                <a href="details.html?id=${curProduct.id}" class="details">Details</a>
                </div>
            </div>
    `;
    }
  });
  porductContentElm.innerHTML = cartContainer.join("");

  showAddToCartButton();
};
// ============================== Show Cart Data ==============================

// ============================== Show Mobile Product ==============================
const mobileData = (data) => {
  const mobileContainer = data.map((curMobileProduct) => {
    return `
        <div class="product-box">
            <div class="img-box">
                <img src="${curMobileProduct.image}" alt="">
            </div>
            <h2 class="product-name">${curMobileProduct.name}</h2>
            <div class="price-and-cart">
                <span class="price">${curMobileProduct.price}</span>
                <button class="add-cart">Add to cart</button>
                <a href="details.html?id=${curMobileProduct.id}" class="details">Details</a>
            </div>
        </div>
        `;
  });
  porductContentElm.innerHTML = mobileContainer.join("");
  showAddToCartButton();
};
// ============================== End Show Mobile Product ==============================

// ============================== Show Filter Product ==============================
const handleFilter = () => {
  const inputCheckELm = document.querySelectorAll('input[type="checkbox"]');
  let checkFiltered = [];
  inputCheckELm.forEach((curInput) => {
    if (curInput.checked) {
      checkFiltered.push(curInput.value);
    }
  });
  allFilteredCategory = checkFiltered;
  fetchData();
};
// ============================== End Show Filter Product ==============================

//============================= Fetching Api Data ==============================
const fetchData = async () => {
  porductContentElm.innerHTML = "Loading....";
  const response = await fetch(apiData);
  const data = await response.json();

  const mobileFiltered = data.filter((curMobile) => {
    return curMobile.category === "mobile";
  });
  mobileData(mobileFiltered);
  showData(data);
  productData = data;
};

fetchData();
//============================= End Fetching Api Data ==============================

// ============================== Show Add to cart Button ==============================
const showAddToCartButton = () => {
  const addToCartButton = document.querySelectorAll(".add-cart");
  addToCartButton.forEach((curButton) => {
    curButton.addEventListener("click", (e) => {
      const productBox = e.target.closest(".product-box");
      addToCart(productBox);
    });
  });
};
// ============================== End Show Add to cart Button ==============================

// ============================== Add to Cart ==============================
const cartContentElm = document.querySelector(".cart-content");
const addToCart = (productBox) => {
  const productName = productBox.querySelector(".product-name").innerText;
  const productPrice = productBox.querySelector(".price").innerText;
  const productImg = productBox.querySelector("img").src;

  const productNameElm = cartContentElm.querySelectorAll(".product-name");

  for (let nameItem of productNameElm) {
    if (nameItem.innerText === productName) {
      alert("Product already added to cart");
      return;
    }
  }

  const cartItem = document.createElement("div");
  cartItem.classList.add("cart-box");
  cartItem.innerHTML = `
  <img src="${productImg}" alt="${productName}" class="cart-img">
                <div class="cart-detail">
                <p class="product-name">${productName}</p>
                    <span class="cart-price">${productPrice}</span>
                    <div class="cart-quantity">
                        <button class="decrement">-</button>
                        <span class="number">1</span>
                        <button class="increment">+</button>
                    </div>
                </div>
            <button class="cart-remove">Delete</button>
  `;
  cartContentElm.appendChild(cartItem);

  deleteCartItems(cartItem);
  countDisplay(1);
  incerDecer(cartItem);
  cartPrice();
};
// ============================== End Add to Cart ==============================

// ============================== Delete Cart Items ==============================
const deleteCartItems = (cartItem) => {
  cartItem.querySelector(".cart-remove").addEventListener("click", () => {
    cartItem.remove();
    countDisplay(-1);
    cartPrice();
  });
};
// ============================== End Delete Cart Items ==============================

// ============================== ShopingCart Count ==============================
let shopingCartCountItem = 0;
const cartItemCountElm = document.querySelector(".cart-item-count");
const countDisplay = (change) => {
  shopingCartCountItem += change;
  if (shopingCartCountItem > 0) {
    cartItemCountElm.classList.add("active");
    cartItemCountElm.innerText = shopingCartCountItem;
  } else {
    cartItemCountElm.classList.remove("active");
    cartItemCountElm.innerText = "";
  }
};

// ============================== End ShopingCart Count ==============================

// ============================== INCERMENT DECREMENT ==============================
const incerDecer = (cartItem) => {
  const incerement = cartItem.querySelector(".increment");
  const decrement = cartItem.querySelector(".decrement");
  const quntityNumber = cartItem.querySelector(".number");

  incerement.addEventListener("click", () => {
    quntityNumber.innerText++;
    cartPrice();
  });

  decrement.addEventListener("click", () => {
    if (quntityNumber.innerText > 1) {
      quntityNumber.innerText--;
    }
    cartPrice();
  });
};
// ============================== End INCERMENT DECREMENT ==============================

// ============================== Cart Price ==============================
const cartPrice = () => {
  const totalPriceElm = document.querySelector(".total-price");
  const cartItemsElm = document.querySelectorAll(".cart-box");
  let total = 0;
  cartItemsElm.forEach((curTotal) => {
    const productPrice = curTotal.querySelector(".cart-price");
    const productQuntity = curTotal.querySelector(".number");
    const quantity = productQuntity.innerText;

    const priceELm = productPrice.innerText.replace("$", "");

    total += quantity * priceELm;
  });
  totalPriceElm.innerText = `$${total.toFixed(2)}`;
};
// ============================== End Cart Price ==============================

// ============================== Buy Now ==============================
const buyNowELm = document.querySelector(".btn-buy");
buyNowELm.addEventListener("click", () => {
  if (shopingCartCountItem > 0) {
    alert("Thanks for your Purchase");
    cartContentElm.innerHTML = "";
    cartPrice();
    countDisplay(-1);
  } else {
    alert("Your cart is empty!");
  }
});
// ============================== End Buy Now ==============================

// ============================== Product Details ==============================
const productDetailsELm = document.querySelector(".product-details");
const productDetails = async () => {
  const id = window.location.search.split("=")[1];
  const res = await fetch(apiData);
  const data = await res.json();
  const filteredData = data.find((curProduct) => curProduct.id == id);

  productDetailsELm.innerHTML = `
  <div class="product-box">
                <div class="img-box">
                    <img src="${filteredData.image}" alt="${filteredData.name}">
                </div>
                <h2 class="product-name">${filteredData.name}</h2>
                <div class="price-and-cart">
                    <span class="price">${filteredData.price}</span>
                    <button class="add-cart">Add to cart</button>
                </div>
            </div>
  `;
  showAddToCartButton();
};

productDetails();
// ============================== End Product Details ==============================

searchInputElm.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  console.log(value);
  const filteredData = productData.filter((item) =>
    item.name.toLowerCase().includes(value)
  );
  showData(filteredData);

  if (value === "") {
    fetchData();
  } else if (filteredData.length === 0) {
    porductContentElm.innerHTML = "No Product Found";
  }
});
