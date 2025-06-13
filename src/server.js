const app = require('./index'); // Import Express app from index.js
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Tutoring app running on http://localhost:${PORT}`);
});