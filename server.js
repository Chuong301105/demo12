const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Import thư viện UUID để tạo ID duy nhất cho mỗi khách hàng

// Tạo ứng dụng Express
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Xử lý JSON cho các yêu cầu API
app.use(bodyParser.urlencoded({ extended: true })); // Xử lý dữ liệu từ form HTML

// Serve static files (cho phép truy cập vào file HTML, CSS, JS và hình ảnh)
app.use(express.static(path.join(__dirname, 'public')));

// Route GET để phục vụ file index.html khi truy cập /
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API để xử lý yêu cầu POST từ form
app.post('/submit-form', (req, res) => {
    const { name, phone, email, pet, otherType, services, homeService, pickUpService, address, message } = req.body;
    
    // Tạo ID duy nhất cho mỗi khách hàng và thêm ngày gửi yêu cầu
    const customerId = uuidv4();
    const date = new Date().toISOString();

    // Kiểm tra nếu có các trường bắt buộc bị thiếu (optional)
    if (!name || !phone || !email || !pet) {
        return res.status(400).json({ success: false, message: "Tên, Số điện thoại, Email và Loại thú cưng là bắt buộc!" });
    }

    // Đối tượng khách hàng cần lưu
    const customerData = { id: customerId, name, phone, email, pet, otherType, services, homeService, pickUpService, address, message, date };

    // Đọc dữ liệu hiện tại từ file customers.json
    fs.readFile('customers.json', 'utf8', (err, data) => {
        if (err && err.code === 'ENOENT') {
            console.log('File not found. Creating a new file...');
            let customers = [];
            customers.push(customerData);

            // Ghi dữ liệu mới vào file
            fs.writeFile('customers.json', JSON.stringify(customers, null, 2), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return res.status(500).json({ success: false, message: "Có lỗi xảy ra khi ghi dữ liệu!" });
                }
                return res.json({ success: true, message: "Dữ liệu đã được gửi và lưu thành công!" });
            });
        } else if (!err) {
            try {
                let customers = JSON.parse(data);
                customers.push(customerData);

                fs.writeFile('customers.json', JSON.stringify(customers, null, 2), (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                        return res.status(500).json({ success: false, message: "Có lỗi xảy ra khi ghi dữ liệu!" });
                    }
                    return res.json({ success: true, message: "Dữ liệu đã được cập nhật thành công!" });
                });
            } catch (parseError) {
                console.error('Error parsing JSON file:', parseError);
                let customers = [];
                customers.push(customerData);

                fs.writeFile('customers.json', JSON.stringify(customers, null, 2), (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                        return res.status(500).json({ success: false, message: "Có lỗi xảy ra khi khởi tạo lại dữ liệu!" });
                    }
                    return res.json({ success: true, message: "Dữ liệu đã được khởi tạo lại và lưu thành công!" });
                });
            }
        } else {
            console.error('Error reading file:', err);
            return res.status(500).json({ success: false, message: "Có lỗi xảy ra khi đọc dữ liệu!" });
        }
    });
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
