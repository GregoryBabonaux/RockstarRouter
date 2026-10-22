CREATE TABLE customers (customer_id INTEGER PRIMARY KEY, name TEXT, email TEXT);
CREATE TABLE invoices (id INTEGER PRIMARY KEY, customer_id INTEGER REFERENCES customers(customer_id), date TEXT, amount NUMERIC);
