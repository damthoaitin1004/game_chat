// import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue ,remove} from "firebase/database";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeWzDz44gzvtUc-onlnxSu8mHOkqmYNpc",
  authDomain: "appdemo-27c51.firebaseapp.com",
  databaseURL: "https://appdemo-27c51-default-rtdb.firebaseio.com",  // Sửa lại URL database
  projectId: "appdemo-27c51",
  storageBucket: "appdemo-27c51.firebasestorage.app",
  messagingSenderId: "51669695797",
  appId: "1:51669695797:web:9393736a5bcc170db7a07c",
  measurementId: "G-LQE6MMZJ24"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// Khởi tạo Firebase app

//
// *** Các hàm quản lý người chơi và lời mời ***
//

// 1. Thêm người chơi vào danh sách online
export const addPlayer = (username) => {
  set(ref(db, `players/${username}`), true);
};

// 2. Xóa người chơi khỏi danh sách online khi thoát ứng dụng
export const removePlayer = (username) => {
  remove(ref(db, `players/${username}`));
};

// 3. Lấy danh sách người chơi online
export const getPlayers = (callback) => {
  const playersRef = ref(db, "players");
  onValue(playersRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || {}); // Nếu không có người chơi, trả về một đối tượng rỗng
  });
};

// 4. Gửi lời mời chơi
export const sendInvite = (from, to) => {
  set(ref(db, `invites/${to}`), { from });
};

// 5. Lắng nghe lời mời từ người chơi khác
export const listenForInvites = (username, callback) => {
  const inviteRef = ref(db, `invites/${username}`);
  onValue(inviteRef, (snapshot) => {
    const invite = snapshot.val();
    if (invite) callback(invite); // Gọi lại callback nếu có lời mời
  });
};

// 6. Xóa lời mời sau khi người chơi chấp nhận hoặc từ chối
export const clearInvite = (username) => {
  remove(ref(db, `invites/${username}`));
};


// Thêm console.log để kiểm tra nếu Firebase đã được khởi tạo
console.log("Firebase app đã được khởi tạo:", app);

// Thực hiện một thao tác ghi để kiểm tra kết nối
const testConnection = async () => {
  console.log("Bắt đầu kiểm tra kết nối với Firebase..."); // Thêm log để theo dõi trạng thái
  const reference = ref(db, 'test/connection'); // Tạo một đường dẫn dữ liệu mới
  try {
    await set(reference, {
      status: "connected", // Gửi dữ liệu để kiểm tra
    });
    console.log("Kết nối đến Firebase thành công!");
  } catch (error) {
    console.error("Không thể kết nối đến Firebase:", error);
  }
};

// Gọi hàm testConnection sau khi khởi tạo Firebase
testConnection();
