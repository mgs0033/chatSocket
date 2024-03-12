var socket = io.connect('http://localhost:3000', { 'forceNew': true });
$(document).ready(function() {
    // Obtener el nombre de usuario de localStorage
    var usuario = localStorage.getItem('username');
    // Escribir el nombre de usuario en el campo correspondiente
    $('#username').val(usuario);
});

socket.on('connected-users', function (users) {
    renderConnectedUsers(users);
});

socket.on('messages', function (data) {
    console.log(data);
    render(data);
});

socket.on('hay-nuevo', function (data) {
    console.log(data);
});

socket.on('private-message', function (data) {
    console.log(data);
    renderPrivateMessage(data);

    console.log(`Mensaje privado de ${data.from}: ${data.message}`);
});

function addMessage(e) {
    var message = {
        autor: document.getElementById("username").value,
        texto: document.getElementById("texto").value
    };

    var idusuario = document.getElementById("idusuario").value;

    if (idusuario.trim() !== "") {
        socket.emit("private-message", { to: idusuario, message: message.texto });
    } else {
        socket.emit("new-message", message);
    }

    return false;
}

function render(data) {
    var html = data.map(function (elem, index) {
        return (`
            <div>
                <strong>${elem.autor}</strong>:
                <em>${elem.texto}</em>
            </div>`
        );
    }).join(" ");

    document.getElementById('chat').innerHTML = html;
}

function renderConnectedUsers(users) {
    var usersHtml = users.map(function (user) {
        return `<div>${user.username} (ID: ${user.id})</div>`;
    }).join(" ");

    document.getElementById('connected-users').innerHTML = usersHtml;
}

function renderPrivateMessage(data) {
    console.log(data);
    var html = `<div >
            <br><p>(Mensaje Privado de): ${data.from}</p></br>
            <p>${data.message}</p>
        </div>`;
    document.getElementById('chat').innerHTML += html;
    
}
