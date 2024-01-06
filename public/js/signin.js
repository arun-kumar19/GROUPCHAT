document.getElementById('loginSubmit').addEventListener('click', loginUser);

    function loginUser(e) {
        e.preventDefault();
        console.log('hello');
        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
        };

        // Make a POST request using Axios
        axios.post('/logincheck', formData)
            .then(response => {
                alert('Login successful!');
                console.log('resonse:',response);
                localStorage.setItem("id",response.data.id)
                localStorage.setItem("name",response.data.name)
                window.location.href='/index/'
            })
            .catch(error => {
                console.error('Error during login:', error.message);
                alert('Login failed. Please check your email and password.');
            });
    }


