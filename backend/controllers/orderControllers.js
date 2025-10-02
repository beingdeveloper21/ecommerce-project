// Load environment variables first
import dotenv from "dotenv";
dotenv.config();

import orderModel from "../models/orderModel.js";
import productModel from '../models/productModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';

// Global variables
const currency = 'usd';
const deliveryCharge = 10;

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// Place Order using COD Method
const placeOrder = async (req, res) => {
  try {
    const userId = req.headers.userid;
    const { items, amount, address } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid items array" });
    }

    for (const item of items) {
      if (!item._id || typeof item._id !== "string") {
        return res.status(400).json({ success: false, message: "Invalid itemId in items array" });
      }
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Place Order using Stripe
const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.headers.userid;
    const { items, amount, address } = req.body;
    const origin = req.headers.origin;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map(item => {
      const price = parseFloat(item.amount);
      if (isNaN(price) || price <= 0) {
        throw new Error(`Invalid price for item: ${item.name}`);
      }
      return {
        price_data: {
          currency,
          product_data: { name: item.name },
          unit_amount: Math.round(price * 100),
        },
        quantity: item.quantity,
      };
    });

    if (deliveryCharge && deliveryCharge > 0) {
      line_items.push({
        price_data: {
          currency,
          product_data: { name: "Delivery Charges" },
          unit_amount: Math.round(deliveryCharge * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error placing Stripe order:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Stripe Payment
const verifyStripe = async (req, res) => {
  const { orderId, success } = req.body;
  const userId = req.headers.userid;

  if (!orderId || !userId) {
    return res.status(400).json({ success: false, message: 'Order ID and User ID are required' });
  }

  try {
    if (success === true) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      const order = await orderModel.findById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: 'Order deleted due to payment failure' });
    }
  } catch (error) {
    console.error('Error in verifyStripe:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// All Orders for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// User Orders
const userOrders = async (req, res) => {
  try {
    const userId = req.headers.userid;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found for this user" });
    }

    const enhancedOrders = await Promise.all(
      orders.map(async order => {
        const enhancedItems = await Promise.all(
          order.items.map(async item => {
            const product = await productModel.findById(item._id).select('amount image name');
            return {
              ...item,
              amount: product?.amount || null,
              image: product?.image || null,
              name: product?.name || "Unknown Product",
            };
          })
        );
        return { ...order._doc, items: enhancedItems };
      })
    );

    res.json({
      success: true,
      message: "Orders fetched successfully",
      orders: enhancedOrders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error,
    });
  }
};

// Update Order Status (Admin)
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus, verifyStripe };
