const mongoose = require("mongoose");
const Order = require("./order");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product"
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
});

userSchema.methods.addToCart = function(product, quantity){
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = quantity;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = parseInt(this.cart.items[cartProductIndex].quantity) + parseInt(quantity);
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    }
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.removeFromCart = function(productId){
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.removeANumberFromCart = function(productId, quantity){
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === productId.toString();
    });

    const updatedCartItems = [...this.cart.items];
    if (updatedCartItems[cartProductIndex].quantity - quantity <= 0) {
        updatedCartItems.splice(cartProductIndex, 1);
    } else {
        updatedCartItems[cartProductIndex].quantity -= quantity;
    }
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function(){
    this.cart = {items: []};
    return this.save();
}

userSchema.methods.addOrder = function(){
    const order = new Order({
        userId: this._id,
        items: this.cart.items
    });
    return order.save()
    .then(result => {
        this.clearCart()
        .then(() => {
            return result;
        });
    })
    .catch(error => {
        console.log(error);
    });
}

module.exports = mongoose.model("User", userSchema);
