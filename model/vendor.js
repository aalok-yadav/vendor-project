const mongoose = require("mongoose");

// Vendor Schema Declaration
var VendorSchema = new mongoose.Schema({
    "brandName": { type: String, required: true },
    "slug": { type: String, required: true, unique: true },
    "featuredImage": { type: String, required: false, default: null },
    "city": { type: String, required: true },
    "vendorType": { type: String, required: true },
    "startingPackage": { type: Number, required: true },
    "published": { type: Boolean, default: false, required: false },
    "softDelete": { type: Boolean, default: false, required: false },
    "createdAt": { type: Date, default: Date.now() }
})

module.exports = mongoose.model("Vendor", VendorSchema);