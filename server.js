const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

// 1. DEFINE THE POOL FIRST (This must be above all routes)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',           
    password: 'gREATFAIRYTALE#155721183',
    database: 'bloodbrothers_db'
});

// 2. REGISTER ROUTE
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: "Email already in use" });
        } else {
            res.status(500).json({ message: "Server error during registration" });
        }
    }
});

// 3. LOGIN ROUTE
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = users[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            res.status(200).json({ 
                message: "Login successful",
                user: { id: user.id, name: user.name, email: user.email }
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login" });
    }
});

// 4. BOOK DONATION ROUTE
app.post('/book-donation', async (req, res) => {
    const { dob, location, aptDate, aptTime } = req.body;

    try {
        const [result] = await pool.execute(
            'INSERT INTO bookings (dob, location, appointment_date, appointment_time) VALUES (?, ?, ?, ?)',
            [dob, location, aptDate, aptTime]
        );

        res.status(201).json({ message: "Appointment booked successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while booking appointment" });
    }
});

// 5. GET BOOKINGS ROUTE
app.get('/bookings', async (req, res) => {
    try {
        const [bookings] = await pool.execute(
            'SELECT * FROM bookings ORDER BY appointment_date ASC, appointment_time ASC'
        );
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error fetching bookings" });
    }
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});