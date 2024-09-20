document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('header');
    
    // Thay đổi màu sắc của thanh điều hướng khi cuộn trang
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.style.backgroundColor = '#007bbd'; // Thay đổi màu sắc khi cuộn trang
            nav.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.backgroundColor = '#009ddc'; // Trở lại màu ban đầu khi ở trên cùng
            nav.style.boxShadow = 'none';
        }
    });

    // Hiển thị field loại thú cưng khác khi chọn "Khác"
    const petSelect = document.getElementById('pet');
    const otherPetType = document.getElementById('otherPetType');

    petSelect.addEventListener('change', function() {
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

    // Form submission
    const form = document.getElementById('serviceForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            pet: document.getElementById('pet').value,
            otherType: document.getElementById('otherType').value || '',
            services: Array.from(document.querySelectorAll('input[name="services"]:checked')).map(el => el.value),
            homeService: document.getElementById('homeService').value,
            pickUpService: document.getElementById('pickUpService').value,
            address: document.getElementById('address').value || '',
            message: document.getElementById('message').value
        };

        // Gửi dữ liệu tới server (đây chỉ là demo)
        console.log('Submitted form data:', formData);

        // Hiển thị thông báo thành công
        const responseMessage = document.getElementById('responseMessage');
        responseMessage.textContent = 'Đã gửi thông tin thành công!';
        responseMessage.style.display = 'block';
        responseMessage.style.color = 'green';

        // Reset form sau khi gửi
        form.reset();

        // Ẩn trường địa chỉ và loại thú cưng khác khi reset form
        addressField.style.display = 'none';
        otherPetType.style.display = 'none';
    });
});
