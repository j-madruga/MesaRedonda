/* ------------------ definition of relativeRoute variable ------------------ */
let relativeRoute
const currentLocation = window.location.pathname
console.log(currentLocation);
if(currentLocation === '/frontend/index.html') {
    relativeRoute = ''
} else if (currentLocation === '/frontend/pages/purchase.html') {
    relativeRoute = '../'
} else {
    relativeRoute = '../../'
}
console.log(relativeRoute);
// function that adds product to cart
function addToCart(product) {
    let newProduct = new Product(product.id, product.name, product.price, product.category, product.picture, product.isOnSale, product.isTendency, product.stock)
    let productExists = productsArray.find((productInArray) => productInArray.id == newProduct.id)
    if(!productExists) {
        productsArray.push(newProduct)
        localStorage.setItem('cart', JSON.stringify(productsArray))
    } else {
        productExists.quantity++
        localStorage.setItem('cart', JSON.stringify(productsArray))
    }
}

// function that renders cart in modal
function showCart(relativeRoute) {
    let cartProducts = JSON.parse(localStorage.getItem('cart'))
    let totalPrice = cartProducts.reduce((acum, product) => acum += product.price*product.quantity, 0)
    cartProductList.innerHTML = ''
    cartProducts.map((product) => {
        cartProductList.innerHTML += `
        <div class="card mb-3" id="card${product.id}">
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
        </div>
    `})
    cartProducts.forEach((product) => {
        document.getElementById(`btnMinus${product.id}`).addEventListener('click', () => substractQuantity(product))
        document.getElementById(`btnPlus${product.id}`).addEventListener('click', () => incrementQuantity(product))
        document.getElementById(`btnDelete${product.id}`).addEventListener('click', () => removeCartProduct(product))
    })
    cartTotal.innerHTML = `
        <p class="total-cart">Total</p>
        <p class="total-price-cart">$${new Intl.NumberFormat("de-DE", {minimumFractionDigits: '2'}).format(totalPrice)}</p>
    `
}

// function that decreses quantity by one
function substractQuantity(product) {
    let arrayProducts = JSON.parse(localStorage.getItem('cart'))
    let productInStorage = arrayProducts.find((productInStorage) => productInStorage.id == product.id)
    if(productInStorage.quantity > 1) {
        productInStorage.quantity--
        localStorage.setItem('cart', JSON.stringify(arrayProducts))
    }
    showCart()
}

// function that increases quantity by one
function incrementQuantity(product) {
    let arrayProducts = JSON.parse(localStorage.getItem('cart'))
    let productInStorage = arrayProducts.find((productInStorage) => productInStorage.id == product.id)
    if(productInStorage.quantity < productInStorage.stock) {
        productInStorage.quantity++
        localStorage.setItem('cart', JSON.stringify(arrayProducts))
        showCart()
    }
    if(productInStorage.quantity === product.stock) {
        document.getElementById(`btnPlus${product.id}`).setAttribute('disabled', '')
    }
}

// function that deletes product from cart
function removeCartProduct(product) {
    let arrayProducts = JSON.parse(localStorage.getItem('cart'))
    let productIndex = arrayProducts.findIndex((productInStorage) => productInStorage.id == product.id)
    arrayProducts.splice(productIndex, 1)
    localStorage.setItem('cart', JSON.stringify(arrayProducts))
    showCart()
}