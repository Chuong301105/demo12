// Kiểm tra xem người dùng có trong localStorage không
const user = localStorage.getItem('user');
if (!user) {
    // Nếu chưa đăng nhập, chuyển hướng về trang chính
    window.location.href = '/';
}

// Xử lý sự kiện Đăng xuất
document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('user');
    window.location.href = '/'; // Chuyển hướng về trang chính
});
