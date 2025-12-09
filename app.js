const express = require("express");
const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const loginRoutes = require("./routes/login");
const mongoose = require("mongoose");
const session = require("express-session");
const { default: MongoStore } = require("connect-mongo");
const getEnv = require("getenv");

const app = express();

const User = require("./models/user");


app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');


mongoose.connect(getEnv('MONGODB'))
    .then(() => {
        console.log("Connected to MongoDB");

        app.use(session({
        secret: getEnv("SESSION_SECRET"),
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,  // 1 week
            httpOnly: true,
            secure: false
        },
        store: MongoStore.create({
            client: mongoose.connection.getClient(),
            collectionName: 'sessions',
            stringify: false
        })
    }));

    app.use((req, res, next) => {
        if (!req.session.userId) {
            return next();
        }
        User.findById(req.session.userId)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
    })

    app.use(loginRoutes);
    app.use(shopRoutes);
    app.use('/admin', adminRoutes);

    app.use((req, res) => {
        res.status(404).render('404', {
            title: '404',
            path: '/404',
            isLoggedIn: req.session.isLoggedIn
        });
    });

        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: "Erick",
                    email: "erick@erick.com",
                    cart: {
                        items: []
                    }
                });
                return user.save();
            }
        })  
        .then(() => {
            app.listen(3000, () => {
                console.log("Server is running on port http://127.0.0.1:3000/");
            });
        })
        .catch((error) => {
            console.log(error);
        });
    })
    .catch((error) => {
        console.log(error);
    });
