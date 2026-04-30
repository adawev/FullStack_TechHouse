import {cartItems, products} from "../data/db.js";

export function viewCart(req, res) {
    const userId = req.headers('x-user-id');
    const userCart = cartItems.filter(item => item.user_id === userId);
    const result = userCart.map((item) => {
        const product = products.find(p=>p.id === item.product_id);
        return {
            ...item,
            product,
        }
    })
    return res.status(200).json(result);
}
export function addToCart(req, res) {

}
export function updateCartItem(req, res) {

}
export function removeCartItem(req, res) {

}