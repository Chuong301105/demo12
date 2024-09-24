document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('header');

 // Hàm lấy màu ngẫu nhiên
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Xử lý cuộn trang
window.addEventListener('scroll', function () {
    const nav = document.querySelector('header');
    if (window.scrollY > 50) {
        const randomColor = getRandomColor();
        nav.style.backgroundColor = randomColor; // Đổi màu ngẫu nhiên
        nav.classList.add('scrolled'); // Biến thành hình tròn khi cuộn
    } else {
        nav.style.backgroundColor = ''; // Trả về màu mặc định
        nav.classList.remove('scrolled'); // Trả về trạng thái ban đầu
    }
});



    // Hiển thị modal đăng nhập/đăng ký
    const loginButton = document.getElementById('loginButton');
    const authModal = document.getElementById('authModal');
    const closeModal = document.querySelector('.close');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const body = document.querySelector('body');

    loginButton.addEventListener('click', function (event) {
        event.preventDefault();
        authModal.classList.add('active');
        body.style.overflow = 'hidden'; // Ngăn cuộn trang khi modal mở
    });

    closeModal.addEventListener('click', function () {
        authModal.classList.remove('active');
        body.style.overflow = 'auto'; // Cho phép cuộn lại
    });

    window.addEventListener('click', function (event) {
        if (event.target === authModal) {
            authModal.classList.remove('active');
            body.style.overflow = 'auto'; // Cho phép cuộn lại
        }
    });

    // Chuyển đổi giữa đăng nhập và đăng ký
    loginTab.addEventListener('click', function () {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    });

    registerTab.addEventListener('click', function () {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
    });

    // Đăng nhập sang đăng ký và ngược lại
    document.getElementById('switchToRegister').addEventListener('click', function () {
        registerTab.click();
    });

    document.getElementById('switchToLogin').addEventListener('click', function () {
        loginTab.click();
    });

    // Hiển thị field loại thú cưng khác khi chọn "Khác"
    const petSelect = document.getElementById('pet');
    const otherPetType = document.getElementById('otherPetType');

    petSelect.addEventListener('change', function () {
        if (petSelect.value === 'others') {
            otherPetType.style.display = 'block';
        } else {
            otherPetType.style.display = 'none';
        }
    });

    // Hiển thị trường địa chỉ nếu khách chọn phục vụ tại nhà hoặc đón bé tại nhà
    const homeService = document.getElementById('homeService');
    const pickUpService = document.getElementById('pickUpService');
    const addressField = document.getElementById('addressField');

    function toggleAddressField() {
        if (homeService.value === 'yes' || pickUpService.value === 'yes') {
            addressField.style.display = 'block';
        } else {
            addressField.style.display = 'none';
        }
    }

    homeService.addEventListener('change', toggleAddressField);
    pickUpService.addEventListener('change', toggleAddressField);

    // Xử lý form dịch vụ
    const form = document.getElementById('serviceForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            pet: document.getElementById('pet').value,
            otherType: document.getElementById('otherType').value,
            services: [], // Mảng để lưu các dịch vụ đã chọn
            homeService: document.getElementById('homeService').value === 'yes' ? 'Có' : 'Không', // Thay đổi 'yes' thành 'Có'
            pickUpService: document.getElementById('pickUpService').value === 'yes' ? 'Có' : 'Không', // Thay đổi 'yes' thành 'Có'
            address: document.getElementById('address').value,
            
        };
    
        // Thu thập các dịch vụ đã chọn từ form
        const selectedServices = [];
        document.querySelectorAll('input[name="services"]:checked').forEach(checkbox => {
        selectedServices.push(checkbox.value);
        });

        // Gộp các dịch vụ đã chọn thành một chuỗi phân cách bằng dấu phẩy
        formData.services = selectedServices.join(', ');
        console.log('Sending form data:', formData);

        // Gửi dữ liệu tới server
        fetch('/submit-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            // Kiểm tra xem phản hồi HTTP có thành công hay không
            if (!response.ok) {
                throw new Error('Lỗi mạng');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response from server:', data);

            const responseMessage = document.getElementById('responseMessage');
            if (data.success) {
                responseMessage.textContent = 'Đã gửi thông tin thành công!';
                responseMessage.style.color = 'green';
                responseMessage.style.display = 'block';

                // Reset form sau khi gửi
                form.reset();
                addressField.style.display = 'none';
                otherPetType.style.display = 'none';
            } else {
                responseMessage.textContent = `Có lỗi xảy ra: ${data.message}`;
                responseMessage.style.color = 'red';
                responseMessage.style.display = 'block';
            }

            // Ẩn thông báo sau 5 giây
            setTimeout(() => {
                responseMessage.style.display = 'none';
            }, 5000);
        })
        .catch(error => {
            console.error('Error:', error);
            const responseMessage = document.getElementById('responseMessage');
            responseMessage.textContent = 'Có lỗi xảy ra khi gửi thông tin! Hãy thử lại.';
            responseMessage.style.color = 'red';
            responseMessage.style.display = 'block';

            // Ẩn thông báo sau 5 giây
            setTimeout(() => {
                responseMessage.style.display = 'none';
            }, 5000);
        });
    });

    // Xử lý form đăng ký tài khoản
    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const registerResponseMessage = document.getElementById('registerResponseMessage');

        // Reset màu sắc của thông báo mỗi khi gửi form
        registerResponseMessage.style.color = ''; // Trả về màu mặc định (không đỏ)

        // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
        if (password !== confirmPassword) {
            registerResponseMessage.textContent = 'Mật khẩu và xác nhận mật khẩu không khớp!';
            registerResponseMessage.style.color = 'red'; // Thông báo lỗi
            return;
        }

        // Gửi dữ liệu đăng ký tới server
        const registerData = {
            username: username,
            email: email,
            password: password
        };

        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi mạng khi đăng ký');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                registerResponseMessage.textContent = 'Đăng ký thành công!';
                registerResponseMessage.style.color = 'green';
                registerResponseMessage.style.display = 'block';
        
                // Kiểm tra form tồn tại trước khi gọi reset
                const registerFormElement = document.querySelector('#registerForm form');
                console.log(registerFormElement); // Log ra phần tử để kiểm tra
                if (registerFormElement && typeof registerFormElement.reset === 'function') {
                    registerFormElement.reset(); // Reset form sau khi đăng ký thành công
                }
                // Ẩn modal sau khi đăng ký thành công
                setTimeout(() => {
                    authModal.classList.remove('active');
                    body.style.overflow = 'auto'; // Cho phép cuộn lại
                    registerResponseMessage.style.display = 'none'; // Ẩn thông báo sau 5 giây
                }, 3000);
            } else {
                registerResponseMessage.textContent = `Đăng ký thất bại: ${data.message}`;
                registerResponseMessage.style.color = 'red';
                registerResponseMessage.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            registerResponseMessage.textContent = 'Có lỗi xảy ra khi gửi thông tin!';
            registerResponseMessage.style.color = 'red'; // Thông báo lỗi
            registerResponseMessage.style.display = 'block';

            // Ẩn thông báo sau 5 giây
            setTimeout(() => {
                registerResponseMessage.style.display = 'none';
            }, 5000);
        });
    });

    // Xử lý form đăng nhập
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Ngăn chặn form tự động reload

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const loginData = {
            email: email,
            password: password
        };

        // Gửi yêu cầu đăng nhập đến API
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi mạng khi đăng nhập');
            }
            return response.json();
        })
        .then(data => {
            const loginMessage = document.getElementById('loginMessage');
            if (data.success) {
                loginMessage.textContent = 'Đăng nhập thành công!';
                loginMessage.style.color = 'green';
                loginMessage.style.display = 'block';
        
                // Lưu thông tin người dùng vào localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
        
                // Chuyển hướng đến trang dashboard.html
                window.location.href = 'dashboard.html';
            } else {
                loginMessage.textContent = `Đăng nhập thất bại: ${data.message}`;
                loginMessage.style.color = 'red';
                loginMessage.style.display = 'block';
            }
        
            setTimeout(() => {
                loginMessage.style.display = 'none';
            }, 5000);
        })
        .catch(error => {
            const loginMessage = document.getElementById('loginMessage');
            loginMessage.textContent = 'Đã xảy ra lỗi khi đăng nhập!';
            loginMessage.style.color = 'red';
            loginMessage.style.display = 'block';
        });        
    });
});