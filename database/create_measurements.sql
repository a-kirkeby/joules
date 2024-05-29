DROP TABLE IF EXISTS Measurements;
CREATE TABLE Measurements (
    measurementId INT PRIMARY KEY AUTO_INCREMENT,
    tenantId INT,
    websiteId INT,
    modelId INT,
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);