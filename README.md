Overview :

This is a full-featured Online Food Delivery Application built using the MERN stack. It provides an intuitive and responsive interface for both Users and Admins, each having distinct layouts and features.

-  Users can browse food listings, add items to their cart, and place orders.

-  Admins can manage food listings, view orders, and update menu details.

Features :

User Side :

-  Home Page - View available food items with details and prices.

-  Sign In/Sign Up - Register or log in to place orders.

-  Cart - Add or remove items, view total price, and proceed to checkout.

-  Contact Page - Submit queries or feedback.

-  Order Management - Place orders and view order status.

Admin Side :

-  Home Page - Overview of orders and menu items.

-  Sign In - Secure admin login.

-  Manage Listings - Add, edit, or delete food items from the menu.

-  Contact Management - View queries submitted by users.

-  Order Tracking - View all placed orders and manage their status.

Technologies Used :

-  Frontend: React.js, HTML, CSS, JavaScript, Bootstrap

-  Backend: Node.js, Express.js

-  Database: MongoDB

-  Templating Engine: EJS (for dynamic rendering)

Installation :

Clone the repository :

git clone https://github.com/Dhruvvaria/online-food-delivery.git

Navigate to the project directory:

-  cd online-food-delivery

Install dependencies:

-  npm install

Start the server:

-  npm start

Open the application in your browser:

-  http://localhost:8080/home

Folder Structure :

├── backend
│   ├── models
│   ├── routes
│   ├── controllers
│   ├── middleware
│   ├── config
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── utils
│   ├── assets
├── views
│   ├── layouts
│   ├── partials
├── config
│   ├── db.js
├── .env
├── README.md

Environment Variables

Create a .env file in the root directory and add the following:

MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
PORT=8080

Usage  :

Admin Login:

-  Access admin dashboard at /admin.

-  Add, edit, or remove food listings.

-  View and manage orders.

User Actions:

-  Browse menu, add items to the cart, and place orders.

-  View order details and status.

Screenshots

User Home Page: 

![Home Page](/public/img/home.png)  
![Cart Page](/public/img/cart.png)  
![Contact Page](/public/img/contact.png)  
![Sign in Page](/public/img/signin.png)  


Admin Dashboard:

![Home Page](/public/img/adminhome.png)  
![Order Page](/public/img/adminbooking.png)  
![Contact Page](/public/img/admincontact.png)  
![Sign in Page](/public/img/adminsignin.png)  
![AddNew Item Page](/public/img/addnew.png)  
