const express = require('express');
const fs = require('fs').promises; // Sử dụng fs.promises để làm việc với async/await
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Import thư viện UUID để tạo ID duy nhất cho mỗi khách hàng
const bcrypt = require('bcrypt'); // Import bcrypt để mã hóa mật khẩu
const mysql = require('mysql2');
// Tạo kết nối đến cơ sở dữ liệu MySQL bằng biến môi trường
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',   // Thay bằng host của bạn
    user: process.env.DB_USER || 'root',        // Thay bằng username của bạn
    password: process.env.DB_PASS || 'Nhcdz123#',    // Thay bằng password của bạn
    database: process.env.DB_NAME || 'petcare_db',// Thay bằng tên cơ sở dữ liệu của bạn
    port: 3306 // hoặc port khác nếu bạn dùng port đặc biệt
});

// Kiểm tra kết nối
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL');
});

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

app.post('/submit-form', (req, res) => {
    console.log(req.body); // In ra toàn bộ dữ liệu từ form để kiểm tra
    const { name, phone, email, pet, otherType, services, homeService, pickUpService, address } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!name || !phone || !email || !pet) {
        return res.status(400).json({ success: false, message: "Tên, Số điện thoại, Email và Loại thú cưng là bắt buộc!" });
    }

    // Tạo ID cho khách hàng
    const customerId = uuidv4();

    // Kiểm tra nếu `services` là mảng, nếu không thì xử lý phù hợp
    let selectedServices = '';
    if (Array.isArray(services)) {
        selectedServices = services.join(', '); // Nếu là mảng, gộp các dịch vụ thành chuỗi
    } else if (typeof services === 'string') {
        selectedServices = services; // Nếu là chuỗi, sử dụng trực tiếp
    } else {
        selectedServices = ''; // Nếu không có giá trị, để trống
    }

    // Dữ liệu khách hàng sẽ được lưu vào cơ sở dữ liệu MySQL (bỏ cột created_at)
    const query = `INSERT INTO customers (id, name, phone, email, pet, otherType, services, homeService, pickUpService, address) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`; // Đã bỏ cột 'message'
    // Thực hiện câu lệnh SQL
    db.query(query, [customerId, name, phone, email, pet, otherType, selectedServices, homeService, pickUpService, address], (err, result) => {
        if (err) {
            console.error('Error inserting customer data:', err);
            return res.status(500).json({ success: false, message: "Có lỗi xảy ra khi ghi dữ liệu!" });
        }
        res.json({ success: true, message: "Dữ liệu đã được gửi và lưu thành công!" });
    });
});
// === API mới để lưu hóa đơn vào bảng invoices ===
// API để xử lý lưu dữ liệu vào bảng invoices
app.post('/save-invoice', (req, res) => {
    const { customer_name, customer_phone, customer_email, pet_type, services, total, payment_method } = req.body;

    // Tạo câu lệnh SQL để chèn dữ liệu vào bảng invoices
    const query = `
        INSERT INTO invoices (customer_name, customer_phone, customer_email, pet_type, services, total, payment_method)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Thực hiện truy vấn để lưu thông tin hóa đơn
    db.query(query, [customer_name, customer_phone, customer_email, pet_type, services, total, payment_method], (err, result) => {
        if (err) {
            console.error('Error inserting invoice data:', err);
            return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi lưu hóa đơn!' });
        }
        console.log('Hóa đơn đã được lưu thành công vào MySQL');
        res.status(200).json({ success: true, message: 'Hóa đơn đã được lưu thành công!' });
    });
});


// Khởi động server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

