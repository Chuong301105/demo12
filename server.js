const express = require('express');
const fs = require('fs').promises; // Sử dụng fs.promises để làm việc với async/await
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Import thư viện UUID để tạo ID duy nhất cho mỗi khách hàng
const bcrypt = require('bcrypt'); // Import bcrypt để mã hóa mật khẩu

// Tạo ứng dụng Express
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Xử lý JSON cho các yêu cầu API
app.use(bodyParser.urlencoded({ extended: true })); // Xử lý dữ liệu từ form HTML

// Serve static files (cho phép truy cập vào file HTML, CSS, JS và hình ảnh)
app.use(express.static(path.join(__dirname, 'public')));

// Hàm khởi tạo file nếu chưa tồn tại
const initializeFiles = async () => {
    const userFilePath = 'users.json';
    const customerFilePath = 'customers.json';

    try {
        await fs.access(userFilePath); // Kiểm tra xem file có tồn tại không
    } catch {
        await fs.writeFile(userFilePath, '[]'); // Nếu không tồn tại, tạo file trống
        console.log('Created users.json file');
    }

    try {
        await fs.access(customerFilePath);
    } catch {
        await fs.writeFile(customerFilePath, '[]');
        console.log('Created customers.json file');
    }
};

initializeFiles(); // Gọi hàm khởi tạo file khi server bắt đầu

// Route GET để phục vụ file index.html khi truy cập /
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API để xử lý đăng ký người dùng
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Đọc dữ liệu từ file users.json
        let users = [];
        try {
            const data = await fs.readFile('users.json', 'utf8');
            users = JSON.parse(data);
        } catch (err) {
            if (err.code !== 'ENOENT') throw err; // Bỏ qua lỗi file không tồn tại
        }

        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email đã tồn tại!' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
        const newUser = { id: uuidv4(), username, email, password: hashedPassword };
        users.push(newUser);

        // Lưu người dùng vào file users.json
        await fs.writeFile('users.json', JSON.stringify(users, null, 2));
        res.status(201).json({ success: true, message: 'Đăng ký thành công!' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi xử lý đăng ký!' });
    }
});

// API để xử lý đăng nhập người dùng
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Đọc dữ liệu từ file users.json
        const data = await fs.readFile('users.json', 'utf8');
        const users = JSON.parse(data);

        // Tìm người dùng với email đã cho
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ success: false, message: 'Email không tồn tại!' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Mật khẩu không đúng!' });
        }

        // Đăng nhập thành công, trả về thông tin người dùng (không trả về mật khẩu)
        res.json({ success: true, message: 'Đăng nhập thành công!', user: { id: user.id, username: user.username, email: user.email } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi đăng nhập!' });
    }
});

// API để xử lý yêu cầu POST từ form dịch vụ
app.post('/submit-form', async (req, res) => {
    const { name, phone, email, pet, otherType, services, homeService, pickUpService, address, message } = req.body;

    if (!name || !phone || !email || !pet) {
        return res.status(400).json({ success: false, message: "Tên, Số điện thoại, Email và Loại thú cưng là bắt buộc!" });
    }

    const customerId = uuidv4();
    const date = new Date().toISOString();

    const customerData = { id: customerId, name, phone, email, pet, otherType, services, homeService, pickUpService, address, message, date };

    try {
        // Đọc dữ liệu từ file customers.json
        let customers = [];
        try {
            const data = await fs.readFile('customers.json', 'utf8');
            customers = JSON.parse(data);
        } catch (err) {
            if (err.code !== 'ENOENT') throw err;
        }

        // Thêm dữ liệu mới vào mảng
        customers.push(customerData);

        // Ghi dữ liệu mới vào file customers.json
        await fs.writeFile('customers.json', JSON.stringify(customers, null, 2));

        // Trả về phản hồi thành công
        res.json({ success: true, message: "Dữ liệu đã được gửi và lưu thành công!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Có lỗi xảy ra khi ghi dữ liệu!" });
    }
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
