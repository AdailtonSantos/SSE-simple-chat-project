const express = require("express");
const app = express();
const port = 8085;
const cors = require("cors");

app.use(cors())
app.use(express.json()); // Para processar JSON no corpo das requisições

const connections = {}

app.get('/initConnection', (req, res) => {

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const user = req.query.user
    connections[user] = res

    req.on('close', () => {
        delete connections[user]
    })

})

app.post('/send', (req, res) => {

    const { from, destination, message } = req.body

    const connection = connections[destination]
    if (connection) {
        connection.write(`data: ${JSON.stringify({ from, message })}\n\n`)
    }
    res.status(200).json({ status: "Mensagem enviada" });


})

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
