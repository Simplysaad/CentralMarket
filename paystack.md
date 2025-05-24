I want it to be such that when a user adds a number of items to their cart, and wants to checkout, they are redirected to a paystack page to make payments, then I recieve a response if the payment is successful or not, how can I do this, with expressjs code

To implement a checkout flow in Express.js where users add items to a cart, get redirected to Paystack’s payment page, and you receive a payment success response, follow this approach:

---

## Step 1: Initialize Payment on Your Server

Create an Express route that accepts the cart total and user email, then calls Paystack’s **Initialize Transaction** API to get a payment URL.

Example controller code:

```js
const https = require('https');

const initializePayment = (req, res) => {
  const { email, amount } = req.body; // amount in Naira

  const data = JSON.stringify({
    email,
    amount: amount * 100, // convert to kobo
  });

  const options = {
    hostname: 'api.paystack.co',
    path: '/transaction/initialize',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

  const request = https.request(options, (response) => {
    let responseData = '';

    response.on('data', (chunk) => {
      responseData += chunk;
    });

    response.on('end', () => {
      const paystackResponse = JSON.parse(responseData);
      if (paystackResponse.status) {
        // Send authorization_url to frontend for redirect
        res.json({ authorization_url: paystackResponse.data.authorization_url });
      } else {
        res.status(400).json({ error: paystackResponse.message });
      }
    });
  });

  request.on('error', (err) => {
    res.status(500).json({ error: 'Payment initialization failed' });
  });

  request.write(data);
  request.end();
};

module.exports = { initializePayment };
```


Example response


```js

{
  "status": true,
  "message": "Authorization URL created",
  "data": {
    "authorization_url": "https://checkout.paystack.com/nkga9t86rrs0de7",
    "access_code": "nkga9t86rrs0de7",
    "reference": "i2wvrsp9sq"
  }
}

```
---

## Step 2: Frontend Redirect

Your frontend calls this endpoint with the user’s email and cart total, then redirects the user to the returned `authorization_url` where they complete payment.

```js

window.location.href = data.authorization_url

```

---

## Step 3: Handle Payment Verification (Webhook or Callback)

After payment, Paystack can redirect the user to your callback URL with a reference query parameter. Create an Express route to verify the transaction status:

```js
const verifyPayment = (req, res) => {
  const reference = req.query.reference;

  const options = {
    hostname: 'api.paystack.co',
    path: `/transaction/verify/${reference}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  };

  const request = https.request(options, (response) => {
    let responseData = '';

    response.on('data', (chunk) => {
      responseData += chunk;
    });

    response.on('end', () => {
      const paystackResponse = JSON.parse(responseData);
      if (paystackResponse.status && paystackResponse.data.status === 'success') {
        // Payment successful, update order status in your DB
        res.json({ message: 'Payment successful', data: paystackResponse.data });
      } else {
        res.status(400).json({ error: 'Payment verification failed' });
      }
    });
  });

  request.on('error', (err) => {
    res.status(500).json({ error: 'Verification error' });
  });

  request.end();
};

module.exports = { verifyPayment };
```


Example response
```js


{
  "status": true,
  "message": "Verification successful",
  "data": {
    "id": 4893376150,
    "domain": "test",
    "status": "success",
    "reference": "i2wvrsp9sq",
    "receipt_number": null,
    "amount": 20000,
    "message": null,
    "gateway_response": "Successful",
    "paid_at": "2025-04-21T23:26:13.000Z",
    "created_at": "2025-04-21T23:25:20.000Z",
    "channel": "card",
    "currency": "NGN",
    "ip_address": "102.89.75.91",
    "metadata": "",
    "log": {
      "start_time": 1745277954,
      "time_spent": 19,
      "attempts": 1,
      "errors": 0,
      "success": true,
      "mobile": false,
      "input": [],
      "history": [
        {
          "type": "action",
          "message": "Attempted to pay with card",
          "time": 18
        },
        {
          "type": "success",
          "message": "Successfully paid with card",
          "time": 19
        }
      ]
    },
    "fees": 300,
    "fees_split": null,
    "authorization": {
      "authorization_code": "AUTH_mr5awwnhv7",
      "bin": "408408",
      "last4": "4081",
      "exp_month": "12",
      "exp_year": "2030",
      "channel": "card",
      "card_type": "visa ",
      "bank": "TEST BANK",
      "country_code": "NG",
      "brand": "visa",
      "reusable": true,
      "signature": "SIG_4EROdWClHS9KBY7m79i5",
      "account_name": null
    },
    "customer": {
      "id": 264996477,
      "first_name": null,
      "last_name": null,
      "email": "saadidris70@gmail.com",
      "customer_code": "CUS_1418rkipmryttdd",
      "phone": null,
      "metadata": null,
      "risk_action": "default",
      "international_format_phone": null
    },
    "plan": null,
    "split": {},
    "order_id": null,
    "paidAt": "2025-04-21T23:26:13.000Z",
    "createdAt": "2025-04-21T23:25:20.000Z",
    "requested_amount": 20000,
    "pos_transaction_data": null,
    "source": null,
    "fees_breakdown": null,
    "connect": null,
    "transaction_date": "2025-04-21T23:25:20.000Z",
    "plan_object": {},
    "subaccount": {}
  }
}

```


---

## Step 4: (Optional) Use Webhooks for Instant Payment Notification

Set up a webhook endpoint to receive Paystack payment events and update your system immediately when payment status changes.

---

## Summary of Routes

| Route                     | Method | Purpose                                |
|---------------------------|--------|--------------------------------------|
| `/api/paystack/initialize`| POST   | Initialize payment, get redirect URL |
| `/api/paystack/verify`    | GET    | Verify payment status by reference    |
| `/api/paystack/webhook`   | POST   | (Optional) Receive payment events     |

---

This approach ensures:

- User is redirected to Paystack payment page securely.  
- You verify payment status before fulfilling orders.  
- You can notify users and update your database accordingly.

For full examples and best practices, see the detailed Express.js Paystack integration in [search result 1](https://blog.bitsrc.io/accepting-payments-with-paystack-api-in-node-js-and-express-js-implementation-and-best-practices-65bc0e7e3efb) and [search result 6](https://dev.to/yemiklein/how-to-implement-paystack-payment-integration-in-nodejs-2okg).

Citations:
[1] Accepting Payments with Paystack API in Node.js and Express.js https://blog.bitsrc.io/accepting-payments-with-paystack-api-in-node-js-and-express-js-implementation-and-best-practices-65bc0e7e3efb
[2] Integrate Paystack API into your Node.js Apps using ... - YouTube https://www.youtube.com/watch?v=vZ4KJPFuse0
[3] Creating a Simple Payment System in Node.js and MongoDb Using ... https://dev.to/kizito007/creating-a-simple-payment-system-in-nodejs-and-mongodb-using-paystack-a-step-by-step-guide-2mc4
[4] Accept Payments | Paystack Developer Documentation https://paystack.com/docs/payments/accept-payments/
[5] ubylabs/Paystack-API-Integration - GitHub https://github.com/dhelafrank/Paystack-API-Integration
[6] How to implement Paystack payment integration in Nodejs https://dev.to/yemiklein/how-to-implement-paystack-payment-integration-in-nodejs-2okg
[7] Build a BANK App - ( Payment Integration With Paystack in Nodejs ) https://www.youtube.com/watch?v=ZIZ66aEOenI
[8] How to Integrate Paystack with NestJS (Node.js) - YouTube https://www.youtube.com/watch?v=wn7Lxx5ugoo
