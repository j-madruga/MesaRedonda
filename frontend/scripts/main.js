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
})