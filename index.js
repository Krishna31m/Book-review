const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users').authenticated;
const genl_routes = require('./router/general').general;

const app = express();
app.use(express.json());

// Setup session middleware for /customer routes
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware for protected routes
app.use("/customer/auth", (req, res, next) => {
    if (req.session.authorization) {
        try {
            jwt.verify(req.session.authorization.accessToken, "access");
            next();
        } catch (err) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
    } else {
        return res.status(403).json({ message: "Forbidden: No token provided" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
