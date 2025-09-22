CREATE schema teddyshop;
USE teddyshop;

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) unique NOT NULL,
	password varchar(255) not null
);
-- ======================
-- 1️⃣ Bảng danh mục
-- ======================
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description LONGTEXT, -- mô tả (cho phép chứa HTML + ảnh)
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================
-- 2️⃣ Bảng sản phẩm
-- ======================
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(255) NOT NULL,
    code varchar(100),
    slug VARCHAR(255) UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    instock boolean default true,
    star1 boolean default false,
    star2 boolean default false,
    description LONGTEXT,
    sort_order int default 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ======================
-- 3️⃣ Bảng ảnh sản phẩm (gallery)
-- ======================
CREATE TABLE product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_main boolean default false,
    sort_order int default 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ======================
-- 4️⃣ Thuộc tính sản phẩm
-- ======================
CREATE TABLE product_attributes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- ví dụ: Size, Cốt bánh
    slug VARCHAR(100) UNIQUE NOT NULL
);

-- ======================
-- 5️⃣ Giá trị thuộc tính (gắn với sản phẩm)
-- ======================
CREATE TABLE product_attribute_values (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    attribute_id INT NOT NULL,
    value VARCHAR(255) NOT NULL,
    extra_price DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (attribute_id) REFERENCES product_attributes(id) ON DELETE CASCADE
);

-- ======================
-- 6️⃣ Mô tả theo section (header + gạch đầu dòng)
-- ======================
CREATE TABLE product_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE product_section_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_id INT NOT NULL,
    content LONGTEXT NOT NULL,
    is_image boolean default false,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (section_id) REFERENCES product_sections(id) ON DELETE CASCADE
);

-- ======================
-- Section mô tả cho danh mục
-- ======================
CREATE TABLE category_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL, -- tiêu đề section (VD: Giới thiệu, Chính sách)
    sort_order INT DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- ======================
-- Item trong section của danh mục
-- ======================
CREATE TABLE category_section_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_id INT NOT NULL,
    content LONGTEXT NOT NULL, -- có thể chứa HTML hoặc chỉ đường dẫn ảnh
    is_image BOOLEAN DEFAULT false, -- true = ảnh, false = text
    sort_order INT DEFAULT 0,
    FOREIGN KEY (section_id) REFERENCES category_sections(id) ON DELETE CASCADE
);

-- ======================
-- 7️⃣ Bảng đơn hàng (Orders)
-- ======================
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivery_type ENUM('self','gift') DEFAULT 'self', -- Đặt cho tôi / Đặt bánh tặng
    pickup_branch VARCHAR(255), -- Nếu nhận tại cửa hàng
    district VARCHAR(255),
    ward VARCHAR(255),
    address TEXT, -- Địa chỉ nhận bánh
    delivery_time DATETIME, -- Thời gian nhận bánh
    message_on_cake VARCHAR(255), -- Nội dung ghi lên bánh
    note TEXT, -- Ghi chú đơn hàng
    payment_method ENUM('bank','cod') DEFAULT 'cod',
    status ENUM('pending','confirmed','shipped','completed','cancelled') DEFAULT 'pending',
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================
-- 8️⃣ Chi tiết đơn hàng (Order Items)
-- ======================
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL, -- lưu tên sản phẩm tại thời điểm đặt
    attribute_summary VARCHAR(255), -- ví dụ: "Kích thước: 16cm, Cốt bánh: Gato Vani"
    quantity INT DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

create table requestCall (
	id INT AUTO_INCREMENT PRIMARY KEY,
	phone int not null,
    note varchar(255)
);

create table banner (
	id INT AUTO_INCREMENT PRIMARY KEY,
	image_url varchar(500),
    isSubBanner boolean default false,
    sort_order int default 0
);

create table shopInfo (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(225),
    phone int not null,
    email varchar(225),
    address varchar(500),
    link_face varchar(1000),
    link_mess varchar(1000),
    link_tiktok varchar(1000)
);

-- 1️⃣ Thêm cột isDelete cho categories
ALTER TABLE categories 
ADD COLUMN isDelete BOOLEAN DEFAULT FALSE ;

-- 2️⃣ Thêm cột isDelete cho products
ALTER TABLE products 
ADD COLUMN isDelete BOOLEAN DEFAULT FALSE ;

-- 3️⃣ Thêm cột isDelete cho product_attributes
ALTER TABLE product_attributes 
ADD COLUMN isDelete BOOLEAN DEFAULT FALSE ;

-- 4️⃣ Thêm cột logo_image cho shopInfo
ALTER TABLE shopInfo 
ADD COLUMN logo_image VARCHAR(500) ;

-- 4️⃣ Thêm cột logo_image cho shopInfo
ALTER TABLE orders 
ADD COLUMN isDelete BOOLEAN DEFAULT FALSE;

ALTER TABLE categories 
ADD COLUMN sort_order INT DEFAULT 0;

ALTER TABLE orders ADD COLUMN province VARCHAR(255);

ALTER TABLE shopInfo MODIFY COLUMN phone VARCHAR(20);


