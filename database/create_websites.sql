DROP TABLE IF EXISTS Websites;
CREATE TABLE Websites (
    websiteId INT PRIMARY KEY AUTO_INCREMENT,
    tenantId INT,
    name VARCHAR(255),
    slug VARCHAR(255),
    url VARCHAR(255),
    description TEXT,
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);