document.getElementById('loginSubmit').addEventListener('click', loginUser);

    function loginUser(e) {
        e.preventDefault();
//        console.log('hello');
        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
        };

        // Make a POST request using Axios
        axios.post('/logincheck', formData)
            .then(response => {
                alert('Login successful!');
                console.log('resonse:',response);
                localStorage.setItem("token",response.data.token)
                localStorage.setItem("name",response.data.name)
                window.location.href='/index/'
            })
            .catch(error => {
                console.error('Error during login:', error);
                if(error.request.status===401){
                
                alert('User is not authorised. Please check your password.');
                }
                if(error.request.status===404){
                    alert('User not found.Sign Up Now');
                   }
            });
    }


