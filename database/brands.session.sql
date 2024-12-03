--@block 
CREATE TABLE brands(
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    uuid CHAR(36) NOT NULL UNIQUE,
    name VARCHAR(225) NOT NULL,
    slug VARCHAR(225) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL,
    UNIQUE (slug, deletedAt)
);
--@block 
SELECT *
FROM brands --@block 
    -- INSERT INTO brands(name, slug)
    -- VALUES
    -- ("Women", "woman"), 
    
    --@block 
    drop table brands 
    
    --@block 
    TRUNCATE brands