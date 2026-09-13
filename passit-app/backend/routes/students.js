const express = require('express');
const router  = express.Router();
const fs      = require('fs');
const path    = require('path');
const bcrypt  = require('bcrypt');

const STUDENTS_FILE = path.join(__dirname, '../data/students.json');
const SALT_ROUNDS   = 10;

function readStudents() {
  try {
    return JSON.parse(fs.readFileSync(STUDENTS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeStudents(students) {
  fs.writeFileSync(STUDENTS_FILE, JSON.stringify(students, null, 2));
}

router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ success: false, message: 'Name and password are required.' });
  }

  const students      = readStudents();
  const normalizedName = name.trim().toLowerCase();
  const existing      = students.find(s => s.name.trim().toLowerCase() === normalizedName);

  if (!existing) {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    students.push({ name: name.trim(), password: hashed, createdAt: new Date().toISOString() });
    writeStudents(students);
    return res.json({ success: true, isNew: true });
  }

  const match = await bcrypt.compare(password, existing.password);
  if (match) {
    return res.json({ success: true, isNew: false });
  }

  return res.json({ success: false, message: 'Incorrect password. Please try again.' });
});

module.exports = router;
