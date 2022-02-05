window.addEventListener('load', () => {
    /* -------------------------------- listeners ------------------------------- */
    navCart.addEventListener('click', () => cart.showCart(relativeRoute, cartProductList, cartTotal))
    /* -------------------------------- functions ------------------------------- */
    // function that gets all the products
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
                .then((response) => resolve(response.json()))
                .catch((err) => reject(`error obteniendo las tareas (${err})`))
        })
    }

    // function that filters products on sale
    async function onSaleProducts() {
        const products = await getAllProducts()
        productsOnSale = products.filter((product) => product.isOnSale)
        productsOnSale.map((product) => onSaleSection.innerHTML += productCard(product))
        productsOnSale.forEach((product) => document.getElementById(`add${product.id}`)
            .addEventListener('click', () => cart.addToCart(product)))
    }
    onSaleProducts()

    // function that filters products in tendency
    async function tendencyProducts() {
        const products = await getAllProducts()
        const productsOnTendency = products.filter((product) => product.isTendency)
        productsOnTendency.map((product) => onTendency.innerHTML += productCard(product))
        productsOnTendency.forEach((product) => document.getElementById(`add${product.id}`)
            .addEventListener('click', () => cart.addToCart(product)))
    }
    tendencyProducts()
})