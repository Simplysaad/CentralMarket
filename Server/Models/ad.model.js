const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdCreativeSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["image", "video", "carousel", "text", "banner"],
            required: true
        },
        mediaUrls: [String], // URLs for images/videos etc.
        headline: String,
        description: String,
        callToAction: String,
        destinationUrl: { type: String, required: true }
    },
    { _id: false }
);

const TargetingSchema = new Schema(
    {
        keywords: [String],
        categories: [String],
        demographics: {
            ageRange: { min: Number, max: Number },
            gender: {
                type: String,
                enum: ["male", "female", "all"],
                default: "all"
            },
            locations: [String]
        },
        interests: [String],
        behaviors: [String]
    },
    { _id: false }
);

const MetricsSchema = new Schema(
    {
        impressions: { type: Number, default: 0 },
        clicks: { type: Number, default: 0 },
        conversions: { type: Number, default: 0 },
        spend: { type: Number, default: 0 }, // amount spent in currency unit
        ctr: { type: Number, default: 0 }, // click-through rate
        cpc: { type: Number, default: 0 }, // cost per click
        cpa: { type: Number, default: 0 }, // cost per acquisition/conversion
        updatedAt: { type: Date, default: Date.now }
    },
    { _id: false }
);

const AdSchema = new Schema({
    campaignId: {
        type: Schema.Types.ObjectId,
        ref: "Campaign",
        required: true
    },
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    adType: {
        type: String,
        enum: [
            "search",
            "display",
            "sponsored_listing",
            "retargeting",
            "social",
            "video",
            "native"
        ],
        required: true
    },
    creatives: [AdCreativeSchema],
    targeting: TargetingSchema,
    budget: {
        daily: { type: Number, required: true },
        total: { type: Number, required: true }
    },
    bidStrategy: { type: String, enum: ["cpc", "cpm", "cpa"], default: "cpc" },
    status: {
        type: String,
        enum: ["active", "paused", "completed", "draft"],
        default: "draft"
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    metrics: MetricsSchema,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update updatedAt on save
AdSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.export = mongoose.model("Ad", AdSchema);
