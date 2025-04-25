// import React, { useContext,useState,useEffect } from 'react'
// import { ShopContext } from '../context/ShopContext'
// import Title from '../components/Title'
// import { assets } from '../assets/assets'
// import axios from 'axios'

// const Orders = () => {
//   const {backendUrl,token,currency}=useContext(ShopContext)
//   const[orderData,setorderData]=useState([])
//   // const loadOrderData=async()=>{
    
//   //   try{

//   //   const token = localStorage.getItem("token");
//   //   console.log(token)
//   //   const userId = localStorage.getItem("userId");
//   //   console.log(userId)
//   //   if(!token){
//   //     return null
//   //   }
//   //   const response=await axios.get(backendUrl+'/api/order/userorders',{},{headers:{token,userId}})
//   //   if(response.data.success){
//   //     let allOrdersItems=[]
//   //     response.data.orders.map((order)=>{
//   //    order.items.map((item)=>{
//   //     item['status']=order.status
//   //     item['payment']=order.payment
//   //     item['paymentMethod']=order.paymentMethod
//   //     item['date']=order.Date
//   //     allOrdersItems.push(item)

//   //    })
//   //     })
//   //     setorderData(allOrdersItems.reverse())
//   //   }
    
//   //   }
//   //   catch(error){

//   //   }
//   // }
//   const loadOrderData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const userId = localStorage.getItem("userId");
//       if (!token) return;
  
//       const response = await axios.get(`${backendUrl}/api/order/userorders`, {
//         headers: { token, userId },
//       });
  
//       if (response.data.success) {
//         setorderData(response.data.orders.reverse()); // Update state with the orders
//       } else {
//         console.error("Failed to fetch orders:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error loading order data:", error);
//     }
//   };
  
//   useEffect(() => {
//    loadOrderData()
//   }, [token])
  
//   return (
//     <div className='border-t pt-16'>
//       <div className='text-2xl'>
//         <Title text1={'MY'} text2={' ORDRERS'}/>
//       </div>
//       <div >
//         {/* {
//           orderData.map((item,index)=>(
//            <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row items-center justify-center gap-4 '>
//             <div className='flex items-start  gap-6 text-sm'>
//               <img  className='w-16 sm:w-20' src={item.image[0]} alt=" " />
//               <div>
//                 <p className='sm:text-base font-medium'>
//                   {item.name}
//                 </p>
//                 <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
//                   <p>{currency}{item.price}</p>
//                   <p>Quantity:{item.quantity}</p>
//                   <p>Size:{item.size}</p>
//                   </div>
//                   <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}
//                     </span></p>
//                   <p className='mt-1'>Payment: <span className='text-gray-400'>{item.paymentMethod}
//                     </span></p>
//                 </div>
//               </div>
//               <div className='md:w-1/2 flex justify-between'>
//               <div className='flex items-center gap-2'>
//                 <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
//                 <p className='text-sm md:text-base'>{item.status}</p>
//                 </div>
//                 <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
//                 </div>
//           </div>
//           ))
//         } */}
//         {
//   orderData.map((item, index) => (
//     <div
//       key={index}
//       className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row items-center justify-center gap-4"
//     >
//       <div className="flex items-start gap-6 text-sm">
//         {/* Use a placeholder image if item.image[0] is unavailable */}
//         <img
//           className="w-16 sm:w-20"
//           src={item.image?.[0] || "/placeholder-image.jpg"}
//           alt={item.name || "Product Image"}
//         />
//         <div>
//           <p className="sm:text-base font-medium">{item.name || "Unknown Product"}</p>
//           <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
//             <p>{currency}{item.price}</p>
//             <p>Quantity: {item.quantity || 0}</p>
//             <p>Size: {item.size || "N/A"}</p>
//           </div>
//           <p className="mt-1">
//             Date:{" "}
//             <span className="text-gray-400">
//               {item.date ? new Date(item.date).toDateString() : "Unknown"}
//             </span>
//           </p>
//           <p className="mt-1">
//             Payment:{" "}
//             <span className="text-gray-400">{item.paymentMethod || "Unknown"}</span>
//           </p>
//         </div>
//       </div>
//       <div className="md:w-1/2 flex justify-between">
//         <div className="flex items-center gap-2">
//           <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
//           <p className="text-sm md:text-base">{item.status || "Pending"}</p>
//         </div>
//         <button onClick={loadOrderData} className="border px-4 py-2 text-sm font-medium rounded-sm">
//           Track Order
//         </button>
//       </div>
//     </div>
//   ))
// }


//       </div>
//     </div>
//   )
// }

// export default Orders
// import React, { useContext, useState, useEffect } from "react";
// import { ShopContext } from "../context/ShopContext";
// import Title from "../components/Title";
// import axios from "axios";

// const Orders = () => {
//   const { backendUrl, token, currency } = useContext(ShopContext);
//   const [orderData, setOrderData] = useState([]);

//   // Fetch order data from the backend
//   const loadOrderData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const userId = localStorage.getItem("userId");
//       if (!token) return;

//       const response = await axios.get(`${backendUrl}/api/order/userorders`, {
//         headers: { token, userId },
//       });
//       console.log(response.data.orders);
//       if (response.data.success) {
//         setOrderData(response.data.orders.reverse()); // Reverse to show latest orders first
//       } else {
//         console.error("Failed to fetch orders:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error loading order data:", error);
//     }
//   };

//   useEffect(() => {
//     loadOrderData();
//   }, [token]);

//   return (
//     <div className="border-t pt-16">
//       <div className="text-2xl">
//         <Title text1={"MY"} text2={"ORDERS"} />
//       </div>
//       <div>
//         {orderData.map((item, index) => (
//           <div
//             key={index}
//             className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row items-center justify-center gap-4"
//           >
//             <div className="flex items-start gap-6 text-sm">
//               <img
//                 className="w-16 sm:w-20"
//                 src={item.image?.[0] || "/placeholder-image.jpg"}
//                 alt={item.name || "Product Image"}
//               />
//               <div>
//                 <p className="sm:text-base font-medium">
//                   {item.name || "Unknown Product"}
//                 </p>
//                 <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
//                   <p>{currency}{item.amount || "N/A"}</p>
//                   <p>Quantity: {item.quantity || 0}</p>
//                   <p>Size: {item.size || "N/A"}</p>
//                 </div>
//                 <p className="mt-1">
//                   Date:{" "}
//                   <span className="text-gray-400">
//                     {item.date ? new Date(item.date).toDateString() : "Unknown"}
//                   </span>
//                 </p>
//                 <p className="mt-1">
//                   Payment:{" "}
//                   <span className="text-gray-400">
//                     {item.paymentMethod || "Unknown"}
//                   </span>
//                 </p>
//               </div>
//             </div>
//             <div className="md:w-1/2 flex justify-between">
//               <div className="flex items-center gap-2">
//                 <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
//                 <p className="text-sm md:text-base">
//                   {item.status || "Pending"}
//                 </p>
//               </div>
//               <button
//                 onClick={loadOrderData}
//                 className="border px-4 py-2 text-sm font-medium rounded-sm"
//               >
//                 Track Order
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Orders;
import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token) return;

      const response = await axios.get(`${backendUrl}/api/order/userorders`, {
        headers: { token, userId },
      });

      if (response.data.success) {
        setOrderData(response.data.orders.reverse()); // Reverse to show the latest orders first
      } else {
        console.error("Failed to fetch orders:", response.data.message);
      }
    } catch (error) {
      console.error("Error loading order data:", error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1="MY" text2="ORDERS" />
      </div>
      <div>
        {orderData.map((order, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 flex flex-col gap-6"
          >
            <h3 className="font-semibold">Order #{order.name}</h3>
            {order.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="flex flex-col md:flex-row gap-4 items-center"
              >
                {/* Render the first image or a placeholder */}
                <img
                  className="w-16 sm:w-20"
                  src={item.image?.[0] || "/placeholder-image.jpg"}
                  alt={item.name || "Product Image"}
                />
                <div>
                  <p className="font-medium text-sm sm:text-base">
                    {item.name || "Unknown Product"}
                  </p>
                  <div className="text-gray-700 text-sm mt-1">
                    <p>Price: {currency}{order.amount || "N/A"}</p>
                    <p>Quantity: {item.quantity || 0}</p>
                    <p>Size: {item.size || "N/A"}</p>
                  </div>
                  <p className="mt-1">
                    Date:{" "}
                    <span className="text-gray-400">
                      {order.date
                        ? new Date(order.date).toDateString()
                        : "Unknown"}
                    </span>
                  </p>
                  <p className="mt-1">
                    Payment Method:{" "}
                    <span className="text-gray-400">
                      {order.paymentMethod || "Unknown"}
                    </span>
                  </p>
                  <p className="mt-1">
                    Status: <span className="text-gray-400">{order.status}</span>
                  </p>
                </div>
              </div>
            ))}
            <div className="flex justify-end mt-4">
              <button
                onClick={loadOrderData}
                className="border px-4 py-2 text-sm font-medium rounded-sm"
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
