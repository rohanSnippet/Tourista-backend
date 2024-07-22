const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 6001;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();
//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//mongodb config
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@tourista.auwyist.mongodb.net/?retryWrites=true&w=majority&appName=tourista`
  )
  .then(console.log("MongoDB connected successfully"))
  .catch((error) => console.log("Error connecting to mongodb", error));

//jwt authentication
app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1hr",
  });
  res.send({ token });
});

//payment configure

//payment verification
app.post("/order/validate", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  console.log(req.body);

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(body.toString())
    .digest("hex");

  /*  console.log("sig received ", razorpay_signature);
  console.log("sig generated", expectedSignature);
 */
  const isAuth = expectedSignature === razorpay_signature;
  /*   if (isAuth) {
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    res.redirect(
      `http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.send(response);
    res.status(400).json({
      success: false,
    });
  } */
  //response = { signatureIsValid: "true" };
});
//console.log(process.env.ACCESS_TOKEN_SECRET);

//import routes here
const menuRoutes = require("./api/routes/menuRoutes");
const cartRoutes = require("./api/routes/cartRoutes");
const userRoutes = require("./api/routes/userRoutes");
const bookingRoutes = require("./api/routes/bookingRoutes");
const emailRoutes = require("./api/routes/emailRoutes");
const adminStats = require("./api/routes/adminStats");

//routes
app.use("/menus", menuRoutes);
app.use("/carts", cartRoutes);
app.use("/users", userRoutes);
app.use("/bookings", bookingRoutes);
app.use("/emails", emailRoutes);
app.use("/adminStats", adminStats);

//checkout api
app.post("/order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_ID_KEY,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });
    const options = req.body;
    const order = await razorpay.orders.create(options);
    if (!order) return res.status(500).send("Error creating order");
    res.json(order);
  } catch (error) {
    console.error(error); // Log the error message
    res.status(500).send(error.message); // Send a more informative error response
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
