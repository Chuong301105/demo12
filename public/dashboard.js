// Lấy thông tin người dùng từ localStorage và kiểm tra
const storedUser = localStorage.getItem('user');
let user = null;

if (!storedUser) {
    // Nếu chưa đăng nhập, chuyển hướng về trang chính
    window.location.href = '/';
} else {
    // Chuyển chuỗi JSON trong localStorage thành đối tượng JavaScript
    user = JSON.parse(storedUser);
    showUserDashboard(user);
}

// Lấy thanh navbar
const navbar = document.getElementById('navbar');

// Kiểm tra trạng thái cuộn trang
window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled'); // Thêm class để biến thanh thành hình tròn
    } else {
        navbar.classList.remove('scrolled'); // Trả lại về trạng thái ban đầu
    }
});

// Cập nhật thanh tiến độ
function updateProgressBar(points) {
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = Math.min((points / 100) * 100, 100); // Giới hạn tối đa là 100%
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.textContent = `${Math.round(progressPercentage)}%`;
}

// Xử lý sự kiện Đăng xuất
document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('user');
    window.location.href = '/'; // Chuyển hướng về trang chính
});

// Hiển thị thông tin dashboard cho người dùng
function showUserDashboard(user) {
    document.getElementById('loyaltyPoints').textContent = user.loyaltyPoints || 0;
    updateProgressBar(user.loyaltyPoints);

    if (user.discounts && user.discounts.length > 0) {
        document.getElementById('userDiscounts').textContent = user.discounts.join(', ');
    } else {
        document.getElementById('userDiscounts').textContent = "Không có ưu đãi nào";
    }

    document.getElementById('petName').textContent = user.petName || "Chưa có thú cưng";
    document.getElementById('loyaltyLevel').textContent = user.loyaltyLevel || "Chưa xác định";
}

// Cập nhật thanh tiến độ dựa trên điểm tích lũy
function updateProgressBar(points) {
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = isNaN(points) ? 0 : Math.min((points / 100) * 100, 100);
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.innerHTML = `<span>${Math.round(progressPercentage)}%</span>`;  // Hiển thị phần trăm bên trong
}

