

function registrar() {
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;

    fetch('http://localhost:3000/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: usuario, password: contrasena })
    })
    .then(response => response.text())
    .then(message => alert(message))
    .catch(error => console.error('Error:', error));
}

function iniciarSesion() {
const usuario = document.getElementById('usuario').value;
const contrasena = document.getElementById('contrasena').value;
fetch('http://localhost:3000/login', {
method: 'POST',
headers: {
    'Content-Type': 'application/json'
},
body: JSON.stringify({ username: usuario, password: contrasena })
})
.then(response => {
if (response.ok) {
    window.location.href = '/chat'; // Redirigir al usuario a chat.html
} else {
    console.error('Credenciales incorrectas');
}
})
.catch(error => console.error('Error:', error));
}
