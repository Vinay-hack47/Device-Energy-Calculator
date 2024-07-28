const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');

dotenv.config();

const app = express();
const port = 3001;

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/signup', (req, res) => { 
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        res.status(201).send('User registered');
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        if (results.length === 0) {
            return res.status(404).send('User not found');
        }

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send('Invalid password');
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).json({ auth: true, token });
    });
});

app.post('/validate', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ valid: false });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ valid: false });
        }
        res.json({ valid: true });
    });
});

// Export to CSV
app.post('/export/csv', (req, res) => {
    const devices = req.body.devices;
    const fields = ['name', 'power', 'hours', 'cost', 'daily', 'monthly', 'yearly'];
    const opts = { fields };
    try {
        const parser = new Parser(opts);
        const csv = parser.parse(devices);
        res.attachment('devices.csv').send(csv);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating CSV');
    }
});

// Export to Excel
app.post('/export/excel', async (req, res) => {
    const devices = req.body.devices;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Devices');

    worksheet.columns = [
        { header: 'Device Name', key: 'name' },
        { header: 'Power Rating (W)', key: 'power' },
        { header: 'Usage Hours', key: 'hours' },
        { header: 'Electricity Cost ($/kWh)', key: 'cost' },
        { header: 'Daily Consumption (kWh)', key: 'daily' },
        { header: 'Monthly Consumption (kWh)', key: 'monthly' },
        { header: 'Yearly Consumption (kWh)', key: 'yearly' }
    ];

    devices.forEach(device => {
        worksheet.addRow(device);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=devices.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();
});

// Export to PDF
app.post('/export/pdf', (req, res) => {
    const devices = req.body.devices;
    const doc = new PDFDocument();
    const filename = 'devices.pdf';
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    
    doc.pipe(res);
    
    doc.fontSize(18).text('Devices Energy Consumption', { align: 'center' });
    doc.moveDown();
    
    devices.forEach(device => {
        doc.fontSize(12).text(`Device Name: ${device.name}`);
        doc.text(`Power Rating (W): ${device.power}`);
        doc.text(`Usage Hours: ${device.hours}`);
        doc.text(`Electricity Cost ($/kWh): ${device.cost}`);
        doc.text(`Daily Consumption (kWh): ${device.daily}`);
        doc.text(`Monthly Consumption (kWh): ${device.monthly}`);
        doc.text(`Yearly Consumption (kWh): ${device.yearly}`);
        doc.moveDown();
    });
    
    doc.end();
});

// Root route to serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
