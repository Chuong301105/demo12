document.addEventListener('DOMContentLoaded', function () {
    const profileSection = document.getElementById('profileSection');
    const notificationsSection = document.getElementById('notificationsSection');
    const ordersSection = document.getElementById('ordersSection');
    const voucherSection = document.getElementById('voucherSection');

    // Hàm để ẩn tất cả các phần
    function hideAllSections() {
        profileSection.style.display = 'none';
        notificationsSection.style.display = 'none';
        ordersSection.style.display = 'none';
        voucherSection.style.display = 'none';
    }

    // Hiển thị "Thông tin tài khoản" mặc định
    hideAllSections(); // Ẩn tất cả các phần
    profileSection.style.display = 'block'; // Hiển thị thông tin tài khoản mặc định

    // Sự kiện khi nhấn vào "Thông tin tài khoản"
    document.getElementById('accountInfoLink').addEventListener('click', function (event) {
        event.preventDefault();
        hideAllSections(); // Ẩn tất cả các phần
        profileSection.style.display = 'block'; // Hiển thị thông tin tài khoản
    });

    // Sự kiện khi nhấn vào "Thông báo"
    document.getElementById('notificationsLink').addEventListener('click', function (event) {
        event.preventDefault();
        hideAllSections(); // Ẩn tất cả các phần
        notificationsSection.style.display = 'block'; // Hiển thị phần thông báo
    });

    // Sự kiện khi nhấn vào "Đơn mua"
    document.getElementById('ordersLink').addEventListener('click', function (event) {
        event.preventDefault();
        hideAllSections(); // Ẩn tất cả các phần
        ordersSection.style.display = 'block'; // Hiển thị phần đơn mua
    });

    // Sự kiện khi nhấn vào "Kho voucher"
    document.getElementById('voucherLink').addEventListener('click', function (event) {
        event.preventDefault();
        hideAllSections(); // Ẩn tất cả các phần
        voucherSection.style.display = 'block'; // Hiển thị phần kho voucher
    });

    // Sự kiện khi nhấn vào "Đăng xuất"
    document.getElementById('logoutLink').addEventListener('click', function (event) {
        event.preventDefault();
        localStorage.removeItem('user');
        window.location.href = '/'; // Chuyển hướng về trang chủ khi đăng xuất
    });
});

document.getElementById('userButton').addEventListener('click', function () {
    const dropdown = document.getElementById('dropdownMenu');
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
    }
});
