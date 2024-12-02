import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Lấy accessToken và refreshToken từ user
      const accessToken = await user.getIdToken(); // Lấy token truy cập
      const refreshToken = user.refreshToken; // Lấy refresh token

 
  // Lưu accessToken vào cookie
  document.cookie = `accessToken=${accessToken}; Secure; SameSite=Strict; path=/; max-age=3600`; // Hết hạn sau 1 giờ
  document.cookie = `refreshToken=${refreshToken}; Secure; SameSite=Strict; path=/; max-age=${7 * 24 * 3600}`; // Hết hạn sau 7 ngày

  console.log('Cookies saved:', document.cookie);

      // Điều hướng người dùng đến trang "online-players"
      navigate('/online-players');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => navigate('/register')}>Register</button>
    </div>
  );
}

export default Login;
