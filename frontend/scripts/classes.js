/* ------------------------------ Product class ----------------------------- */
class Product {
    constructor(id, name, price, category, picture, isOnSale, isTendency, stock) {
        this.id = id;
        this.name  = name;
        this.price = price;
        this.category = category;
        this.picture = picture;
        this.isOnSale = isOnSale;
        this.isTendency = isTendency;
        this.stock = stock;
        this.quantity = 1;
    }
}

/* ------------------------------- Cart class ------------------------------- */
class Cart {
    // constructor function
    constructor() {}
    // function that adds product to cart
    addToCart = (product) => {
        let newProduct = new Product(product.id, product.name, product.price, product.category, product.picture, product.isOnSale, product.isTendency, product.stock)
        let productExists = productsArray.find((productInArray) => productInArray.id === newProduct.id)
        if(!productExists) {
            productsArray.push(newProduct)
            localStorage.setItem('cart', JSON.stringify(productsArray))
        } else {
            productExists.quantity++
            localStorage.setItem('cart', JSON.stringify(productsArray))
        }
    }
    
    // function that renders cart in modal
    showCart = (route, divCartProducts, divTotalPrice) => {
        let totalPrice = productsArray.reduce((acum, product) => acum += product.price*product.quantity, 0)
        if(productsArray.length!==0) {
            divCartProducts.innerHTML = ''
            productsArray.map((product) => {
                divCartProducts.innerHTML += `
                <div class="card mb-3" id="card${product.id}">
                    <div class="row g-0">
                        <div class="col-md-3">
                            <img src="${route}${product.picture}" class="img-fluid rounded-start modal-img" alt="...">
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
            productsArray.forEach((product) => {
                document.getElementById(`btnMinus${product.id}`).addEventListener('click', () => this.substractQuantity(product, route, divCartProducts, divTotalPrice))
                document.getElementById(`btnPlus${product.id}`).addEventListener('click', () => this.incrementQuantity(product, route, divCartProducts, divTotalPrice))
                document.getElementById(`btnDelete${product.id}`).addEventListener('click', () => this.removeCartProduct(product, route, divCartProducts, divTotalPrice))
            })
            divTotalPrice.innerHTML = `
                <p class="total-cart">Total</p>
                <p class="total-price-cart">$${new Intl.NumberFormat("de-DE", {minimumFractionDigits: '2'}).format(totalPrice)}</p>
            `
        } else {
            divCartProducts.innerHTML = 'El carrito se encuentra vacío'
            divTotalPrice.innerHTML = ''
        }
    }
    
    // function that decreses quantity by one
    substractQuantity = (product, relativeRoute, divCartProducts, divTotalPrice) => {
        let productInStorage = productsArray.find((productInStorage) => productInStorage.id === product.id)
        if(productInStorage.quantity > 1) {
            productInStorage.quantity--
            localStorage.setItem('cart', JSON.stringify(productsArray))
        }
        this.showCart(relativeRoute, divCartProducts, divTotalPrice)
    }
    
    // function that increases quantity by one
    incrementQuantity = (product, relativeRoute, divCartProducts, divTotalPrice) => {
        let productInStorage = productsArray.find((productInStorage) => productInStorage.id === product.id)
        if(productInStorage.quantity < productInStorage.stock) {
            productInStorage.quantity++
            localStorage.setItem('cart', JSON.stringify(productsArray))
            this.showCart(relativeRoute, divCartProducts, divTotalPrice)
        }
        if(productInStorage.quantity === product.stock) {
            document.getElementById(`btnPlus${product.id}`).setAttribute('disabled', '')
        }
    }
    // function that deletes product from cart
    removeCartProduct = (product, relativeRoute, divCartProducts, divTotalPrice) => {
        console.log('excecuting function')
        let productIndex = productsArray.findIndex((productInStorage) => productInStorage.id === product.id)
        productsArray.splice(productIndex, 1)
        localStorage.setItem('cart', JSON.stringify(productsArray))
        this.showCart(relativeRoute, divCartProducts, divTotalPrice)
    }
}

/* --------------------------- cart instantiation --------------------------- */
let cart = new Cart()