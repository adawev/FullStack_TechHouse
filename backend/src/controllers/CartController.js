import {cartItems, products} from "../data/db.js";
import { v4 as uuidv4 } from "uuid";

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
        products:userCart.products.map(items => {
            const product = products.find((item) => item.id === items.id);
            return {
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: product.quantity,
            }
        })
    }
    return res.status(200).json(cartWithProducts);

}
export function addToCart(req, res) {
    const userId = req.headers('x-user-id');
    const {productId} = req.body;

    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(400).json({message: 'Product not found'});
    }

    let userCart = cartItems.find(p => p.user_idid === userId);
    if (!userCart) {
        userCart = {
            id: uuidv4(),
            user_id: userId,
            products: [],
            quantity: 0,
        }
        cartItems.push(userCart);
    }

    const existingProducts = userCart.products.find(
        (p) => p.id === productId
    )
    if (existingProducts) {
        existingProducts.quantity += 1;
    }else{
        userCart.products.push({
            id: productId,
            quantity: 1,
        });
    }

    userCart.quantity = userCart.products.reduce(
        (sum, item) =>  sum+item.quantity,
        0,
        );
    return res.status(200).json({message: 'Added to cart!'});


}
export function updateCartItem(req, res) {
    const userId = req.headers['x-user-id'];
    const productId = req.params.id;
    const {quantity} = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({message: 'quantity is required'});
    }

    const userCart = cartItems.find(p => p.user_id === userId);
    if (!userCart) {
        return res.status(404).json({message: 'Cart not found!'});
    }

    const cartProduct = userCart.products.find(p => p.id === productId);
    if (!cartProduct) {
        return res.status(404).json({message: 'Product not in cart!'});

    }

    cartProduct.quantity = quantity;
    userCart.quantity = userCart.products.reduce(
        (sum, item) =>  sum+item.quantity,
        0,
    );
}
export function removeCartItem(req, res) {
    const userId = req.headers["x-user-id"];
    const productId = req.params.id;
    const userCart = cartItems.find((item) => item.user_id === userId);
    if (!userCart) {
        return res.status(404).json({ message: "Cart Not Found!" });
    }
    const cartProduct = userCart.products.find((p) => p.id === productId);
    if (!cartProduct) {
        return res.status(404).json({ message: "Product Not Found in cart!" });
    }
    userCart.products = userCart.products.filter((p) => p.id !== productId);
    userCart.quantity = userCart.products.reduce(
        (sum, item) => sum + item.quantity,
        0,
    );
    return res.status(200).json({message: "Product removed successfully",});
}

export function clearCart(req, res) {
    const userId = req.headers['x-user-id'];

    const userCart = cartItems.find((item) => item.user_id === userId);
    if (!userCart) {
        return res.status(404).json({ message: "Cart Not Found!" });
    }

    userCart.products = []
    userCart.quantity = 0;

    return  res.status(200).json({message: 'Cart cleared successfully', cart: userCart});
}