const Carts = require("../models/Carts");
//get carts using email
const getCartsByEmail = async (req, res) => {
  try {
    const email = req.query.email;
    const query = { email: email };
    const result = await Carts.find(query).exec();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//post a cart
const addToCart = async (req, res) => {
  const { menuItemId, name, recipe, image, price, quantity, email } = req.body;
  console.log(email);
  try {
    const existingCartItem = await Carts.findOne({ menuItemId, email });
    if (existingCartItem) {
      return res
        .status(400)
        .json({ message: "This item is already in your cart" });
    }
    console.log(menuItemId);
    const cartItem = await Carts.create({
      menuItemId,
      name,
      recipe,
      image,
      price,
      quantity,
      email,
    });
    res.status(201).json(cartItem);
    //console.log(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete a cart item
const deleteCartItem = async (req, res) => {
  try {
    const cartId = req.params.id; // Assuming id is passed as a parameter in the URL

    const deletedItem = await Carts.findByIdAndDelete(cartId);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCartsByEmail,
  addToCart,
  deleteCartItem,
  //getCartItemById,
};

// Get carts using email
/*const getCartsByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const query = { email: email };
    const result = await Carts.find(query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching carts by email:", error);
    res.status(500).json({ message: "Error fetching carts by email" });
  }
};

// Post a cart
const addToCart = async (req, res) => {
  try {
    const { menuItemId, name, recipe, image, price, quantity, email } =
      req.body;
    const existingCartItem = await Carts.findOne({ menuItemId });
    if (existingCartItem) {
      return res
        .status(400)
        .json({ message: "This item is already in your cart" });
    }
    const cartItem = await Carts.create({
      menuItemId,
      name,
      recipe,
      image,
      price,
      quantity,
      email,
    });
    res.status(201).json(cartItem);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Error adding item to cart" });
  }
};

// Delete a cart item
const deleteCartItem = async (req, res) => {
  try {
    const { itemId } = req.query;
    const deletedItem = await Carts.findByIdAndDelete(itemId);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    res.status(500).json({ message: "Error deleting item from cart" });
  }
};

module.exports = {
  getCartsByEmail,
  addToCart,
  deleteCartItem,
};
*/
