/* -------------------------------- variables ------------------------------- */
const API_URL = 'http://127.0.0.1:5000/api/v1'
let relativeRoute // current relative path
let productsArray // arr of products in localStorage
const currentLocation = window.location.pathname // stores current pathname
/* ---------------------------------- nodes --------------------------------- */
// index.html
const onSaleSection = document.getElementById('onSale')
const onTendency = document.getElementById('onTendency')
const navUl = document.getElementById('navUl')
const navCart = document.getElementById('navCart')
const cartProductList = document.getElementById('cartProductList')
const cartTotal = document.getElementById('cartTotal')
// purchase.html
const purchaseDiv = document.getElementById('purchase')
const divTotal = document.getElementById('purchaseTotal')
const btnPurchase = document.getElementById('finishPurchase')
const cartNavDiv = document.getElementsByClassName('cart')
// login.html
const loginEmail = document.getElementById('loginEmail')
const loginPassword = document.getElementById('loginPassword')
const loginButton = document.getElementById('loginButton')
// signup.html
const signuForm = document.getElementById('signupForm')
const signupName = document.getElementById('signupName')
const signupEmail = document.getElementById('signupEmail')
const signupPassword = document.getElementById('signupPassword')
const signupPasswordConfirm = document.getElementById('signupPasswordConfirm')
const signupButton = document.getElementById('signupButton')
/* -------------------------------- templates ------------------------------- */
// basic card
const productCard = function (product) {
    return `<div class="card col animation">
                <img src="${relativeRoute}${product.picture}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${product.name.toUpperCase()}</h5>
                    <p class="card-text">$${new Intl.NumberFormat("de-DE", {minimumFractionDigits: '2'}).format(product.price)}</p>
                    <p class="card-text plan-text"><span class="payment-plan text-primary">3</span> cuotas sin interes de <span class="payment-plan text-primary">$${new Intl.NumberFormat("de-DE", {maximumFractionDigits: '2'}).format(product.price/3)}</span></p>
                    <a href="#" class="btn btn-primary" id="buy${product.id}">Comprar</a>
                    <button href="#" class="btn btn-primary add-to-cart" id="add${product.id}"><i class="fas fa-shopping-cart cart"></i></button>
                </div>
            </div>`
}
// horizontal Card
const productArticle = function (product) {
    return `<div class="card mb-3" id="card${product.id}">
                <div class="row g-0">
                    <div class="col-md-3">
                        <img src="../${product.picture}" class="img-fluid rounded-start modal-img" alt="...">
                    </div>
                    <div class="col-md-9">
                        <div class="card-body cart-body" id="cardBody${product.id}">
                            <h5 class="card-title cart-title">${product.name.toUpperCase()}</h5>
                            <p class="card-text cart-price">$${new Intl.NumberFormat("de-DE", {minimumFractionDigits: '2'}).format(product.price*product.quantity)}</p>
                            <div class="d-flex card-buttons">
                                <button type="button" class="btn btn-primary btn-sm btn-minus" id="btnMinus${product.id}"><i class="fas fa-minus"></i></button>
                                <p class="card-text d-flex"><small class="align-self-center quantity">${product.quantity}</small></p>
                                <button type="button" class="btn btn-primary btn-sm btn-plus" id="btnPlus${product.id}"><i class="fas fa-plus"></i></button>
                                <p class="card-text d-flex"><small class="align-self-center stock-avaliable">${product.stock} disponibles</small></p>
                                <button type="button" class="btn btn-primary btn-sm btn-delete ms-auto" id="btnDelete${product.id}"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
}
// product to purchase Card
const purchaseCard = function (product) {
    return `<div class="card purchase-card mb-3" id="card${product.id}">
                <div class="row g-0">
                    <div class="col-md-3">
                        <img src="${relativeRoute}${product.picture}" class="img-fluid rounded-start modal-img" alt="...">
                    </div>
                    <div class="col-md-9">
                        <div class="card-body cart-body" id="cardBody${product.id}">
                            <h5 class="card-title cart-title">${product.name.toUpperCase()}</h5>
                            <p class="card-text cart-price">$${new Intl.NumberFormat("de-DE", {minimumFractionDigits: '2'}).format(product.price*product.quantity)}</p>
                            <div class="d-flex card-buttons">
                                <button type="button" class="btn btn-primary btn-sm btn-minus" id="btnMinus${product.id}"><i class="fas fa-minus"></i></button>
                                <p class="card-text d-flex"><small class="align-self-center quantity">${product.quantity}</small></p>
                                <button type="button" class="btn btn-primary btn-sm btn-plus" id="btnPlus${product.id}"><i class="fas fa-plus"></i></button>
                                <p class="card-text d-flex"><small class="align-self-center stock-avaliable">${product.stock} disponibles</small></p>
                                <button type="button" class="btn btn-primary btn-sm btn-delete ms-auto" id="btnDelete${product.id}"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
}
// shows total price
const totalPriceDisplay = function (totalPrice) {
    return `<p class="total-cart">Total</p>
            <p class="total-price-cart">$${new Intl.NumberFormat("de-DE", {minimumFractionDigits: '2'}).format(totalPrice)}</p>`
}
// nav ul to be shown when user is logged in
const personalizedNav = function (userName) {
    return `<li class="nav-item">
                <a class="nav-link active fw-bold" aria-current="page" href="${relativeRoute}/index.html">Home</a>
            </li>
            <li class="nav-item user-name">
                <a class="nav-link" href="#">${userName}</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="closeSession" href="#">Cerrar sesión</a>
            </li>`
}
/* ------------------ definition of relativeRoute variable ------------------ */
if (currentLocation === '/frontend/index.html') {
    relativeRoute = '.'
} else if ((currentLocation === '/frontend/pages/purchase.html') ||
    (currentLocation === 'frontend/pages/login.html') ||
    (currentLocation === 'frontend/pages/signup.html')) {
    relativeRoute = '..'
} else {
    relativeRoute = '../..'
}
/* ------------------- arr of products from local storage ------------------- */
if (!localStorage.getItem('cart')) {
    productsArray = []
    localStorage.setItem('cart', JSON.stringify(productsArray))
} else {
    productsArray = JSON.parse(localStorage.getItem('cart'))
}