const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const usersFile = 'usuarios.json';
const cors = require('cors');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://chatsocket-1.onrender.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Controlador de opciones para /registrar
app.options('/registrar', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://chatsocket-1.onrender.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

// Controlador de opciones para /login
app.options('/login', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://chatsocket-1.onrender.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

app.use(express.static('public'));

const messages = [
    {
        id: 1,
        texto: "Hola, soy el mensaje de inicio",
        autor: "Administrador"
    }
];

// Registro de usuarios conectados
const connectedUsers = {};

app.get('/chat', (req, response) => {
    const contenido = fs.readFileSync("public/chat.html");
    response.setHeader("Content-type", "text/html");
    response.send(contenido);
});

app.get('/', (req, response) => {
    const contenido = fs.readFileSync("public/index.html");
    response.setHeader("Content-type", "text/html");
    response.send(contenido);
});

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    const userId = socket.id;

    connectedUsers[userId] = {
        socket: socket,
        username: 'Usuario' + userId.substring(0, 5)
    };

    emitConnectedUsers();

    socket.emit('messages', messages);
    io.emit("hay-nuevo", "Hay alguien nuevo en el chat");

    socket.on('new-message', (data) => {
        messages.push(data);
        io.emit('messages', messages);
    });

    socket.on('private-message', (data) => {
        const userExists = Object.keys(connectedUsers).includes(data.to);
        if (userExists) {
            socket.to(data.to).emit('private-message', { message: data.message, from: socket.id, to: data.to });
            socket.emit('private-message', { message: data.message, from: socket.id, to: data.to });
        } else {
            const errorMessage = `El usuario con ID ${data.to} no está conectado, el mensaje privado no se pudo enviar.`;
            socket.emit('private-message-error', { error: errorMessage });
        }
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', userId);
        delete connectedUsers[userId];
        emitConnectedUsers();
    });

    function emitConnectedUsers() {
        io.emit('connected-users', Object.keys(connectedUsers).map(userId => ({ id: userId, username: connectedUsers[userId].username })));
    }
});

app.post('/registrar', (req, res) => {
    const { username, password } = req.body;

    let users = [];
    try {
        const usersData = fs.readFileSync(usersFile);
        users = JSON.parse(usersData);
    } catch (error) {
        console.error('Error al leer el archivo de usuarios:', error);
    }

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).send('El usuario ya existe');
    }

    const newUser = { username, password };
    users.push(newUser);

    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    res.send('Usuario registrado correctamente');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    let users = [];
    try {
        const usersData = fs.readFileSync(usersFile);
        users = JSON.parse(usersData);
    } catch (error) {
        console.error('Error al leer el archivo de usuarios:', error);
    }

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.redirect('/chat');
        console.log("El inicio llega al servidor");
    } else {
        res.status(401).send('Credenciales incorrectas');
    }
});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
