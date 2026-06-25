-- Create database
CREATE DATABASE document_system;
USE document_system;

-- Documents table
CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size INT NOT NULL,
    content LONGTEXT,
    status ENUM('draft', 'signed', 'final') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Signatures table
CREATE TABLE signatures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    signature_path VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document signatures table (for placement data)
CREATE TABLE document_signatures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document_id INT NOT NULL,
    signature_id INT NOT NULL,
    position_x INT NOT NULL,
    position_y INT NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,
    page_num INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (signature_id) REFERENCES signatures(id) ON DELETE CASCADE
);

-- Users table (basic)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);attendance