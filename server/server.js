import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // Corrected 'paasword' to 'password'
    database: "crud"
});

// Get all students
app.get("/", (req, res) => {
    const sql = "SELECT * FROM student";
    db.query(sql, (err, result) => {
        if (err) {
            return res.json({ message: "Error inside server" });
        }
        return res.json(result);
    });
});

// Create a new student
app.post("/student", (req, res) => {
    const sql = "INSERT INTO student (`name`, `email`, `phone`, `username`, `password`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.phone,
        req.body.username,
        req.body.password
    ];
    db.query(sql, [values], (err, result) => {
        if (err) {
            return res.json(err);
        }
        return res.json(result);
    });
});

// Read a student by ID
app.get("/read/:id", (req, res) => {
    const sql = "SELECT * FROM student WHERE id = ?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.json({ message: "Error inside server" });
        }
        return res.json(result);
    });
});

// Update a student by ID
app.put('/student/:id', (req, res) => {
    const sql = 'UPDATE student SET `name` = ?, `email` = ?, `phone` = ? WHERE id = ?';
    const id = req.params.id; // Retrieve the ID from the request parameters
    db.query(sql, [req.body.name, req.body.email, req.body.phone, id], (err, result) => {
        if (err) {
            return res.json({ message: "Error inside server" });
        }
        return res.json(result);
    });
});

// Delete a student by ID
app.delete("/student/:id", (req, res) => {
    const sql = "DELETE FROM student WHERE id = ?";
    const id = req.params.id; // Retrieve the ID from the request parameters
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.json({ message: "Error inside server" });
        }
        return res.json({ message: "user deleted successfully" });
    });
});


app.post("/signup", (req, res) => {
    const { name, email, phone, username, password } = req.body;

    // Insert user data into the student table
    const sql = "INSERT INTO student (`name`, `email`, `phone`, `username`, `password`) VALUES (?)";
    const values = [name, email, phone, username, password]; // Storing plaintext password

    db.query(sql, [values], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error creating user", error: err });
        }
        return res.status(201).json({ message: "User created successfully" });
    });
});

// Login endpoint
app.post("/", (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM student WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }

        if (result.length === 0) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        return res.json({ message: "Login successful", user: result[0] });
    });
});






// Start the server
app.listen(7000, () => {
    console.log("Server is connected successfully");
});