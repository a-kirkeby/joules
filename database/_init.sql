INSERT INTO Tenants (name, description) VALUES ('NoveltyGraph', 'Our own tenant for testing');
INSERT INTO Websites (tenantId, name, slug, url, description) VALUES
(1, 'Localhost 1', 'localhost-1', 'http://localhost:4001', 'Site with a single page, minimal HTML and a single image'),
(1, 'Localhost 2', 'localhost-2', 'http://localhost:4002', 'Site with two pages, minimal HTML and bootstrap css')
;
INSERT INTO Users (tenantId, email, password) VALUES (1, 'aki@noveltygraph.com', 'XjN3f8rfR7Q69Hfu')
