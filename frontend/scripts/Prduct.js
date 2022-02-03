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

/* -------- array that contains products to be saved on localStorage -------- */
let productsArray;