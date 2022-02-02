window.addEventListener('load', () => {
    /* -------------------------------- variables ------------------------------- */
    let productsArray;
    const API_URL = 'http://127.0.0.1:5000/api/v1'
    /* ---------------------------------- nodes --------------------------------- */
    const onSaleSection = document.getElementById('onSale')
    const onTendency = document.getElementById('onTendency')
    const navCart = document.getElementById('navCart')
    const cartProductList = document.getElementById('cartProductList')
    const cartTotal = document.getElementById('cartTotal')
    /* ------------------------------ cart creation ----------------------------- */
    if(!localStorage.getItem('cart')) {
        productsArray = []
        localStorage.setItem('cart', JSON.stringify(productsArray))
    } else {
        productsArray = JSON.parse(localStorage.getItem('cart'))
    }
    /* -------------------------------- listeners ------------------------------- */
    navCart.addEventListener('click', showCart)
    /* -------------------------------- functions ------------------------------- */
    // function that gets all the users
    function getAllProducts() {
        const endpoint = `${API_URL}/products`
        const settings = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        }
        return new Promise((resolve, reject) => {
            fetch(endpoint, settings)
            .then((response)=> resolve(response.json()))
            .catch((err) => reject(`error obteniendo las tareas (${err})`))
        })
    }
    
    // function that filters products on sale
    async function onSaleProducts() {
        const products = await getAllProducts()
        productsOnSale = products.filter((product) => product.isOnSale)
        productsOnSale.map((product) => {
            onSaleSection.innerHTML += `
            <div class="card col">
                <img src="${product.picture}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${product.name.toUpperCase()}</h5>
                    <p class="card-text">$${new Intl.NumberFormat("de-DE", {minimumFractionDigits: '2'}).format(product.price)}</p>
                    <p class="card-text plan-text"><span class="payment-plan text-primary">3</span> cuotas sin interes de <span class="payment-plan text-primary">$${new Intl.NumberFormat("de-DE", {maximumFractionDigits: '2'}).format(product.price/3)}</span></p>
                    <a href="#" class="btn btn-primary" id="buy${product.id}">Comprar</a>
                    <button href="#" class="btn btn-primary add-to-cart" id="add${product.id}"><i class="fas fa-shopping-cart cart"></i></button>
                </div>
            </div>
            `
        })
        productsOnSale.forEach((product) => {
            document.getElementById(`add${product.id}`).addEventListener('click', () => addToCart(product))
        })
    }
    onSaleProducts()

    // function that filters products in tendency
    async function tendencyProducts() {
        const products = await getAllProducts()
        productsOnTendency = products.filter((product) => product.isTendency)
        productsOnTendency.map((product) => {
            onTendency.innerHTML += `
            <div class="card col-3">
                <img src="${product.picture}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${product.name.toUpperCase()}</h5>
                    <p class="card-text">$${new Intl.NumberFormat("de-DE", {minimumFractionDigits: '2'}).format(product.price)}</p>
                    <p class="card-text plan-text"><span class="payment-plan text-primary">3</span> cuotas sin interes de <span class="payment-plan text-primary">$${new Intl.NumberFormat("de-DE", {maximumFractionDigits: '2'}).format(product.price/3)}</span></p>
                    <a href="#" class="btn btn-primary">Comprar</a>
                    <button href="#" class="btn btn-primary add-to-chart" id="add${product.id}"><i class="fas fa-shopping-cart cart"></i></button>
                </div>
            </div>
            `;
        })
        productsOnTendency.forEach((product) => {
            document.getElementById(`add${product.id}`).addEventListener('click', () => addToCart(product))
        })
    }
    tendencyProducts()

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
    function showCart() {
        let cartProducts = JSON.parse(localStorage.getItem('cart'))
        let totalPrice = cartProducts.reduce((acum, product) => acum += product.price*product.quantity, 0)
        cartProductList.innerHTML = ''
        cartProducts.map((product) => {
            cartProductList.innerHTML += `
            <div class="card mb-3" id="card${product.id}">
                <div class="row g-0">
                    <div class="col-md-3">
                        <img src="${product.picture}" class="img-fluid rounded-start modal-img" alt="...">
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
})