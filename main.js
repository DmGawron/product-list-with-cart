const dessertsListUl = document.querySelector("#desserts-list");
const itemsCounterSpan = document.querySelector("#cart-items-counter");
const noItemsInCartInfo = document.querySelector("#not-added-items-info");
const cartItemsListUl = document.querySelector("#cart-items-list");
const resumeTotalPrice = document.querySelector("#resume-total-price");
const confirmOrderBtn = document.querySelector("#confirm-order-btn");
const modal = document.querySelector("#modal");
const newOrderBtn = document.querySelector("#start-new-order-btn");
const cart = document.querySelector("#your-cart-container");
const resume = document.querySelector("#resume-container");
const resumeTotalPriceSpan = document.querySelector("#resume-total-price");
let dessertsData = null;
let matchedEl = null;
// let totalPrice = 0;
const cartArray = [];

async function getData() {
	try {
		const response = await fetch("data.json");
		dessertsData = await response.json();
		console.log(dessertsData);
		createListItems(dessertsData);
	} catch (err) {
		console.error(err);
	}
}

//creatig list items and after click creating li in cart
function createListItems() {
	dessertsData.forEach((dessert, index) => {
		dessert.id = `item-${index}`;
		const html = `<li class="dessert-item" id="item-${index}">
        <img src=${dessert.image.desktop} alt=${dessert.name} />
        <div class="add-btn-quantity-container" id="add-btn-quantity-container">
        <button class="add-to-cart-btn" id="add-item-btn">
        <svg xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="20"
        fill="none"
        viewBox="0 0 21 20">
        <g fill="#C73B0F" clip-path="url(#a)">
        <path  d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z" />
        <path d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z"/>
        </g>
        <defs>
        <clipPath id="a">
        <path fill="#fff" d="M.333 0h20v20h-20z" />
        </clipPath>
        </defs>
        </svg>
        Add to Cart
        </button>
         </div>
        <p class="dessert-type">${dessert.category}</p>
        <p class="dessert-name">${dessert.name}</p>
        <span class="dessert-price">$${Number(dessert.price).toFixed(2)}</span>
        </li>`;
		dessertsListUl.insertAdjacentHTML("beforeend", html);
	});

	// adding li to cart after click and displaying quantity change btn
	const addBtn = document.querySelectorAll("#add-item-btn");
	addBtn.forEach((btn) =>
		btn.addEventListener("click", (e) => {
			displayAddedItemToCart(e);
			changeToQuantity(e);
			displayTotalAndConfirm();
		})
	);
}

function changeToQuantity(e) {
	const addAndQuantityBtnsContainer = document.querySelectorAll(
		"#add-btn-quantity-container"
	);

	// console.log(addAndQuantityBtnsContainer);
	const clickedBtn = e.target.parentElement;
	// console.log(clickedBtn);

	clickedBtn.innerHTML = `
     <div class="quantity-btn-container" id="quantity-btn-container">
     <div id="decrease-btn"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg></div>
     <p id="show-quantity">
      ${matchedEl.quantity}
     </p >
     <div id="increase-btn"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>
     </div>
     </div>`;

	clickedBtn
		.querySelector("#increase-btn")
		.addEventListener("click", increaseQuantity);
	clickedBtn
		.querySelector("#decrease-btn")
		.addEventListener("click", decreaseQuantity);
}

/// increase quantity of dessert
function increaseQuantity(e) {
	// matchedEl = dessertsData.find(
	// 	(dessert) => dessert.id === e.target.closest("li").getAttribute("id")
	// );

	const itemLi = e.target.closest("li");
	const itemId = itemLi.getAttribute("id");
	const matchedEl = dessertsData.find((dessert) => dessert.id === itemId);

	if (matchedEl.quantity >= 50) return;
	matchedEl.quantity += 1;

	// Aktualizacja wyświetlanego tekstu
	const quantityTextBtn = itemLi.querySelector("#show-quantity");
	quantityTextBtn.textContent = matchedEl.quantity;

	const cartItem = document.querySelector(`#cart-items-list #${itemId}`);
	if (cartItem) {
		const quantitySpan = cartItem.querySelector("#item-quantity");
		quantitySpan.textContent = `${matchedEl.quantity}x`;

		const totalDessertPrice = cartItem.querySelector("#item-total");
		totalDessertPrice.textContent = `$${(
			matchedEl.quantity * matchedEl.price
		).toFixed(2)}`;

		// console.log(totalPrice);
		// const total = dessertsData;
		// const a = document?.querySelector("#resume-total-price");
		// for (const dessert in total) {
		// 	totalPrice = dessert.price;
		// 	console.log(totalPrice);
		// }

		// resume.textContent = totalPrice;
		// console.log(total);
	}
	calculateTotalPrice();
}

function calculateTotalPrice() {
	let totalPrice = 0;
	const cartItems = document.querySelectorAll(".cart-items-item");
	cartItems.forEach((item) => {
		const itemTotalPrice = item
			.querySelector("#item-total")
			.textContent.replace("$", "");
		totalPrice += Number(itemTotalPrice);
		// console.log(itemTotalPrice);
	});
	console.log(totalPrice);
	resumeTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
}

function decreaseQuantity(e) {
	const itemLi = e.target.closest("li");
	const itemId = itemLi.getAttribute("id");
	const matchedEl = dessertsData.find((dessert) => dessert.id === itemId);

	if (matchedEl.quantity <= 1) return;
	matchedEl.quantity -= 1;

	const quantityTextBtn = itemLi.querySelector("#show-quantity");
	quantityTextBtn.textContent = matchedEl.quantity;

	const cartItem = document.querySelector(`#cart-items-list #${itemId}`);
	if (cartItem) {
		const quantitySpan = cartItem.querySelector("#item-quantity");
		quantitySpan.textContent = `${matchedEl.quantity}x`;
		const totalDessertPrice = cartItem.querySelector("#item-total");
		totalDessertPrice.textContent = `$${(
			matchedEl.quantity * matchedEl.price
		).toFixed(2)}`;
	}
	calculateTotalPrice();
}

// adding and diplaying clicked object desset to cart
function displayAddedItemToCart(e) {
	const elementToAdd = e.target.closest("li");
	// console.log(elementToAdd);
	// console.log(elementToAdd.getAttribute("id"));

	matchedEl = dessertsData.find(
		(dessert) => dessert.id === elementToAdd.getAttribute("id")
	);

	matchedEl.quantity = 1;
	cartArray.push(matchedEl);

	console.log(matchedEl);
	// console.log(dessertsData);
	console.log(cartArray);

	// cartArray.forEach((el) => {
	const price = Number(matchedEl.price.toFixed(2));
	const totalPrice = Number(price * matchedEl.quantity);

	// console.log(el);
	// console.log(productQuantity);

	const html = `<li class="cart-items-item" id="${matchedEl.id}">
				   <div class="item-info">
				    <p class="list-item-name">${matchedEl.name}</p>
					<span class="item-quantity" id="item-quantity">${matchedEl.quantity}x</span>
					<span class="item-price">@ $${price.toFixed(2)}</span>
					<span class="item-total" id="item-total">$${totalPrice.toFixed(2)}</span>						</div>
					<div class="remove-btn" id="remove-btn">
					<svg
					xmlns="http://www.w3.org/2000/svg"
					width="10"
					height="10"
					fill="none"
					viewBox="0 0 10 10">
					<path
    				fill="#CAAFA7"
					d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"
					/>
					</svg>
					</div>
					</li>`;
	cartItemsListUl.insertAdjacentHTML("beforeend", html);
	const removeBtns = document.querySelectorAll("#remove-btn");
	removeBtns.forEach((btn) => {
		btn.addEventListener("click", deleteItemFromCart);
	});

	// increaseQuantity();
	calculateTotalPrice();
}

function deleteItemFromCart(e) {
	const clickedElToDelete = e.target.closest("li").getAttribute("id");
	console.log(clickedElToDelete);
	console.log(dessertsData);
	console.log(e.target.closest("li"));
	const deleteItem = dessertsData.find(
		(dessert) => dessert.id === clickedElToDelete
	);
	console.log(deleteItem);
	deleteItem.quantity = 0;
	e.target.closest("li").remove();
}

function displayTotalAndConfirm() {
	noItemsInCartInfo.classList.add("hidden");
	resume.classList.remove("hidden");
}

// if (cartItemsListUl.lenght) displayTotalAndConfirm();

getData();
