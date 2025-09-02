CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    produto VARCHAR(50),
    order_date DATE,
    valor_liquido NUMERIC
);

INSERT INTO orders (produto, order_date, valor_liquido) VALUES
('Comum Jaguariuna', '2025-01-01', 3150),
('Vale Transporte Jaguariuna', '2025-01-02', 2750),
('Comum Jaguariuna', '2025-02-01', 1500),
('Vale Transporte Jaguariuna', '2025-02-15', 3000);
