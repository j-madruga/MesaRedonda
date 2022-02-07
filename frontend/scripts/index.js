window.addEventListener('load', () => {
    /* ---------------------------------- token --------------------------------- */
    const token = localStorage.getItem('token')
    /* ------------- if token exists its because user has logged id ------------- */
    if (token) {
        async function printUser() {
            const user = await userHandler.getUserData(token)
            navUl.innerHTML = personalizedNav(user.user.name)
            const closeSession = document.getElementById('closeSession')
            closeSession.addEventListener('click', () => userHandler.signOut())
        }
        printUser()
    }
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
                .catch((msjErr) => reject(`error obteniendo las tareas (${msjErr})`))
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