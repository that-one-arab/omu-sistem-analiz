require('dotenv').config()

const pool = require('../controller/database')

const statement = `
-- Table: services
CREATE TABLE services (
    service_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    active BOOLEAN,
    description TEXT,
    profitable BOOLEAN
);

-- Table: offers
CREATE TABLE offers (
    offer_id SERIAL PRIMARY KEY,
    service_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    active BOOLEAN NOT NULL,
    value NUMERIC,
    description TEXT,
    FOREIGN KEY (service_id) REFERENCES services(service_id)
);

-- Table: login
CREATE TABLE login (
    user_id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    name TEXT NOT NULL,
    hash TEXT NOT NULL,
    role TEXT NOT NULL,
    active BOOLEAN NOT NULL,
    register_date TIMESTAMP NOT NULL,
    email TEXT UNIQUE NOT NULL,
    assigned_area TEXT,
    balance NUMERIC
);

-- Table: sales_applications
CREATE TABLE sales_applications (
    id SERIAL PRIMARY KEY,
    submitter INTEGER NOT NULL,
    submit_time TIMESTAMP NOT NULL,
    status TEXT NOT NULL,
    last_change_date TIMESTAMP,
    client_name TEXT NOT NULL,
    activator TEXT NOT NULL,
    activator_id INTEGER NOT NULL,
    FOREIGN KEY (submitter) REFERENCES login(user_id)
);

-- Table: sales_applications_details
CREATE TABLE sales_applications_details (
    id INTEGER PRIMARY KEY,
    selected_service INTEGER NOT NULL,
    selected_offer INTEGER NOT NULL,
    description TEXT NOT NULL,
    sales_rep_details TEXT,
    status_change_date TIMESTAMP,
    final_sales_rep_details TEXT,
    image_urls TEXT[],
    client_name TEXT NOT NULL,
    transaction_id INTEGER,
    FOREIGN KEY (id) REFERENCES sales_applications(id),
    FOREIGN KEY (selected_service) REFERENCES services(service_id),
    FOREIGN KEY (selected_offer) REFERENCES offers(offer_id)
);

-- Table: transactions
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    amount NUMERIC NOT NULL,
    app_id INTEGER,
    balance_before NUMERIC,
    balance_after NUMERIC,
    date TIMESTAMP NOT NULL,
    report_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES login(user_id),
    FOREIGN KEY (app_id) REFERENCES sales_applications(id)
);

-- Table: transaction_reports
CREATE TABLE transaction_reports (
    report_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES login(user_id)
);

-- Table: goals
CREATE TABLE goals (
    goal_id SERIAL PRIMARY KEY,
    goal INTEGER NOT NULL,
    done INTEGER NOT NULL,
    success BOOLEAN NOT NULL,
    for_date DATE NOT NULL,
    service_id INTEGER NOT NULL,
    for_user_id INTEGER NOT NULL,
    FOREIGN KEY (for_user_id) REFERENCES login(user_id)
);
`;

(async function () {
    await pool.query(statement)
    console.log('Tables created')
    process.exit(0)
})()
