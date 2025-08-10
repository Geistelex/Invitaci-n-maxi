const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.json());

// Archivo para guardar el contador
const COUNTER_FILE = path.join(__dirname, 'counter.json');

// Inicializar contador
let contador = 0;
try {
    const data = fs.readFileSync(COUNTER_FILE, 'utf8');
    contador = JSON.parse(data).total || 0;
} catch (e) {
    fs.writeFileSync(COUNTER_FILE, JSON.stringify({ total: 0 }));
}

// Ruta para confirmaciones
app.post('/confirmar', (req, res) => {
    contador++;
    fs.writeFileSync(COUNTER_FILE, JSON.stringify({ total: contador }));
    res.json({ total: contador });
});

// Ruta para obtener el total (opcional)
app.get('/total', (req, res) => {
    res.json({ total: contador });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));