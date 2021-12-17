const { path } = require("express/lib/application");
const { mongoose } = require("../models");
const { count } = require("../models/Product");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const pageLimit = 9;
module.exports = (app) => {
  const Product = require("../models/Product");
  const User = require("../models/User");
  const Category = require("../models/Category");
  const Order = require("../models/Order");
  const OrderDetail = require("../models/OrderDetail");

  const express = require("express");
  const router = express.Router();

  router.get("/products", async (req, res, next) => {
    const filters = req.query;
    const page = filters["page"];
    idsString = filters["categoryId"] ?? "";
    ids = idsString.split("$id[]");
    if (idsString != "") {
      if (filters["sort"] !== undefined) {
        const order = filters["sort"] == "low-high" ? "asc" : "desc";
        await Product.find({ categoryId: { $in: ids } })
          .limit(pageLimit * 1)
          .skip((page - 1) * pageLimit)
          .sort({ price: order })
          .then((productRes) => (products = productRes))
          .catch((err) => console.log(err));
      } else {
        await Product.find({
          categoryId: { $in: ids },
        })
          .limit(pageLimit * 1)
          .skip((page - 1) * pageLimit)
          .then((productRes) => (products = productRes))
          .catch((err) => console.log(err));
      }
    } else {
      if (filters["sort"] !== undefined) {
        const order = filters["sort"] == "low-high" ? "asc" : "desc";
        await Product.find()
          .limit(pageLimit * 1)
          .skip((page - 1) * pageLimit)
          .sort({ price: order })
          .then((productRes) => (products = productRes))
          .catch((err) => console.log(err));
      } else {
        await Product.find()
          .limit(pageLimit * 1)
          .skip((page - 1) * pageLimit)
          .then((productRes) => (products = productRes))
          .catch((err) => console.log(err));
      }
    }
    const name = filters["name"] ?? "";
    if (name != "") {
      filter_product = products.filter((p) =>
        p.name.toLowerCase().includes(name.toLowerCase())
      );
    } else {
      filter_product = products;
    }
    const count = await Product.countDocuments();

    res.json({
      filter_product,
      totalPages: Math.ceil(count / pageLimit),
      currentPage: page,
    });
    next();
  });

  router.get("/allproductsname", async (req, res, next) => {
    products = await Product.find().select("name");
    const filters = req.query;
    const name = filters["name"] ?? "";
    if (name != "") {
      filter_product = products.filter((p) =>
        p.name.toLowerCase().includes(name.toLowerCase())
      );
    } else {
      filter_product = products;
    }
    res.send(filter_product);
  });

  router.get("/products/:id", async (req, res) => {
    try {
      const product = await Product.findOne({ _id: req.params.id });
      res.send(product);
    } catch (err) {
      res.send(err.message);
    }
  });

  router.post("/products", async (req, res) => {
    try {
      const product = new Product({
        categoryId: req.body.categoryId,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        isActive: req.body.isActive,
        amountInStock: req.body.amountInStock,
        size: req.body.size,
        color: req.body.color,
        expirationDate: req.body.expirationDate,
        amountProduct: req.body.amountProduct,
        imageUrl: req.body.imageUrl,
      });
      await product.save();
      res.send(product);
    } catch (err) {
      res.send(err.message);
    }
  });

  router.patch("/products/:id", async (req, res) => {
    try {
      const product = await Product.findOne({ _id: req.params.id });

      if (req.body._id) {
        product._id = req.body._id;
      }
      if (req.body.categoryId) {
        product.categoryId = req.body.categoryId;
      }
      if (req.body.name) {
        product.name = req.body.name;
      }
      if (req.body.price) {
        product.price = req.body.price;
      }
      if (req.body.description) {
        product.description = req.body.description;
      }
      if (req.body.isActive) {
        product.isActive = req.body.isActive;
      }
      if (req.body.amountInStock) {
        product.amountInStock = req.body.amountInStock;
      }
      if (req.body.size) {
        product.size = req.body.size;
      }
      if (req.body.color) {
        product.color = req.body.color;
      }
      if (req.body.expirationDate) {
        product.expirationDate = req.body.expirationDate;
      }
      if (req.body.amountProduct) {
        product.amountProduct = req.body.amountProduct;
      }
      if (req.body.imageUrl) {
        product.imageUrl = req.body.imageUrl;
      }

      await product.save();
      res.send(product);
    } catch (err) {
      res.send(err.message);
    }
  });

  router.get("/users", async (req, res) => {
    const { page = 1, filters } = req.query;
    try {
      const users = await User.find()
        .limit(pageLimit * 1)
        .skip((pageLimit - 1) * pageLimit)
        .select("-password");

      const count = await User.countDocuments();
      res.json({
        users,
        totalPages: Math.ceil(count / pageLimit),
        currentPage: page,
      });
    } catch (err) {
      res.send(err.message);
    }
  });

  router.get("/users/:id", async (req, res) => {
    try {
      const user = await User.find({ _id: req.params.id });
      res.send(user);
    } catch (err) {
      res.send(err.message);
    }
  });

  router.post("/register", async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        isAdmin: req.body.isAdmin,
        isSuperAdmin: req.body.isSuperAdmin,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        email: req.body.email,
        password: hashedPassword,
        phoneNr: req.body.phoneNr,
        address1: req.body.address1,
        address2: req.body.address2,
        postalCode: req.body.postalCode,
      });
      await user.save();
      const accessToken = jwt.sign(
        {
          _id: user._id,
          isAdmin: user.isAdmin,
          isSuperAdmin: user.isSuperAdmin,
          lastName: user.lastName,
          firstName: user.firstName,
          email: user.email,
          password: user.password,
          phoneNr: user.phoneNr,
          address1: user.address1,
          address2: user.address2,
          postalCode: user.postalCode,
        },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.json({ accessToken: accessToken, user: user });
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  router.post("/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user == null) return res.status(400).send("User does not exist!");
    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        const accessToken = jwt.sign(
          {
            _id: user._id,
            isAdmin: user.isAdmin,
            isSuperAdmin: user.isSuperAdmin,
            lastName: user.lastName,
            firstName: user.firstName,
            email: user.email,
            password: user.password,
            phoneNr: user.phoneNr,
            address1: user.address1,
            address2: user.address2,
            postalCode: user.postalCode,
          },
          process.env.ACCESS_TOKEN_SECRET
        );
        res.json({ accessToken: accessToken, user: user });
      } else {
        res.send("Not Allowed!");
      }
    } catch {
      res.status(500).send();
    }
  });

  router.patch("/users/:id", async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id });

      if (req.body._id) {
        user._id = req.body._id;
      }
      if (req.body.isAdmin) {
        user.isAdmin = req.body.isAdmin;
      }
      if (req.body.isSuperAdmin) {
        user.isSuperAdmin = req.body.isSuperAdmin;
      }
      if (req.body.lastName) {
        user.lastName = req.body.lastName;
      }
      if (req.body.firstName) {
        user.firstName = req.body.firstName;
      }
      if (req.body.email) {
        user.email = req.body.email;
      }
      if (req.body.password) {
        user.password = req.body.password;
      }
      if (req.body.phoneNr) {
        user.phoneNr = req.body.phoneNr;
      }
      if (req.body.address1) {
        user.address1 = req.body.address1;
      }
      if (req.body.address2) {
        user.address2 = req.body.address2;
      }
      if (req.body.postalCode) {
        user.postalCode = req.body.postalCode;
      }

      await user.save();
      res.send(user);
    } catch (err) {
      res.status(500).send();
    }
  });

  router.delete("/users/:id", async (req, res) => {
    try {
      await User.deleteOne({ _id: req.params.id });
      res.status(204).send();
    } catch (err) {
      res.status(500).send();
    }
  });

  router.get("/categories", async (req, res) => {
    const { page = 1, filters } = req.query;

    try {
      const categories = await Category.find()
        .limit(pageLimit * 1)
        .skip((page - 1) * pageLimit)

      const count = await Category.countDocuments();

      res.json({
        categories,
        totalPages: Math.ceil(count / pageLimit),
        currentPage: page,
      });
    } catch (err) {
      res.status(500).send();
    }
  });

  router.get("/categories/:id", async (req, res) => {
    try {
      const category = await Category.find({ _id: req.params.id });

      res.send(category);
    } catch (err) {
      res.status(500).send();
    }
  });

  router.post("/categories", async (req, res) => {
    try {
      const category = new Category({
        category: req.body.category,
        headCategory: req.body.headCategory,
      });
      await category.save();
      res.send(category);
    } catch (err) {
      res.status(500).send();
    }
  });

  router.patch("/categories/:id", async (req, res) => {
    try {
      const category = await Category.findOne({ _id: req.params.id });

      if (req.body.id) {
        category.id = req.body.id;
      }
      if (req.body.category) {
        category.category = req.body.category;
      }
      if (req.body.headCategory) {
        category.headCategory = req.body.headCategory;
      }

      await category.save();
      res.send(category);
    } catch (err) {
      res.status(500).send();
    }
  });

  router.delete("/categories/:id", async (req, res) => {
    try {
      await Category.deleteOne({ _id: req.params.id });
      res.status(204).send();
    } catch (err) {
      res.status(500).send();
    }
  });

  router.get("/orders", async (req, res) => {
    const { page = 1, filters } = req.query;

    try {
      const orders = await Order.find().populate({
        path: "userId",
        select: "-password -isAdmin -isSuperAdmin",
      });

      const count = await Order.countDocuments();

      res.json({
        orders,
        totalPages: Math.ceil(count / pageLimit),
        currentPage: page,
      });
    } catch (err) {
      res.status(500).send();
    }
  });

  router.get("/orders/:id", async (req, res) => {
    try {
      const order = await Order.find({ _id: req.params.id });

      res.send(order);
    } catch (err) {
      res.send(err.message);
    }
  });
  router.get("/orders", async (req, res) => {
    const { page = 1, filters } = req.query;

    try {
      const orders = await Order.find().populate({
        path: "userId",
        select: "-password -isAdmin -isSuperAdmin",
      });

      const count = await Order.countDocuments();

      res.json({
        orders,
        totalPages: Math.ceil(count / pageLimit),
        currentPage: page,
      });
    } catch (err) {
      res.status(500).send();
    }
  });

  //GET ORDER OF USER
  router.get("/user/orders", authenticateToken, async (req, res) => {
    try {
      const order = await Order.find({ userId: req.user._id });

      res.send(order);
    } catch (err) {
      res.send(err.message);
    }
  });

  router.post("/orders", async (req, res) => {
    try {
      const order = new Order({
        userId: req.body.userId,
        date: req.body.date,
      });
      await order.save();
      res.send(order);
    } catch (err) {
      res.status(500).send();
    }
  });

  router.patch("/orders/:id", async (req, res) => {
    try {
      const order = await Order.findOne({ _id: req.params.id });

      if (req.body.id) {
        order.id = req.body.id;
      }
      if (req.body.userId) {
        order.userId = req.body.userId;
      }
      if (req.body.date) {
        order.date = req.body.date;
      }

      await order.save();
      res.send(order);
    } catch (err) {
      res.status(500).send();
    }
  });

  router.delete("/orders/:id", async (req, res) => {
    try {
      await Order.deleteOne({ _id: req.params.id });
      res.status(204).send();
    } catch (err) {
      res.status(500).send();
    }
  });

  router.get("/orderdetails", async (req, res) => {
    const { page = 1, pageLimit = 10, filters } = req.query;
    try {
      var populateQuery = [
        {
          path: "productId",
          select: "-_id",
          populate: {
            path: "categoryId",
            select: "-_id",
            populate: { path: "headCategory", select: "category -_id" },
          },
        },
        {
          path: "orderId",
          populate: {
            path: "userId",
            select: "-_id -password -isAdmin -isSuperAdmin",
          },
        },
      ];

      const orderdetails = await OrderDetail.find().populate(populateQuery);

      const count = await OrderDetail.countDocuments();
      res.json({
        orderdetails,
        totalPages: Math.ceil(count / pageLimit),
        currentPage: page,
      });
    } catch (err) {
      res.status(500).send();
    }
  });

  //GET BY ORDERID
  router.get("/orderdetails/:id", async (req, res) => {
    try {
      const orderdetail = await OrderDetail.find({ orderId: req.params.id });
      res.send(orderdetail);
    } catch (err) {
      res.status(500).send();
    }
  });

  router.post("/orderdetails", async (req, res) => {
    try {
      const orderdetail = new OrderDetail({
        productId: req.body.productId,
        orderId: req.body.orderId,
        amount: req.body.amount,
      });
      await orderdetail.save();
      res.send(orderdetail);
    } catch (err) {
      res.status(500).send();
    }
  });

  router.patch("/orderdetails/:id", async (req, res) => {
    try {
      const orderdetail = await OrderDetail.findOne({ _id: req.params.id });
      if (req.body._id) {
        orderdetail._id = req.body._id;
      }
      if (req.body.productId) {
        orderdetail.productId = req.body.productId;
      }
      if (req.body.orderId) {
        orderdetail.orderId = req.body.orderId;
      }
      if (req.body.amount) {
        orderdetail.amount = req.body.amount;
      }

      await orderdetail.save();
      res.send(orderdetail);
    } catch (err) {
      res.status(500).send();
    }
  });

  app.use("/api", router);

  module.exports = router;
};

function authenticateAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    if (user.isAdmin) {
      req.user = user;
      next();
    } else {
      if (err) return res.sendStatus(403);
    }
  });
}
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
