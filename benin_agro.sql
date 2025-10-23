-- =====================================
-- BASE DE DONNÉES BENIN_AGRO
-- =====================================
DROP DATABASE benin_agro;

CREATE DATABASE IF NOT EXISTS benin_agro;
USE benin_agro;

-- =====================================
-- USERS
-- =====================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================
-- PARCELS
-- =====================================
CREATE TABLE IF NOT EXISTS parcels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(255),
    area DECIMAL(12,2),
    crop VARCHAR(150),
    status ENUM('active','inactive','planned') DEFAULT 'planned',
    lastActivity DATE,
    soilType VARCHAR(100),
    irrigationStatus ENUM('Oui','Non','En cours') DEFAULT 'Non',
    rainfall DECIMAL(12,2) DEFAULT 0,
    plantingDate DATE,
    harvestDate DATE,
    ph DECIMAL(5,2) DEFAULT 0,
    organicMatter DECIMAL(5,2) DEFAULT 0,
    notes TEXT,
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);



-- =====================================
-- CROPS
-- =====================================
CREATE TABLE IF NOT EXISTS crops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    startMonth VARCHAR(20) NOT NULL,
    endMonth VARCHAR(20) NOT NULL,
    crop_type VARCHAR(50) NOT NULL,
    water_needs ENUM('low','medium','high') NOT NULL,
    type VARCHAR(100),
    season VARCHAR(50),
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================
-- HARVESTS
-- =====================================
CREATE TABLE IF NOT EXISTS harvests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parcel_id INT,
    crop_id INT,
    date DATE NOT NULL,
    quantity DECIMAL(12,2) NOT NULL,
    unit VARCHAR(30) DEFAULT 'kg',
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parcel_id) REFERENCES parcels(id) ON DELETE SET NULL,
    FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================
-- INVENTORY ITEMS
-- =====================================
CREATE TABLE IF NOT EXISTS inventory_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(80) UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    unit VARCHAR(30) DEFAULT 'unit',
    unit_price DECIMAL(12,2) DEFAULT 0,
    wholesale_price DECIMAL(12,2) DEFAULT 0,
    stock DECIMAL(12,2) DEFAULT 0,
    remainder DECIMAL(12,2) DEFAULT 0,
    total_sold DECIMAL(12,2) DEFAULT 0,
    total_amount_sold DECIMAL(14,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================
-- STOCK MOVEMENTS
-- =====================================
CREATE TABLE IF NOT EXISTS stock_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    type ENUM('in','out','adjustment') NOT NULL,
    quantity DECIMAL(12,2) NOT NULL,
    unit_price DECIMAL(12,2),
    reference VARCHAR(150),
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================
-- FINANCES
-- =====================================
CREATE TABLE IF NOT EXISTS finances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parcel_id INT,
    type ENUM('income','expense') NOT NULL,
    category VARCHAR(120),
    amount DECIMAL(14,2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parcel_id) REFERENCES parcels(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================
-- SYNC LOGS
-- =====================================
CREATE TABLE IF NOT EXISTS sync_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module VARCHAR(80) NOT NULL,
    action VARCHAR(80),
    status ENUM('started','success','error') NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT,
  type ENUM('in', 'out') NOT NULL,
  quantity INT NOT NULL,
  date DATE NOT NULL,
  user VARCHAR(100),
  notes TEXT,
  FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS weather_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  region VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  severity ENUM('faible', 'modérée', 'élevée', 'extrême') NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
