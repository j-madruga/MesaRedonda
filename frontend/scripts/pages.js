window.addEventListener('load', () => {
        /* -------------------------------- variables ------------------------------- */
        const API_URL = 'http://127.0.0.1:5000/api/v1'
        /* ---------------------------------- nodes --------------------------------- */
        let purchaseDiv = document.getElementById('purchase')
        const btnPurchase = document.getElementById('finishPurchase')
        /* -------------------------- check if cart exists -------------------------- */
        if(!localStorage.getItem('cart')) {
            location.replace('../index.html')
        } else {
            productsArray = JSON.parse(localStorage.getItem('cart'))
        }
        /* -------------------------------- listeners ------------------------------- */
        navCart.addEventListener('click', showCart(relativeRoute))
        btnPurchase.addEventListener('click', finishPurchase)
        /* -------------------------------- functions ------------------------------- */
        // function that render products to purchase
        function renderProductsToPurchase() {
        let totalPrice = productsArray.reduce((acum, product) => acum += product.price*product.quantity, 0)
            productsArray.map((product) => {
                purchaseDiv.innerHTML +=`
                <div class="card mb-3" id="card${product.id}">
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
            })
            purchaseDiv.innerHTML += `
            <p class="total-cart">Total</p>
            <p class="total-price-cart">$${new Intl.NumberFormat("de-DE", {minimumFractionDigits: '2'}).format(totalPrice)}</p>
            `
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
        'success'
      )
    }
  })
        }
})