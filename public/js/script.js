document.getElementById("signupsubmit").addEventListener('click',saveUserInfo);

function saveUserInfo(){
    const name=document.getElementById("name").value;
    const email=document.getElementById("email").value;
    const phone=document.getElementById("phone").value;
    const password=document.getElementById("password").value;
console.log(name, ' ',email,' ',phone,' ',password);
const formdata={
    name,
    email,
    phone,
    password,
}
        axios.post('/signup',formdata).then(response=>{
            console.log('resonse:',response);
            alert("User created successfully");
     document.getElementById("name").value="";
    document.getElementById("email").value="";
    document.getElementById("phone").value="";
    document.getElementById("password").value="";
conso
        }).catch(error=>{
            if(error.request.status===406){
                alert(error.response.data);
                console.log('error during creating user:',error);
            }
            else{
            alert("something went wrong. try again after sometime");
            }
        })
}
