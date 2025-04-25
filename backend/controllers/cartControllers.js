import userModel from "../models/userModel.js"

//add products to user cart
// const addToCart=async(req,res)=>{
//    try{
//      const {itemId,size}=req.body
//      console.log(req.body)
//      const userData = await userModel.findById(userId)
//      let cartData = await userData.cartData;
//      if(cartData[itemId]){
//         if(cartData[itemId][size]){
//             cartData[itemId][size] +=1
//         }
//         else{
//             cartData[itemId][size]=1
//         }
//      }
//      else{
//         cartData[itemId]={}
//         cartData[itemId][size]=1
//      }
//      await userModel.findByIdAndUpdate(userId,{cartData})
//      res.json({success:true,message:"Added to Cart"})
//    }
//    catch(error){
//        console.log(error)
//        res.json({success:false,message:error.message})
//    }
// }
// const addToCart = async (req, res) => {
//     try {
//         // Extract userId, itemId, and size from the request body
//         console.log("Request Headers:", req.headers); // Check headers
//         console.log("Request Body:", req.body); // Check body
//         const {  itemId, size } = req.body;
//         const userId = req.headers.userid; 
//         console.log("User ID in backend:", userId);
//         if (!userId) {
//             return res.status(400).json({ success: false, message: "User ID is required" });
//         }

      

//         // Retrieve the user data using the userId
//         const userData = await userModel.findById(userId);
//         if (!userData) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         let cartData = userData.cartData || {}

//         // Update the cart data
//         if (cartData[itemId]) {
//             if (cartData[itemId][size]) {
//                 cartData[itemId][size] += 1;
//             } else {
//                 cartData[itemId][size] = 1;
//             }
//         } 
//         else {
//             cartData[itemId] = { [size]: 1 }; // Initialize item with size and quantity
//         }

//         // Save the updated cart data
//         await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });

//         res.json({ success: true, message: "Added to Cart" });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };
const addToCart = async (req, res) => {
    try {
        const userId = req.headers.userid;
        const { itemId, size } = req.body;

        // Validation
        if (!userId || !itemId || !size) {
            return res.status(400).json({ success: false, message: "Invalid input" });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};

        if (cartData[itemId]) {
            cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
        } else {
            cartData[itemId] = { [size]: 1 };
        }

        await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
        res.json({ success: true, message: "Added to Cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


//Update user cart 
// const updateCart=async(req,res)=>{
//    try{
//     console.log("Request Headers:", req.headers); // Check headers
//     console.log("Request Body:", req.body); // Check body
//  const {itemId,size,quantity} = req.body ;
//  const userId = req.headers.userid; 
//  const userData = await userModel.findById(userId)
//  let cartData = await userData.cartData || {}
//  if (cartData[itemId]) {
//     if (cartData[itemId][size]) {
//         cartData[itemId][size] -= 1;
//     }
//  cartData[itemId][size]=quantity
//  await userModel.findByIdAndUpdate(userId,{cartData}, { new: true })
//  if(quantity===0){
//     await userModel.findByIdAndUpdate(userId,{cartData:{}})
//  }
//  res.json({success:true,message:"Cart Updated"})

//    }
// }
//    catch(error){
//     console.log(error)
//     res.json({success:false,message:error.message})
//    }
// }
// const updateCart = async (req, res) => {
//     try {
//         console.log("Request Headers:", req.headers); // Check headers
//         console.log("Request Body:", req.body); // Check body

//         const { itemId, size, quantity } = req.body;
//         const userId = req.headers.userid;

//         // Validate input
//         if (!itemId || !size || quantity === undefined || !userId) {
//             return res.status(400).json({ success: false, message: "Invalid input" });
//         }

//         const userData = await userModel.findById(userId);
//         if (!userData) {
//             return res.status(404).json({ success: false, message: "User  not found" });
//         }

//         let cartData = userData.cartData || {};

//         // Initialize item and size if they don't exist
//         if (!cartData[itemId]) {
//             cartData[itemId] = {};
//         }
//         if (!cartData[itemId][size]) {
//             cartData[itemId][size] = 0;
//         }

//         // Update the quantity
//         if (quantity === 0) {
//             delete cartData[itemId][size]; // Remove the item if quantity is 0
//         } else {
//             cartData[itemId][size] = quantity; // Set the new quantity
//         }

//         // Update the user's cart in the database
//         await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });

//         res.json({ success: true, message: "Cart Updated" });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };
const updateCart = async (req, res) => {
    try {
        const userId = req.headers.userid;
        const { itemId, size, quantity } = req.body;

        if (!userId || !itemId || !size || quantity === undefined) {
            return res.status(400).json({ success: false, message: "Invalid input" });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};

        if (quantity === 0) {
            delete cartData[itemId]?.[size];
            if (Object.keys(cartData[itemId] || {}).length === 0) {
                delete cartData[itemId];
            }
        } else {
            cartData[itemId] = cartData[itemId] || {};
            cartData[itemId][size] = quantity;
        }

        await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
        res.json({ success: true, message: "Cart updated", cartData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

//Get User Cart Data
// const getUserCart=async(req,res)=>{
//     try{
//         const userId = req.headers.userid; 
//    const userData = await userModel.findById(userId)
//     const cartData =  userData.cartData||{};
//     res.json({success:true,cartData})
//     }
//     catch(error){
//         console.log(error)
//     res.json({success:false,message:error.message})
//     }
// }
const getUserCart = async (req, res) => {
    try {
        const userId = req.headers.userid;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, cartData: userData.cartData || {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export {addToCart,updateCart,getUserCart}