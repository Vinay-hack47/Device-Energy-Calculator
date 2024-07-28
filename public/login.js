// document.getElementById('loginForm').addEventListener('submit', function(event) {
//     event.preventDefault();

//     const username = document.getElementById('loginUsername').value;
//     const password = document.getElementById('loginPassword').value;

//     fetch('/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ username, password })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.auth) {
//             alert('Login successful');
//             // Handle successful login (e.g., redirect to a protected page)
//         } else {
//             document.getElementById('loginError').textContent = 'Login failed';
//             document.getElementById('loginError').style.display = 'block';
//         }
//     })
//     .catch(error => console.error('Error:', error));
// });




// document.getElementById('loginForm').addEventListener('submit', function (event) {
//     event.preventDefault();

//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;

//     fetch('/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ username, password })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.auth) {
//             localStorage.setItem('token', data.token); // Store JWT in localStorage
//             window.location.href = '/main'; // Redirect to main.html
//         } else {
//             alert('Login failed');
//         }
//     })
//     .catch(error => console.error('Error:', error));
// });



// login.js

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('token', result.token);
            window.location.href = '/main.html';
        } else {
            document.getElementById('loginError').textContent = result.message || 'Login failed';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loginError').textContent = 'An error occurred';
    }
});
