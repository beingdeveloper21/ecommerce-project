import React, { useContext } from 'react'
import { useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from "react-toastify";
import axios from 'axios'
const PlaceOrder = () => {
  const {navigate,backendUrl,token,cartItems,setCartItems,getCartAmount,delivery_fee,products}=useContext(ShopContext)
  const [method,setMethod]=useState('cod');
  const [formData,setFormData]=useState({
    firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state:'',
    zipcode:'',
    country:'',
    phone:''
  })
  const onChangeHandler=(event)=>{
    const name=event.target.name
    const value=event.target.value
    setFormData(data=>({...data,[name]:value}))
  }
  // const onSubmitHandler=async(event)=>{
  //   event.preventDefault()
  //   try{
  //        let orderItems=[]
  //        for(const items in cartItems){
  //         for(const item in cartItems[item]){
  //           if(cartItems[items][item]>0){
  //             const itemInfo = structuredClone(products.find(product => product._id===items))
  //             if(itemInfo){
  //               itemInfo.size =item
  //               itemInfo.quantity=cartItems[items][item]
  //               orderItems.push(itemInfo)
  //             }
  //           }
  //         }
  //        }
  //        console.log(orderItems);
  //   }
  //   catch(error){

  //   }
  // }
  // const onSubmitHandler = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const orderItems = [];
  //     for (const productId in cartItems) {
  //       for (const size in cartItems[productId]) {
  //         if (cartItems[productId][size] > 0) {
  //           const productInfo = products.find((product) => product._id === productId);
  //           if (productInfo) {
  //             orderItems.push({
  //               _id: productInfo._id,
  //               name: productInfo.name,
  //               size,
  //               quantity: cartItems[productId][size],
  //             });
  //           }
  //         }
  //       }
  //     }
    
  //     const payload = {
  //       items: orderItems,
  //       amount: getCartAmount() + delivery_fee,
  //       address: { ...formData },
  //     };
  
  //     console.log("Payload:", payload);
  //     const token = localStorage.getItem("token");
  //     console.log(token)
  //     const userId = localStorage.getItem("userId");
  //     console.log(userId) // Fetch userId from storage
  //     const response = await axios.post(
  //       `${backendUrl}/api/order/place`, 
  //       payload, 
  //       {
  //         headers: { userid: userId, token },
  //       }
  //     );
      
  
  //     if (response.data.success) {
  //     navigate('/orders')
  //     toast.success("Order placed successfully")
  //     } else {
  //       alert(response.data.message || "Order placement failed");
  //     }
  //   } catch (error) {
  //     console.error("Error placing order:", error);
  //   }
  // };
  
  // const responseStripe= await axios.post(backendUrl+'/api/order/stripe',orderData,{headers:{token}})
  // if(responseStripe.data.success){
  //   const {session_url}=response.Stripe.data
  //   window.location.replace(session_url)
  // }
  // else{
  //   toast.error(responseStripe.data.message)
  // }
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
        const orderItems = [];
        for (const productId in cartItems) {
            for (const size in cartItems[productId]) {
                if (cartItems[productId][size] > 0) {
                    const productInfo = products.find((product) => product._id === productId);
                    if (productInfo) {
                        orderItems.push({
                            _id: productInfo._id,
                            name: productInfo.name,
                            size,
                            quantity: cartItems[productId][size],
                            amount: productInfo.price,
                        });
                    }
                }
            }
        }

        const payload = {
            items: orderItems,
            amount: getCartAmount() + delivery_fee,
            address: { ...formData },
        };
        console.log('Payload before sending:', payload);
        const token=localStorage.getItem('token')
        const headers = { userid: localStorage.getItem('userId'), token };
        console.log('Headers:', headers);

        if (method === 'stripe') {
            const response = await axios.post(`${backendUrl}/api/order/stripe`, payload, { headers });

            if (response.data.success) {
                window.location.replace(response.data.session_url);
            } else {
                toast.error(response.data.message || 'Stripe payment failed');
            }
        } else if (method === 'cod') {
            const response = await axios.post(`${backendUrl}/api/order/place`, payload, { headers });

            if (response.data.success) {
                setCartItems({});
                navigate('/orders');
                toast.success('Order placed successfully');
            } else {
                toast.error(response.data.message || 'COD order failed');
            }
        }
    } catch (error) {
        console.error('Error placing order:', error);
        toast.error(error.message || 'Order placement failed');
    }
};

  return (
    <form onSubmit={onSubmitHandler}  className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* Left Side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
          <div className='text-xl sm:text-2xl my-3'>
            <Title text1={'DELIVERY'} text2={' INFORMATION'}/>

          </div>
          <div className='flex gap-3'>
           <input onChange={onChangeHandler} name='firstName' value={formData.firstName} required type="text" placeholder='First Name'   className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
           <input onChange={onChangeHandler} name='lastName' value={formData.lastName} required type="text" placeholder='Last Name'   className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />


          </div>
          <input onChange={onChangeHandler} name='email' value={formData.email} type="email" required placeholder='E-mail address'    className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input onChange={onChangeHandler} name='street' value={formData.street} type="text" required placeholder='Street' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <div className='flex gap-3'>
           <input type="text" onChange={onChangeHandler}  value={formData.city}  required placeholder='City'  name='city'  className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
           <input type="text" onChange={onChangeHandler}  value={formData.state} required placeholder='State'  name='state'  className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
           
          </div>
           <div className='flex gap-3'>
           <input type="number" onChange={onChangeHandler} value={formData.zipcode} required placeholder='Pin-Code'  name='zipcode' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
           <input type="text" onChange={onChangeHandler}  value={formData.country} required placeholder='Country'  name='country'  className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
 </div>
 <input type="number" onChange={onChangeHandler}  value={formData.phone} required placeholder='Phone-No'  name='phone'  className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
      </div>
      {/* Right Side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
         <CartTotal/>
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={' METHOD'}/>
          {/* PAYMENT METHOD SELECTION */}
          {/* <div className='flex gap-3 flex-col lg:flex-row'>
            <div className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border-rounded full ${method==='stripe'?'bg-green-400':' '}`}></p>
              <img  className='h-5 mx-4' src={assets.stripe_logo} alt="" />
              
            </div>
            <div className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border-rounded full ${method==='razorpay'?'bg-green-400':' '}`}></p>
              <img  className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
              
            </div>
            <div  className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border-rounded full ${method==='cod'?'bg-green-400':' '}`}></p>
               <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
              
            </div>
          </div> */}
          <div className='flex gap-3 flex-col lg:flex-row'>
  <div
    className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'stripe' ? 'border-green-400' : ''}`}
    onClick={() => setMethod('stripe')}
  >
    <p className={`min-w-3.5 h-3.5 rounded-full border ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
    <img className='h-5 mx-4' src={assets.stripe_logo} alt="Stripe" />
  </div>
  {/* <div
    className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'razorpay' ? 'border-green-400' : ''}`}
    onClick={() => setMethod('razorpay')}
  >
    <p className={`min-w-3.5 h-3.5 rounded-full border ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
    <img className='h-5 mx-4' src={assets.razorpay_logo} alt="Razorpay" />
  </div> */}
  <div
    className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'cod' ? 'border-green-400' : ''}`}
    onClick={() => setMethod('cod')}
  >
    <p className={`min-w-3.5 h-3.5 rounded-full border ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
    <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
  </div>
</div>

          <div className='w-full text-end mt-8'>
          <button type="submit" className='bg-black text-white py-3 px-16 text-sm '>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
