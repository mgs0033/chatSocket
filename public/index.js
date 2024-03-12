$(document).ready(function() {
    $('#iniciarSesion').click(function() {
        var usuario = $('#usuario').val();
        // Guardar el nombre de usuario en localStorage
        localStorage.setItem('username', usuario);
        
        // Crear un formulario dinámicamente para enviar el nombre de usuario a chat.html
        var form = $('<form action="chat.html" method="POST">' +
            '<input type="hidden" name="username" value="' + usuario + '">' +
            '</form>');
        $('body').append(form);
        form.submit();
    });
});

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
