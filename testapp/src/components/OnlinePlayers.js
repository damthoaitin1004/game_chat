import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { ref, onValue, set, remove } from 'firebase/database';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import decodeJWT from './Jwt';

function OnlinePlayers() {
  const [players, setPlayers] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Get user info when component mounts
  useEffect(() => {
    const decoded = decodeJWT();
    if (decoded) {
      setUserInfo(decoded);
      console.log(decoded.email);
    }
  }, []);

  // This effect runs only when `userInfo` is set
  useEffect(() => {
    if (userInfo) {
      const userRef = ref(db, 'onlinePlayers');
      const unsubscribe = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setPlayers(Object.entries(data).map(([key, value]) => ({ id: key, ...value })));
        }
      });

      // Thêm user hiện tại vào danh sách online
      if (userInfo.user_id) {
        set(ref(db, `onlinePlayers/${userInfo.user_id}`), {
          email: userInfo.email,
          uid: userInfo.user_id,
        });
      }

      // Lắng nghe lời mời từ đối thủ
      const invitationRef = ref(db, `gameInvitations/${userInfo.user_id}`);
      const invitationListener = onValue(invitationRef, async (snapshot) => {
        const invitation = snapshot.val();
        if (invitation) {
          const result = await Swal.fire({
            title: `Lời mời từ ${invitation.from.email}`,
            text: 'Bạn có muốn tham gia trò chơi?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Tham gia',
            cancelButtonText: 'Từ chối',
          });

          if (result.isConfirmed) {
            const roomId = invitation.roomId;
            set(ref(db, `gameRooms/${roomId}`), {
              player1: invitation.from.uid,
              player2: userInfo.user_id,
            });
            navigate(`/game-room/${roomId}`);
            remove(invitationRef);
          } else {
            remove(invitationRef);
          }
        }
      });

      return () => {
        unsubscribe();
        if (userInfo.user_id) {
          remove(ref(db, `onlinePlayers/${userInfo.user_id}`));
        }
        invitationListener();
      };
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (userInfo) {
      // Lắng nghe sự thay đổi trong phòng game để chuyển hướng cả người mời và người được mời
      const gameRoomsRef = ref(db, 'gameRooms');
      const gameRoomsListener = onValue(gameRoomsRef, (snapshot) => {
        const gameRoomsData = snapshot.val();
        if (gameRoomsData) {
          for (const roomId in gameRoomsData) {
            const gameRoom = gameRoomsData[roomId];
            if (gameRoom.player1 === userInfo.user_id || gameRoom.player2 === userInfo.user_id) {
              navigate(`/game-room/${roomId}`);
              break;
            }
          }
        }
      });

      return () => {
        gameRoomsListener();
      };
    }
  }, [userInfo, navigate]);

  const invitePlayer = async (player) => {
    if (!userInfo) return; // Ensure `userInfo` is not null before proceeding

    const roomId = `${auth.currentUser.uid}_${player.uid}`;

    // Hiển thị hộp thoại xác nhận gửi lời mời
    const result = await Swal.fire({
      title: `Mời ${player.email} tham gia?`,
      text: 'Bạn có chắc chắn muốn mời người chơi này tham gia?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Mời',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      // Gửi lời mời vào Firebase
      set(ref(db, `gameInvitations/${player.uid}`), {
        from: {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
        },
        roomId,
      });

      Swal.fire('Đã gửi lời mời!', '', 'success');

      // Chuyển hướng người mời vào phòng game
      navigate(`/game-room/${roomId}`);
    }
  };

  return (
    <div>
      <h2>Online Players</h2>
      <ul>
        {players.map((player) =>
          player.uid !== auth.currentUser.uid ? (
            <li key={player.uid}>
              {player.email}
              <button onClick={() => invitePlayer(player)}>Mời</button>
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
}

export default OnlinePlayers;
