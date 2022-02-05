window.addEventListener('load', () => {
    /* -------------------------- check if cart exists -------------------------- */
    if (productsArray.length === 0) {
        location.replace('../index.html')
    } else {
        productsArray = JSON.parse(localStorage.getItem('cart'))
    }
    /* -------------------------------- listeners ------------------------------- */
    navCart.addEventListener('click', cart.showCart(relativeRoute, cartProductList, cartTotal))
    btnPurchase.addEventListener('click', finishPurchase)
    /* -------------------------------- functions ------------------------------- */
    // function that render products to purchase
    function renderProductsToPurchase() {
        let totalPrice = productsArray.reduce((acum, product) => acum += product.price * product.quantity, 0)
        productsArray.map((product) => purchaseDiv.innerHTML += productArticle(product))
        divTotal.innerHTML += totalPriceDisplay(totalPrice)
    }
    renderProductsToPurchase()

    function finishPurchase() {
        Swal.fire({
            title: 'Desea completar la compra?',
            text: "Esta accion es irreversible",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Comprar'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Compra confirmada',
                    'Le enviaremos un mail con los detalles de su compra',
                    'success',
                ).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.setItem('cart', '[]')
                        location.replace('../index.html')
                    }
                })
            }
        })
    }
})