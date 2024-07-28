document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (password !== confirmPassword) {
        document.getElementById('signupError').textContent = 'Passwords do not match';
        document.getElementById('signupError').style.display = 'block';
        return;
    }

    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        if (data === 'User registered') {
            window.location.href = 'login.html';
        }
    })
    .catch(error => console.error('Error:', error));
});
