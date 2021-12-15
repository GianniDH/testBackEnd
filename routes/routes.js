const { path } = require("express/lib/application");
const { count } = require("../models/Product");

module.exports = (app) => {
  const Product = require("../models/Product");
  const User = require("../models/User");
  const Category = require("../models/Category");
  const Order = require("../models/Order");
  const OrderDetail = require("../models/OrderDetail");

  const express = require("express");
  const router = express.Router();

  router.get("/products", async (req, res) => {
    const { page = 1, limit = 10, filters } = req.query;

    try {
      const products = await Product.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate({
          path: "categoryId",
          select: "category headCategory -_id",
          populate: {
            path: "headCategory",
            select: "category -_id",
          },
        });

      const count = await Product.countDocuments();

      res.json({
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } catch (err) {
      console.error(err.message);
    }
  });

  router.get("/products/:id", async (req, res) => {
    try {
      const product = await Product.find({ id: req.params.id });
      res.send(product);
    } catch {
      res.status(404);
      res.send({ error: "Product doesn't exist!" });
    }
  });

  router.post("/products", async (req, res) => {
    try {
      const product = new Product({
        id: req.body.id,
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
      console.log(err);
    }
  });

  router.patch("/products/:id", async (req, res) => {
    try {
      const product = await Product.findOne({ id: req.params.id });

      if (req.body.id) {
        product.id = req.body.id;
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
    } catch {
      res.status(404);
      res.send({ error: "Product doesn't exist!" });
    }
  });

  router.get("/users", async (req, res) => {
    const { page = 1, limit = 10, filters } = req.query;
    try {
      const users = await User.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select("-password");

      const count = await User.countDocuments();
      res.json({
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } catch (err) {
      console.log(err);
    }
  });

  router.get("/users/:id", async (req, res) => {
    try {
      const user = await User.find({ id: req.params.id });
      res.send(user);
    } catch {
      res.status(404);
      res.send({ error: "User doesn't exist!" });
    }
  });

  router.post("/users", async (req, res) => {
    try {
      const user = new User({
        id: req.body.id,
        isAdmin: req.body.isAdmin,
        isSuperAdmin: req.body.isSuperAdmin,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        email: req.body.email,
        password: req.body.password,
        phoneNr: req.body.phoneNr,
        address1: req.body.address1,
        address2: req.body.address2,
        postalCode: req.body.postalCode,
      });
      await user.save();
      res.send(user);
    } catch (err) {
      console.log(err);
    }
  });

  router.patch("/users/:id", async (req, res) => {
    try {
      const user = await User.findOne({ id: req.params.id });

      if (req.body.id) {
        user.id = req.body.id;
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
    } catch {
      res.status(404);
      res.send({ error: "User doesn't exist!" });
    }
  });

  router.delete("/users/:id", async (req, res) => {
    try {
      await User.deleteOne({ id: req.params.id });
      res.status(204).send();
    } catch {
      res.status(404);
      res.send({ error: "User doesn't exist!" });
    }
  });

  router.get("/categories", async (req, res) => {
    const { page = 1, limit = 10, filters } = req.query;

    try {
      const categories = await Category.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate({
          path: "headCategory",
          select: "category -_id",
        });

      const count = await Category.countDocuments();

      res.json({
        categories,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } catch (err) {
      console.log(err);
    }
  });

  router.get("/categories/:id", async (req, res) => {
    try {
      const category = await Category.find({ id: req.params.id });

      res.send(category);
    } catch {
      res.status(404);
      res.send({ error: "Category doesn't exist!" });
    }
  });

  router.post("/categories", async (req, res) => {
    try {
      const category = new Category({
        id: req.body.id,
        category: req.body.category,
        headCategory: req.body.headCategory,
      });
      await category.save();
      res.send(category);
    } catch (err) {
      console.log(err);
    }
  });

  router.patch("/categories/:id", async (req, res) => {
    try {
      const category = await Category.findOne({ id: req.params.id });

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
    } catch {
      res.status(404);
      res.send({ error: "Category doesn't exist!" });
    }
  });

  router.delete("/categories/:id", async (req, res) => {
    try {
      await Category.deleteOne({ id: req.params.id });
      res.status(204).send();
    } catch {
      res.status(404);
      res.send({ error: "Category doesn't exist!" });
    }
  });

  router.get("/orders", async (req, res) => {
    const { page = 1, limit = 10, filters } = req.query;

    try {
      const orders = await Order.find().populate({
        path: "userId",
        select: "-password -isAdmin -isSuperAdmin",
      });

      const count = await Order.countDocuments();

      res.json({
        orders,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } catch (err) {
      console.log(err);
    }
  });

  router.get("/orders/:id", async (req, res) => {
    try {
      const order = await Order.find({ id: req.params.id });

      res.send(order);
    } catch {
      res.status(404);
      res.send({ error: "Order doesn't exist!" });
    }
  });

  router.post("/orders", async (req, res) => {
    try {
      const order = new Order({
        id: req.body.id,
        userId: req.body.userId,
        date: req.body.date,
      });
      await order.save();
      res.send(order);
    } catch (err) {
      console.log(err);
    }
  });

  router.patch("/orders/:id", async (req, res) => {
    try {
      const order = await Order.findOne({ id: req.params.id });

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
    } catch {
      res.status(404);
      res.send({ error: "Order doesn't exist!" });
    }
  });

  router.delete("/orders/:id", async (req, res) => {
    try {
      await Order.deleteOne({ id: req.params.id });
      res.status(204).send();
    } catch {
      res.status(404);
      res.send({ error: "Order doesn't exist!" });
    }
  });

  router.get("/orderdetails", async (req, res) => {
    const { page = 1, limit = 10, filters } = req.query;
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
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } catch (err) {
      console.log(err);
    }
  });

  router.get("/orderdetails/:id", async (req, res) => {
    try {
      const orderdetail = await OrderDetail.find({ id: req.params.id });
      res.send(orderdetail);
    } catch {
      res.status(404);
      res.send({ error: "OrderDetail doesn't exist!" });
    }
  });

  router.post("/orderdetails", async (req, res) => {
    try {
      const orderdetail = new OrderDetail({
        id: req.body.id,
        productId: req.body.productId,
        orderId: req.body.orderId,
        amount: req.body.amount,
      });
      await orderdetail.save();
      res.send(orderdetail);
    } catch (err) {
      res.send(err);
    }
  });

  router.patch("/orderdetails/:id", async (req, res) => {
    try {
      const orderdetail = await OrderDetail.findOne({ id: req.params.id });

      if (req.body.id) {
        orderdetail.id = req.body.id;
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
    } catch {
      res.status(404);
      res.send({ error: "OrderDetail doesn't exist!" });
    }
  });

  router.delete("/orderdetails/:id", async (req, res) => {
    try {
      await OrderDetail.deleteOne({ id: req.params.id });
      res.status(204).send();
    } catch {
      res.status(404);
      res.send({ error: "OrderDetail doesn't exist!" });
    }
  });
  app.use("/api", router);

  module.exports = router;
};
