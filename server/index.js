require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

// =====================
// DATABASE CONNECTION
// =====================
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 10
});

db.getConnection((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ MySQL Connected Successfully");
  }
});

// =====================
// TEST ROUTE
// =====================
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});


// =====================
// USERS
// =====================
app.post("/register", async (req, res) => {

  const { firstName, lastName, email, password, mobNo, dob } = req.body;

  if (!firstName || !lastName || !email || !password)
    return res.status(400).json({ message: "All fields required ❌" });

  const fullName = `${firstName} ${lastName}`;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, results) => {

    if (results.length > 0)
      return res.status(400).json({ message: "User already exists ❌" });

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (firstName,lastName,fullName,email,password,mobNo,dob) VALUES (?,?,?,?,?,?,?)",
      [firstName, lastName, fullName, email, hashedPassword, mobNo, dob],
      (err) => {
        if (err) return res.status(500).json({ message: "Registration Failed ❌" });

        res.json({ message: "User Registered Successfully ✅" });
      }
    );

  });

});


// =====================
// LOGIN
// =====================
app.post("/login", (req, res) => {

  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, results) => {

    if (results.length === 0)
      return res.status(400).json({ message: "User not found ❌" });

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(400).json({ message: "Invalid password ❌" });

    res.json({
      message: "Login successful ✅",
      userId: user.id,
      fullName: user.fullName
    });

  });

});


// =====================
// PRODUCTS
// =====================

// GET PRODUCTS
app.get("/products", (req, res) => {

  db.query("SELECT * FROM products ORDER BY id DESC", (err, results) => {
    res.json(results);
  });

});

// ADD PRODUCT
app.post("/products", (req, res) => {

  const { name, price, category, stock, status, image } = req.body;

  db.query(
    "INSERT INTO products (name,price,category,stock,status,image) VALUES (?,?,?,?,?,?)",
    [name, price, category, stock || 0, status || "Active", image || ""],
    (err, result) => {

      if (err) return res.status(500).json({ message: "Insert failed ❌" });

      res.json({
        id: result.insertId,
        name,
        price,
        category,
        stock
      });

    }
  );

});

// DELETE PRODUCT
app.delete("/products/:id", (req, res) => {

  db.query("DELETE FROM products WHERE id=?", [req.params.id], (err) => {

    if (err) return res.status(500).json({ message: "Delete Failed ❌" });

    res.json({ message: "Product deleted ✅" });

  });

});


// =====================
// DEALS
// =====================

app.get("/deals", (req, res) => {

  db.query("SELECT * FROM deals ORDER BY id DESC", (err, results) => {
    res.json(results);
  });

});


// =====================
// CART
// =====================

// GET CART
app.get("/cart", (req, res) => {

  db.query("SELECT * FROM cart", (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);

  });

});


// ADD TO CART
app.post("/cart", (req, res) => {

  const { product_id, name, price, image } = req.body;

  // CHECK IF PRODUCT EXISTS IN CART
  db.query(
    "SELECT * FROM cart WHERE product_id=?",
    [product_id],
    (err, results) => {

      if (results.length > 0) {

        // INCREASE QTY
        db.query(
          "UPDATE cart SET qty = qty + 1 WHERE product_id=?",
          [product_id],
          () => {
            res.json({ message: "Quantity Updated ✅" });
          }
        );

      } else {

        // INSERT NEW PRODUCT
        db.query(
          "INSERT INTO cart (product_id,name,price,image,qty) VALUES (?,?,?,?,1)",
          [product_id, name, price, image],
          () => {
            res.json({ message: "Added to cart 🛒" });
          }
        );

      }

    }
  );

});


// UPDATE CART QTY
app.put("/cart/:id", (req, res) => {

  const { qty } = req.body;

  db.query(
    "UPDATE cart SET qty=? WHERE id=?",
    [qty, req.params.id],
    () => {
      res.json({ message: "Cart Updated ✅" });
    }
  );

});


// REMOVE CART ITEM
app.delete("/cart/:id", (req, res) => {

  db.query("DELETE FROM cart WHERE id=?", [req.params.id], () => {
    res.json({ message: "Item removed from cart 🗑️" });
  });

});


// CLEAR CART
app.delete("/cart", (req, res) => {

  db.query("DELETE FROM cart", () => {
    res.json({ message: "Cart cleared 🧹" });
  });

});


// =====================
// ORDERS
// =====================

// GET ORDERS
app.get("/orders", (req, res) => {

  db.query("SELECT * FROM orders ORDER BY id DESC", (err, results) => {
    res.json(results);
  });

});


// PLACE ORDER
app.post("/orders", (req, res) => {

  const { items, total, paymentMethod } = req.body;

  db.query(
    "INSERT INTO orders (items,total,paymentMethod) VALUES (?,?,?)",
    [JSON.stringify(items), total, paymentMethod],
    (err, result) => {

      if (err) return res.status(500).json({ message: "Order Failed ❌" });

      // CLEAR CART AFTER ORDER
      db.query("DELETE FROM cart");

      res.json({
        message: "Order placed successfully 🎉",
        orderId: result.insertId
      });

    }
  );

});


// =====================
// SERVER
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});