import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');

  const { token, setToken, backendUrl, fetchCartData } = useContext(ShopContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let response;

      if (currentState === 'Sign Up') {
        response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });
      } else {
        response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
      }

      if (response.data.success) {
        const receivedToken = response.data.token;
        const receivedUserId = response.data.userId;

        setToken(receivedToken);
        setUserId(receivedUserId);
        localStorage.setItem('token', receivedToken);
        localStorage.setItem('userId', receivedUserId);

        // ✅ Fetch cart data for logged in user
        fetchCartData(receivedUserId,receivedToken);

        // ✅ Navigate to homepage (or /cart if you prefer)
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === 'Login' ? null : (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
          type="text"
          placeholder="Name"
          className="w-full px-3 py-2 border border-gray-800"
        />
      )}
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        required
        type="email"
        placeholder="E-mail"
        className="w-full px-3 py-2 border border-gray-800"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        required
        type="password"
        placeholder="Password"
        className="w-full px-3 py-2 border border-gray-800"
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        {currentState === 'Login' ? (
          <p onClick={() => setCurrentState('Sign Up')} className="cursor-pointer">
            Create Account
          </p>
        ) : (
          <p onClick={() => setCurrentState('Login')} className="cursor-pointer">
            Login Here
          </p>
        )}
      </div>

      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === 'Login' ? 'Sign-In' : 'Sign-Up'}
      </button>
    </form>
  );
};

export default Login;
