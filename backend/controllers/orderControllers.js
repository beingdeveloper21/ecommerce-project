import orderModel from "../models/orderModel.js";
import productModel from '../models/productModel.js';
import userModel from '../models/userModel.js'
import Stripe from 'stripe'

//global variables
const currency='usd'
const deliveryCharge=10
//gateway initialize
const stripe= new Stripe(process.env.STRIPE_SECRET_KEY)

//Place Order using COD Method
const placeOrder = async (req, res) => {
  try {
    const userId = req.headers.userid;
    const { items, amount, address } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid items array" });
    }

    // Validate each itemId in the items array
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


//Place Order using  Stripe Method
// const placeOrderStripe=async(req,res)=>{
//    try{
//     const userId = req.headers.userid;
//     const { items, amount, address } = req.body;
//     const { origin }=req.headers
//     const orderData = {
//         userId,
//         items,
//         address,
//         amount,
//         paymentMethod: "Stripe",
//         payment: false,
//         date: Date.now(),
//       };
//       const newOrder = new orderModel(orderData);
//       await newOrder.save();
//      const line_items= items.map((item)=>({
//         price_data:{
//             currency:currency,
//             product_data:{
//                 name:item.name
//             },
//             unit_amount:item.price*100
//         },
//         quantity:item.quantity

//      }))
//      line_items.push({
//         price_data:{
//             currency:currency,
//             product_data:{
//              name:'Delivery Charges'
//             },
//             unit_amount: deliveryCharge*100
//             },
//             quantity: 1
//      })
//      const session= await stripe.checkout.sessions.create({
//         success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
//         cancel_url:  `${origin}/verify?success=false&orderId=${newOrder._id}`,
//         line_items,
//         mode:'payment',
//      })
//      res.json({success:true,session_url:session.url});
//     }
//    catch(error){
//      console.log(error)
//      res.json({success:false,message:error.message})
//    }

// }
// const placeOrderStripe = async (req, res) => {
//     try {
//       const userId = req.headers.userid;
//       const { items, amount, address } = req.body;
//       const { origin } = req.headers;
  
//       // Ensure amount is multiplied by 100 for Stripe
//       const totalAmount = amount * 100;  // Convert amount to cents (Stripe uses cents)
  
//       // Prepare the order data
//       const orderData = {
//         userId,
//         items,
//         address,
//         amount: totalAmount,  // Store the amount in cents
//         paymentMethod: "Stripe",
//         payment: false,
//         date: Date.now(),
//       };
  
//       const newOrder = new orderModel(orderData);
//       await newOrder.save();
  
//       // Prepare line items for Stripe checkout session
//     //   const line_items = items.map((item) => ({
//     //     price_data: {
//     //       currency: currency,
//     //       product_data: {
//     //         name: item.name,
//     //       },
//     //       unit_amount: Math.round(item.price * 100),  // Multiply by 100 to convert to cents
//     //     },
//     //     quantity: item.quantity,
//     //   }));
  
//     //   // Add delivery charges
//     //   line_items.push({
//     //     price_data: {
//     //       currency: currency,
//     //       product_data: {
//     //         name: 'Delivery Charges',
//     //       },
//     //       unit_amount: deliveryCharge * 100,  // Delivery charge in cents
//     //     },
//     //     quantity: 1,
//     //   });
//     const line_items = items.map((item) => {
//         const price = parseFloat(item.amount); // Ensure price is a valid number
//         if (isNaN(price) || price <= 0) {
//             throw new Error(`Invalid price for item: ${item.name}`);
//         }
//         return {
//             price_data: {
//                 currency: currency,
//                 product_data: { name: item.name },
//                 unit_amount: Math.round(price * 100), // Convert to cents
//             },
//             quantity: item.quantity,
//         };
//     });
    
//     if (deliveryCharge && deliveryCharge > 0) {
//         line_items.push({
//             price_data: {
//                 currency: currency,
//                 product_data: { name: 'Delivery Charges' },
//                 unit_amount: Math.round(deliveryCharge * 100),
//             },
//             quantity: 1,
//         });
//     } else {
//         console.error('Invalid or missing deliveryCharge');
//     }
    
  
//       // Create the Stripe session
//       const session = await stripe.checkout.sessions.create({
//         success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
//         cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
//         line_items,
//         mode: 'payment',
//       });
  
//       // Return the session URL
//       res.json({ success: true, session_url: session.url });
  
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };
  
const placeOrderStripe = async (req, res) => {
    try {
        const userId = req.headers.userid;
        console.log(req.headers)
        const { items, amount, address } = req.body;
        const  origin  = req.headers.origin;
        console.log("Origin:", origin);

        // Validate the amount (in dollars)
        if (!amount || typeof amount !== "number" || amount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount" });
        }

        // Prepare the order data in dollars
        const orderData = {
            userId,
            items,
            address,
            amount, // Store amount in dollars
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now(),
        };

        // Save order to the database
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Prepare line items for Stripe in cents
        const line_items = items.map((item) => {
            const price = parseFloat(item.amount); // Ensure price is valid
            if (isNaN(price) || price <= 0) {
                throw new Error(`Invalid price for item: ${item.name}`);
            }
            return {
                price_data: {
                    currency: "usd",
                    product_data: { name: item.name },
                    unit_amount: Math.round(price * 100), // Convert dollars to cents
                },
                quantity: item.quantity,
            };
        });

        // Add delivery charges if applicable (convert dollars to cents for Stripe)
        if (deliveryCharge && deliveryCharge > 0) {
            line_items.push({
                price_data: {
                    currency: "usd",
                    product_data: { name: "Delivery Charges" },
                    unit_amount: Math.round(deliveryCharge * 100),
                },
                quantity: 1,
            });
        }

        // Create Stripe session
        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: "payment",
        });

        // Return session URL
        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error("Error placing Stripe order:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// const verifyStripe=async(req,res)=>{
//   const { orderId,success}=req.body
//   const userId = req.headers.userid;
//   try{
//     if (!orderId || !userId) {
//         return res.status(400).json({ success: false, message: 'Order ID and User ID are required' });
//     }
//     console.log('Verify Stripe - Order ID:', orderId, 'Success:', success);
//        if(success===true){
//         await orderModel.findByIdAndUpdate(orderId,{payment:true});
//         await userModel.findByIdAndUpdate(userId,{cartData:{}})
//         res.json({success:true})

//        }
//        else{
//         await orderModel.findByIdAndDelete(orderId)
//         res.json({success:false})
//        }
//   }
//   catch(error){
//     console.log(error)
//     res.json({success:false,message:error.message})
//   }

// }
const verifyStripe = async (req, res) => {
    const { orderId, success } = req.body;
    const userId = req.headers.userid;

    console.log('Incoming Request Body:', req.body);
    console.log('Incoming User ID from Headers:', userId);

    if (!orderId || !userId) {
        console.log('Missing orderId or userId:', { orderId, userId });
        return res.status(400).json({ success: false, message: 'Order ID and User ID are required' });
    }

    try {
        if (success === true) {
            const orderUpdateResult = await orderModel.findByIdAndUpdate(orderId, { payment: true });
            console.log('Order Update Result:', orderUpdateResult);

            const userUpdateResult = await userModel.findByIdAndUpdate(userId, { cartData: {} });
            console.log('User Update Result:', userUpdateResult);

            res.json({ success: true });
        } else {
        //     const orderDeleteResult = await orderModel.findByIdAndDelete(orderId);
        //     console.log('Order Delete Result:', orderDeleteResult);
        //     if (!orderDeleteResult) {
        //         console.log('Failed to delete order:', orderId);
        //         return res.status(404).json({ success: false, message: 'Order not found for deletion' });
        //     }
        //     res.json({ success: false });
        // }
        const order = await orderModel.findById(orderId);
            if (!order) {
                console.log('Order not found for deletion:', orderId);
                return res.status(404).json({ success: false, message: 'Order not found' });
            }

            // Delete the order if it exists
            const orderDeleteResult = await orderModel.findByIdAndDelete(orderId);
            console.log('Order Delete Result:', orderDeleteResult);
            
            return res.json({ success: false, message: 'Order deleted due to payment failure' });
        }
    } catch (error) {
        console.error('Error in verifyStripe:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

//Place Order using Razorpay Method

//All ordes data for admin panel
const allOrders=async(req,res)=>{
    try{
      const orders=await orderModel.find({})
      res.json({success:true,orders})
    }
    catch(error){
      console.log(error)
      res.json({success:false,message:error.message})
    }
}
//User Order Data for Frontend
// Fetch User Order Data for Frontend
// const userOrders = async (req, res) => {
//     try {
//       // Extract userId from request headers
//       const userId = req.headers.userid;
  
//       if (!userId) {
//         return res
//           .status(400)
//           .json({ success: false, message: "User ID is required" });
//       }
  
//       // Find orders in the database that match the userId
//       const orders = await orderModel.find({ userId }).sort({ date: -1 }); // Sorting by date in descending order
  
//       if (!orders || orders.length === 0) {
//         return res
//           .status(404)
//           .json({ success: false, message: "No orders found for this user" });
//       }
  
//       res.json({
//         success: true,
//         message: "Orders fetched successfully",
//         orders,
//       });
//     } catch (error) {
//       console.error("Error fetching user orders:", error);
//       res
//         .status(500)
//         .json({ success: false, message: "Failed to fetch orders", error });
//     }
//   };
const userOrders = async (req, res) => {
    try {
      const userId = req.headers.userid;
  
      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "User ID is required" });
      }
  
      // Fetch orders for the user
      const orders = await orderModel.find({ userId }).sort({ date: -1 });
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No orders found for this user",
        });
      }
  
      // Enhance order data by populating product details for each item
      const enhancedOrders = await Promise.all(
        orders.map(async (order) => {
          const enhancedItems = await Promise.all(
            order.items.map(async (item) => {
              const product = await productModel.findById(item._id).select('amount image  name');
              console.log('Product:', product); // Fetch product details
              return {
                ...item,
                amount: product?.amount || null, // Include price if available
                image: product?.image || null, // Include image if available
                name: product?.name || "Unknown Product",
              };
            })
          );
          return { ...order._doc, items: enhancedItems }; // Merge enhanced items back into the order
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
  
//Update Order Status from Admin Panel
const updateStatus=async(req,res)=>{
 try{
const {orderId,status}=req.body
await orderModel.findByIdAndUpdate(orderId,{status})
res.json({success:true,message:'Status updated'})
 }
 catch(error){
    console.log(error)
    res.json({success:false,message:error.message})
 }
}
export {placeOrder,placeOrderStripe,placeOrderRazorpay,allOrders,userOrders,updateStatus,verifyStripe}