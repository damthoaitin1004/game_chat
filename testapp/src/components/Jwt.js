import {jwtDecode} from 'jwt-decode'; // Đây là cách import mặc định (default import) nếu thư viện hỗ trợ.


// Hàm lấy token từ cookie
const getCookie = (name) => {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find((row) => row.startsWith(name + '='));
  return cookie ? cookie.split('=')[1] : null;
};

// Hàm giải mã JWT
const decodeJWT = () => {
  try {
    // Lấy accessToken từ cookie
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      console.error('Access token not found in cookies');
      return null;
    }

    // Giải mã token
    const decoded = jwtDecode(accessToken);
    console.log('Decoded JWT:', decoded.email);

    return decoded; // Trả về payload trong token
  } catch (error) {
    console.error('Failed to decode JWT:', error.message);
    return null;
  }
};
export default decodeJWT;

