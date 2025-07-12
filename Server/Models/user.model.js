const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    authentication: {
        _id: false,
        emailAddress: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String
        },
        recoveryEmail: {
            type: String
        },
        role: {
            type: String,
            enum: ["admin", "vendor", "customer"],
            default: "customer"
            //required: true
        }
    },
    demographics: {
        _id: false,
        name: String,
        birthDate: Date,
        gender: {
            type: String,
            enum: ["male", "female"]
        },
        language: String,
        profileImage: {
            type: String,
            default: "https://placehold.co/400x400"
        }
    },
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }
    ],
    addresses: [
        {
            _id: false,
            type: {
                type: String,
                enum: ["billing", "delivery", "primary"]
            },
            street: String,
            city: String,
            school: String,
            state: String,
            country: {
                type: String,
                default: "nigeria"
            },
            isPrimary: Boolean
        }
    ],
    business: {
        name: String,
        description: {
            type: String
        },
        category: String,
        coverImage: {
            type: String,
            default: "https://placehold.co/600x200?text=CentralMarket+Store"
        },
        averageRating: {
            type: Number,
            default: 5
        },
        status: {
            type: String,
            enum: ["verified", "rejected", "pending"],
            default: "pending"
        },
        socials: [
            {
                _id: false,
                name: String,
                url: String
            }
        ],

        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users"
            }
        ]
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products" // i shall create a new collection for wishlists
            // ref: "wishlists"
        }
    ],
    bank: {
        _id: false,
        bankName: String,
        accountName: String,
        accountNumber: String
    },
    behavioral_data: {
        device_profiles: [
            {
                device_id: String,
                device_type: String, // 'mobile', 'desktop', 'tablet'
                os: String,
                browser: String,
                last_used: Date
            }
        ],
        preferred_categories: [String], // Top 3 product categories
        wishlist_items: [String],
        recent_searches: [
            {
                query: String,
                timestamp: Date
            }
        ],
        cookie_consent: {
            analytics: Boolean,
            marketing: Boolean,
            timestamp: Date
        }
    },
    security: {
        _id: false,
        failed_login_attempts: Number,
        last_password_change: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.index({ "authentication.emailAddress": 1 }, { unique: true });
userSchema.index({ "business.name": 1 });
userSchema.index({ "business.followers": 1 });
userSchema.index({ following: 1 });
userSchema.index({ wishlists: 1 });

userSchema.virtual("slug").get(function () {
    let regex = new RegExp("[^\\w]+", "ig");
    return this.title.replace(regex, "-") + "--" + this._id;
});

module.exports = new mongoose.model("user", userSchema);
