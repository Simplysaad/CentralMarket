const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true }, // Category name
        description: { type: String }, // Optional description
        image_url: { type: String }, // Optional image for category
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null
        }, // For nested categories
        ancestors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }], // For quick tree traversal
        keywords: [{ type: String }],
        is_active: { type: Boolean, default: true }, // For soft deletes/hiding
        order: { type: Number, default: 0 }, // For custom sorting
        post_count: { type: Number, default: 0 } // Denormalized for fast stats
    },
    {
        timestamps: true
    }
);
categorySchema.virtual("slug").get(function () {
    let regex = new RegExp("[^\\w]+", "ig");
    return this.title.replace(regex, "-") + "--" + this._id;
});

categorySchema.index({ slug: 1 }, { unique: true });
module.exports = new mongoose.model("category", categorySchema);
