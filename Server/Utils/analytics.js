const handleAnalytics = (req, res, next) => {};
const mongoose = require("mongoose");

const analyticsSchema2 = new mongoose.Schema({
    _id: "ObjectId",
    event_time: "ISODate", // Timestamp of the event in UTC
    event_type: "string", // e.g., "page_view", "add_to_cart", "purchase", "checkout_start", "cart_abandon"
    user_id: "string|null", // Permanent user ID if logged in, else null
    user_session: "string", // Session identifier to group events within a visit
    product_id: "string|null", // Product involved, if any
    category_id: "string|null", // Product category ID
    category_code: "string|null", // Category code or slug
    brand: "string|null", // Product brand
    price: "number|null", // Product price at event time
    quantity: "number|null", // Quantity involved (e.g., added to cart)
    currency: "string|null", // Currency code, e.g., "USD"
    referrer_url: "string|null", // URL user came from before this event
    page_url: "string|null", // URL where event occurred
    device_type: "string|null", // e.g., "mobile", "desktop", "tablet"
    browser: "string|null", // Browser info
    ip_address: "string|null", // For geolocation and fraud detection (privacy permitting)
    utm_source: "string|null", // Marketing campaign source
    utm_medium: "string|null", // Marketing campaign medium
    utm_campaign: "string|null", // Campaign name
    payment_method: "string|null", // e.g., "credit_card", "paypal" (for purchase events)
    order_id: "string|null", // Order identifier (for purchase events)
    cart_id: "string|null", // Cart/session identifier (for cart events)
    abandon_reason: "string|null", // Optional reason for cart abandonment (if captured)
    additional_data: "object|null" // Flexible field for extra custom info (e.g., coupon codes, discounts)
});
const analyticsSchema = new mongoose.Schema({
    _id: "ObjectId",
    event_time: "ISODate", // Timestamp of the event
    event_type: "string", // e.g. "page_view", "add_to_cart", "purchase", "remove_from_cart", "checkout_initiated"
    user_id: "string|null", // Logged-in user ID or null for guests
    session_id: "string", // Session identifier to group user events
    product_id: "string|null", // ID of the product involved, if applicable
    vendor_id: "string|null", // Vendor/seller ID related to the product/event
    category_id: "string|null", // Product category ID
    category_code: "string|null", // Product category code or slug
    brand: "string|null", // Product brand
    price: "number|null", // Product price at time of event
    quantity: "number|null", // Quantity involved in event (e.g., add 2 to cart)
    currency: "string|null", // Currency code, e.g. "USD"
    referrer_url: "string|null", // URL of the page user came from
    page_url: "string|null", // URL of the page where event happened
    user_agent: "string|null", // Browser or device info
    ip_address: "string|null", // User IP address (for geolocation, privacy permitting)
    additional_data: "object|null" // Any extra custom info, e.g. promotion codes, coupon used, payment method
});

//WHAT TO TRACK

customerSchema = {
    user_id: "string", // Unique user identifier (UUID)
    authentication: {
        email: "string", // Primary contact
        phone: "string", // Verified phone number
        password_hash: "string", // Encrypted password
        multi_factor_enabled: "boolean"
    },
    demographics: {
        first_name: "string",
        last_name: "string",
        birth_date: "ISODate",
        gender: "string", // Optional: 'male', 'female', 'non-binary'
        preferred_language: "string" // e.g., 'en-US'
    },
    contact_info: {
        addresses: [
            {
                type: "string", // 'billing', 'shipping', 'primary'
                street: "string",
                city: "string",
                state: "string",
                postal_code: "string",
                country: "string",
                is_primary: "boolean"
            }
        ],
        communication_preferences: {
            email_marketing: "boolean",
            sms_notifications: "boolean",
            push_notifications: "boolean"
        }
    },
    account_metrics: {
        registration_date: "ISODate",
        last_login: "ISODate",
        account_status: "string", // 'active', 'inactive', 'suspended'
        loyalty_tier: "string", // 'bronze', 'silver', 'gold'
        lifetime_value: "number", // Total revenue generated
        order_count: "integer",
        average_order_value: "number",
        last_purchase_date: "ISODate"
    },
    behavioral_data: {
        device_profiles: [
            {
                device_id: "string",
                device_type: "string", // 'mobile', 'desktop', 'tablet'
                os: "string",
                browser: "string",
                last_used: "ISODate"
            }
        ],
        preferred_categories: ["string"], // Top 3 product categories
        wishlist_items: ["product_id"],
        recent_searches: [
            {
                query: "string",
                timestamp: "ISODate"
            }
        ],
        cookie_consent: {
            analytics: "boolean",
            marketing: "boolean",
            timestamp: "ISODate"
        }
    },
    vendor_interactions: {
        followed_vendors: ["vendor_id"],
        vendor_ratings: [
            {
                vendor_id: "string",
                rating: "integer", // 1-5 scale
                review: "string",
                timestamp: "ISODate"
            }
        ]
    },
    security: {
        failed_login_attempts: "integer",
        last_password_change: "ISODate",
        ip_whitelist: ["string"]
    },
    metadata: {
        data_source: "string", // 'web', 'mobile_app', 'api'
        created_at: "ISODate",
        updated_at: "ISODate",
        data_version: "integer"
    }
};
