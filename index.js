const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var Vendor = require("./model/vendor");
var multer = require('multer')
var path = require('path')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})


var upload = multer({ storage: storage });
var app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// MongoDB related connection
mongoose.connect("mongodb://localhost/vendordb", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })

mongoose.connection.on("error", (err) => {
    console.log("Error while connecting DB: " + err)
})

mongoose.connection.once("open", () => {
    console.log("DB connected successfully")
})


// Index page url
app.get("/", (req, res) => {
    return res.send({ "detail": "Vendor Microservice" })
})


// Endpoint for getting all vendors
app.get("/vendor", (req, res) => {
    Vendor.find(req.query, (err, vendors) => {
        if (err) {
            return res.status(500).send({ "detail": "Error occurred while fetching vendors", "info": err })
        }
        return res.send({ "detail": "Vendor listing", "data": vendors });
    })
})


// Endpoint for getting single vendor info
app.get("/vendor/:id", (req, res) => {
    Vendor.findById(req.params.id, (err, vendor) => {
        if (err) {
            return res.status(500).send({ "detail": "Error occurred while fetching single vendor", "info": err })
        }
        return res.send(vendor);
    })
})


// Endpoint for creating vendor entity
app.post("/vendor", (req, res) => {
    var vendorInstance = new Vendor(req.body);
    vendorInstance.save((err, vendor) => {
        if (err) {
            return res.status(500).send({ "detail": "Error while creating vendor", "info": err })
        }
        return res.status(201).send({ "detail": "Vendor created successfullly", "data": vendor })
    })
})


// Update vendor API
app.patch("/vendor/:id", (req, res) => {
    Vendor.findByIdAndUpdate(req.params.id, req.body, (err, _) => {
        if (err) {
            return res.status(500).send({ "detail": "Error while updating vendor", "info": err })
        }
        return res.send({ "detail": "Vendor updated successfully" })
    })
})


// Update Vendor Featured Image
app.patch("/vendor/:id/upload", upload.single('profile'), (req, res) => {
    var updateBody = { featuredImage: "http://" + req.headers.host + "/" + req.file.path }
    Vendor.findByIdAndUpdate(req.params.id, updateBody, (err, _) => {
        if (err) {
            return res.status(500).send({ "detail": "Error while updating  profile", "info": err })
        }
        return res.send({ "detail": "Profile update successfully ", "path": "http://" + req.headers.host + "/" + req.file.path })
    })
})



// Delete Vendor API
app.delete("/vendor/:id", (req, res) => {
    Vendor.findOne({ _id: req.params.id }, (err, vendor) => {
        if (!vendor) {
            return res.status(404).send({ "detail": "There isn't vendor entry with given id" })
        }
        if (err) {
            return res.status(500).send({ "detail": "Error ocuured while removing vendor", "info": err })
        }
        vendor.remove();
        return res.status(204).send()
    })
})



// Listening server on port 3000
app.listen(3000, () => {
    console.log("Listening on port 3000")
})