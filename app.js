const express = require("express");

const app = express();
const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const mongoose = require("mongoose");
const getEnv = require("getenv");

const User = require("./models/user");


app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use((req, res, next) => {
    User.findById("6937324dc4d4f9cefed0974a")
    .then(user => {
        req.user = user;
        next();
    })
    .catch(error => {
        console.log(error);
    });
});

app.use(shopRoutes);
app.use('/admin', adminRoutes);


app.use((req, res) => {
    res.status(404).render('404', {
        title: '404',
        path: '/404'
    });
});


mongoose.connect(getEnv('MONGODB'))
    .then(() => {
        console.log("Connected to MongoDB");
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
