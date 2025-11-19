const express = require('express');

const PORT = 3000;
const app = express();

app.get('/', (req, res) => {
    res.send("Hello express");
})


app.listen(PORT, (error) => {
    if (error) {
        console.error(error);
    }

    console.log(`Express app running on port ${PORT}.`);
})