import {cartItems, products} from "../data/db.js";
import {uuidv4} from "uuid";

export function viewCart(req, res) {
    const userId = req.headers('x-user-id');
    const userCart = cartItems.filter(item => item.user_id === userId);


    if(!userCart) {
        const newCart = {
            id: uuidv4(),
            user_id: userId,
            products: [],
            quantity: 0,
        }
        return res.status(200).json(newCart);
    }

    const cartWithProducts = {
        ...userCart,
        products:userCart.products.map(item => {
            const product = products.find((item) => item.id === item.id);
            return {
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: product.quantity,
            }
        })
    }

}
export function addToCart(req, res) {
    const userId = req.headers('x-user-id');
    const {productId, quantity} = req.body;
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(400).json({message: 'Product not found'});
    }

    if(product.stock<quantity) {
        return res.status(400).json({message: 'Not enough stock'});
    }

    const existingCart = cartItems.find(item => item.user_id === userId && item.product_id === productId);

    if (existingCart) {
        existingCart.quantity += quantity;
    } else{
        cartItems.push({
            id: uuidv4(),
            user_id: userId,
            productId: productId,
            quantity: quantity,
        });
    }

    product.stock -= quantity;
    return res.status(200).json({message: 'Product added successfully'});


}
export function updateCartItem(req, res) {

}
export function removeCartItem(req, res) {

}