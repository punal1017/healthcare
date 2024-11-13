const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'user' && password === 'pass') {
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Invalid username or password');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
