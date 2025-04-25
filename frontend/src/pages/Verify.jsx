// import React, { useContext,useEffect } from 'react'
// import { ShopContext } from '../context/ShopContext'
// import { useSearchParams } from 'react-router-dom'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// const Verify = () => {
//     const {setCartItems,token,navigate,backendUrl}=useContext(ShopContext)
//     const [searchParams,setSearchParams]=useSearchParams()
//     const success = searchParams.get('success') === 'true';
//     const orderId = searchParams.get('orderId')
//     const verifyPayment = async()=>{
//            try{
//           if(!token){
//             return null
//           }
//           const response=await axios.post(backendUrl+'/api/order/verifyStripe',{success,orderId},{headers:{token,'Content-Type': 'application/json' }})
//           if(response.data.success){
//             setCartItems({})
//             navigate('/orders')
//           }
//           else{
//             navigate('/cart')
//           }
//            }
//            catch(error){
//            console.log(error)
//            toast.error(error.message)
//            }
//     }
//     useEffect(()=>{
//        verifyPayment()
//     },[token])
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default Verify
import React, { useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Verify = () => {
    const { navigate, setCartItems, backendUrl } = useContext(ShopContext);
    const [searchParams] = useSearchParams();
    const success = searchParams.get('success') === 'true';
    const orderId = searchParams.get('orderId');
    

    // const verifyPayment = async () => {
    //     try {
    //         // Fetch token from localStorage
    //         const token = localStorage.getItem('token');
    //         if (!token) {
    //             console.log('Token missing, skipping API call');
    //             toast.error('Authentication token not found');
    //             navigate('/login'); // Navigate to login if token is missing
    //             return;
    //         }

    //         console.log('Sending request to verifyStripe with:', { success, orderId });

    //         const response = await axios.post(
    //             `${backendUrl}/api/order/verifyStripe`,
    //             { success, orderId },
    //             { headers: { token, 'Content-Type': 'application/json' } }
    //         );

    //         console.log('Verify Payment Response:', response.data);

    //         if (response.data.success) {
    //             setCartItems({});
    //             navigate('/orders'); // Navigate to orders page on success
    //         } else {
    //             navigate('/cart'); // Navigate to cart page on failure
    //         }
    //     } catch (error) {
    //         console.error('Error in verifyPayment:', error.message);
    //         toast.error(error.message);
    //     }
    // };
//     const verifyPayment = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 console.log('Token missing, skipping API call');
//                 toast.error('Authentication token not found');
//                 navigate('/login');
//                 return;
//             }
    
//             console.log('Sending request to verifyStripe with:', { success, orderId });
//             // const response = await axios.post(
//             //     `${backendUrl}/api/order/verifyStripe`,
//             //     { success, orderId },
//             //     { headers: { token, 'Content-Type': 'application/json' } }
//             // );
//             const userId = localStorage.getItem('userId'); // Fetch userId from localStorage
// const response = await axios.post(
//     `${backendUrl}/api/order/verifyStripe`,
//     { success, orderId },
//     { headers: { token, userid: userId, 'Content-Type': 'application/json' } }

// );

    
//             console.log('Verify Payment Response:', response.data);
    
//             if (response.data.success) {
//                 setCartItems({});
//                 navigate('/orders');
//             } else {
//                 navigate('/cart');
//             }
//         } catch (error) {
//             console.error('Error in verifyPayment:', error.message);
//             toast.error(error.message);
//         }
//     };
    
//     useEffect(() => {
//         verifyPayment();
//     }, []); // Removed dependency on token since it's fetched directly
// const verifyPayment = async () => {
//     const token = localStorage.getItem('token');
//     const userId = localStorage.getItem('userId');

//     if (!token || !userId || !orderId) {
//         console.log('Missing token, userId, or orderId. Skipping API call.');
//         toast.error('Authentication or order details are missing.');
//         navigate('/login');
//         return;
//     }

//     try {
//         console.log('Sending request to verifyStripe with:', { success, orderId });

//         const response = await axios.post(
//             `${backendUrl}/api/order/verifyStripe`,
//             { success, orderId },
//             { headers: { token, userid: userId, 'Content-Type': 'application/json' } }
//         );

//         console.log('Verify Payment Response:', response.data);

//         if (response.data.success) {
//             toast.success(response.data.message || 'Payment verified successfully.');
//             setCartItems({});
//             navigate('/orders'); // Navigate to orders page on success
//         } else {
//             toast.error(response.data.message || 'Payment verification failed.');
//             navigate('/cart'); // Navigate to cart page on failure
//         }
//     } catch (error) {
//         console.error('Error in verifyPayment:', error.message);
//         toast.error('Failed to verify payment. Please try again.');
//         navigate('/cart');
//     }
// };
const verifyPayment = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId || !orderId) {
        console.log('Missing token, userId, or orderId. Skipping API call.');
        toast.error('Authentication or order details are missing.');
        navigate('/login');
        return;
    }

    try {
        console.log('Sending request to verifyStripe with:', { success, orderId });

        const response = await axios.post(
            `${backendUrl}/api/order/verifyStripe`,
            { success, orderId },
            { headers: { token, userid: userId, 'Content-Type': 'application/json' } }
        );

        console.log('Verify Payment Response:', response.data);

        if (response.data.success) {
            toast.success(response.data.message || 'Payment verified successfully.');
            setCartItems({}); // Clear cart
            navigate('/orders'); // Navigate to orders page on success
        } else {
            toast.error(response.data.message || 'Payment verification failed.');

            // Log cartData for debugging
            console.log('Restoring cartData:', response.data.cartData);

            // Restore cart items
            if (response.data.cartData && Array.isArray(response.data.cartData)) {
                setCartItems(response.data.cartData); // Update cart with restored items
            } else {
                console.warn('Cart data is missing or invalid:', response.data.cartData);
            }

            navigate('/cart'); // Navigate to cart page on failure
        }
    } catch (error) {
        console.error('Error in verifyPayment:', error.message);
        toast.error('Failed to verify payment. Please try again.');
        navigate('/cart');
    }
};

useEffect(() => {
    if (orderId && success !== null) {
        verifyPayment();
    }
}, [orderId, success]);


    return <div>
        Payment Verified 
    </div>;
};

export default Verify;
