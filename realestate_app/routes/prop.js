const express = require("express");
const router = express.Router();
const Property = require('../models/property');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

// Route: Properties.handlebars
router.get('/properties', (req, res) => {
    if (req.session.user) {
        res.render('properties', { user: req.sesion.user, layout: false, title: "Properties"});
    } else {
        res.redirect('/login');
    }
});



module.exports = router;