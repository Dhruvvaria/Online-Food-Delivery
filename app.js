const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js");
const Hotels = require("./models/hotels.js");
const Booking = require("./models/restaurent_booking.js");
const Contact = require("./models/contact.js");
const Admin = require("./models/admin.js");
const passport = require("passport");
const User = require("./models/user.js");
const Cart = require("./models/cart.js");
const ExpressError = require("./utils/expressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const flash = require("connect-flash");
let session = require("express-session");
const { isLoggedIn } = require("./utils/middleware.js");
const { wrap } = require("module");
const LocalStrategy = require("passport-local").Strategy;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));

const MONGO_URL = "add your url";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const sessionOption = {
  secret: "your secret word",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.crrUser = req.user;
  res.locals.admin = req.session.admin;
  next();
});

app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});

app.use((req, res, next) => {
  res.locals.cartCount = req.session.cart
    ? req.session.cart.reduce((total, item) => total + item.quantity, 0)
    : 0;
  next();
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

//--------------------------------------------------------------------------

// Admin section

//  Account Status

app.get("/admin_login", async (req, res) => {
  res.render("./user/admin_login.ejs");
});

app.post("/admin_login", async (req, res) => {
  let { username, password } = req.body;
  let admin = await Admin.findOne({ username });

  if (!admin) {
    req.flash(
      "error",
      "Invalid Admin user please check and enter valid username!"
    );
    return res.redirect("/admin_login");
  }

  if (password !== admin.password) {
    req.flash("error", "Invalid password!");
    return res.redirect("/admin_login");
  }
  req.session.admin = admin;
  req.flash("success", "Login Successfull!!");
  res.redirect("/admin_home");
});

//home page
app.get("/admin_home", async (req, res) => {
  let allListings = await Listing.find({});
  res.render("./listings/admin_home.ejs", { allListings });
});

// new food
app.get(
  "/home/newfood",
  wrapAsync(async (req, res, next) => {
    res.render("./listings/addfood.ejs");
  })
);

// edit food
app.get(
  "/home/:id/edit",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Item not found!!");
      res.redirect("/admin_home");
    }
    res.render("./listings/edit.ejs", { listing });
  })
);

//Create food
app.post(
  "/home",
  wrapAsync(async (req, res) => {
    const newFood = new Listing(req.body.listing);
    await newFood.save();
    req.flash("success", "New Food added in menu");
    res.redirect("/admin_home");
  })
);

//Update food
app.put(
  "/home/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Item Updated Successfully!!");
    res.redirect("/admin_home");
  })
);

//delete food
app.delete(
  "/home/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletefood = await Listing.findByIdAndDelete(id);
    console.log(deletefood);
    req.flash("success", "Item Deleted!!");
    res.redirect("/admin_home");
  })
);

//contact page
app.get("/admin_home/contact", async (req, res) => {
  let allContacts = await Contact.find({});
  res.render("./listings/admin_contact.ejs", { allContacts });
});

app.get(
  "/admin_home/contact/:id/delete",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteContact = await Contact.findByIdAndDelete(id);
    console.log(deleteContact);
    res.redirect("/admin_home/contact");
  })
);

//cart page
app.get("/admin_home/orders", async (req, res) => {
  try {
    const allCartItems = await Cart.find().populate("items.productId"); // Populates product details
    // Populates user details

    res.render("./listings/admin_cart", { allCartItems });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete(
  "/admin_home/orders/delete-order/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deleteCart = await Cart.findByIdAndDelete(id);

    if (!deleteCart) {
      req.flash("error", "Order not found.");
      return res.redirect("/admin_home/orders");
    }

    req.flash("success", "Order deleted successfully.");
    res.redirect("/admin_home/orders");
  })
);

///Restaurents Booking
app.get(
  "/admin_home/restaurents_booking",
  wrapAsync(async (req, res) => {
    let allBooking = await Booking.find({});
    res.render("./listings/admin_restaurents.ejs", { allBooking });
  })
);

app.get(
  "/admin_home/restaurents_booking/:id/delete",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteBooking = await Booking.findByIdAndDelete(id);
    console.log(deleteBooking);
    req.flash("success", "Serve food !!");
    res.redirect("/admin_home/restaurents_booking");
  })
);

//--------------------------------------------------------------------------

//contact
app.get("/contact", async (req, res) => {
  res.render("./listings/contact.ejs");
});

app.post(
  "/contact",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const newResponse = new Contact(req.body.contact);
    await newResponse.save();
    req.flash("success", "Response Send Successfully");
    res.redirect("/contact");
  })
);

//--------------------------------------------------------------------------

app.get("/about", (req, res) => {
  res.render("./listings/about.ejs");
});

//--------------------------------------------------------------------------

//Restaurent Section :-

//book restaurent
app.get(
  "/restaurents",
  wrapAsync(async (req, res) => {
    const allHotels = await Hotels.find({});
    res.render("./listings/restaurents.ejs", { allHotels });
  })
);

app.get(
  "/restaurents/:id/book_restaurent",
  wrapAsync(isLoggedIn, async (req, res) => {
    let { id } = req.params;
    const hotel = await Hotels.findById(id);
    res.render("./listings/book_restaurent.ejs", { hotel });
  })
);

app.post(
  "/restaurents",
  wrapAsync(async (req, res) => {
    const newBooking = new Booking(req.body.res);
    await newBooking.save();
    req.flash(
      "success",
      "Enjoy Your Dinner at your place. Booking Successfully Done"
    );
    res.redirect("/restaurents");
  })
);

//---------------------------------------------------------------------------

// User Section :-

// Main Route
app.get(
  "/home",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/home.ejs", { allListings });
  })
);

//cart option
app.get(
  "/cart",
  wrapAsync(async (req, res) => {
    const cart = req.session.cart;
    res.render("./listings/cart.ejs", { cart });
  })
);

app.post("/add-to-cart/:id", async (req, res) => {
  let id = req.params;
  const listing = await Listing.findById({ _id: req.params.id });

  if (listing) {
    const cartitem = req.session.cart.find((item) => item._id === id);

    if (cartitem) {
      cartitem.quantity += 1;
    } else {
      req.session.cart.push({
        _id: listing._id,
        title: listing.title,
        price: listing.price,
        image: listing.image,
        quantity: 1,
      });
    }
  }
  res.redirect("/home");
});

// app.post("/checkout", isLoggedIn, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const sessionCart = req.session.cart;

//     if (!sessionCart || sessionCart.length === 0) {
//       return res.redirect("/cart");
//     }

//     const newCart = new Cart({
//       user: userId,
//       items: sessionCart.map((item) => ({
//         productId: item._id,
//         title: item.title,
//         price: item.price,
//         quantity: item.quantity,
//         image: item.image,
//       })),
//       totalQuantity: sessionCart.reduce((acc, item) => acc + item.quantity, 0),
//       totalPrice: sessionCart.reduce(
//         (acc, item) => acc + item.quantity * item.price,
//         0
//       ),
//     });

//     await newCart.save();
//     req.session.cart = [];

//     req.flash(
//       "success",
//       "Your order has been placed successfully! You'll receive a confirmation email shortly. Thank you for shopping with us!"
//     );

//     res.redirect("/home");
//   } catch (err) {
//     console.error("Error saving cart:", err);
//     res.status(500).send("Error processing checkout");
//   }
// });

// user signup

app.post("/checkout", async (req, res) => {
  try {
    if (!req.session.cart || req.session.cart.length === 0) {
      return res.status(400).send("Cart is empty.");
    }

    const cart = req.session.cart;

    const totalQuantity = cart.reduce(
      (total, item) => total + parseInt(item.quantity),
      0
    );
    const totalPrice = cart.reduce(
      (total, item) => total + parseFloat(item.price) * parseInt(item.quantity),
      0
    );

    const items = cart.map((item) => ({
      productId: item._id,
      title: item.title,
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity),
      image: item.image,
    }));

    const newCart = new Cart({
      items,
      totalQuantity,
      totalPrice,
    });
    await newCart.save();

    req.session.cart = [];

    return res.redirect("/cart");
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send("Something went wrong. Please try again later.");
  }
});

app.get(
  "/signup",
  wrapAsync(async (req, res) => {
    res.render("./user/signup.ejs");
  })
);

app.post(
  "/signup",
  wrapAsync(async (req, res) => {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registratedUser = await User.register(newUser, password);
    req.flash(
      "success",
      `Hey ${newUser.username}, Thank you for signing up. You're now ready to explore delicious meals and place your first order.`
    );
    console.log(registratedUser);
    res.redirect("/signup");
  })
);

// User signin
app.get("/signin", async (req, res) => {
  res.render("./user/login.ejs");
});

app.post(
  "/signin",
  passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true,
  }),
  (req, res) => {
    const user = req.user;
    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    req.flash(
      "success",
      `Welcome ${user.username}! You've successfully signed in. Let's get started on your food order.`
    );

    res.redirect("/home");
  }
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next();
    }
    req.flash("success", "You are Logged out!!");
    res.redirect("/home");
  });
});

//---------------------------------------------------------------------------

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found!!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!!" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(8080);
