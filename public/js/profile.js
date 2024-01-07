/*const getNameFromLocalStorage=localStorage.getItem("name");
console.log('name:',getNameFromLocalStorage);
document.getElementById("name").innerText=getNameFromLocalStorage.replace(/\b[a-z]/g, (x) => x.toUpperCase())
*/

document.getElementById("sendMessage").addEventListener("click",saveMessage);

async function saveMessage(){

    const message=document.getElementById("message").value;
console.log('message:',message);

const token=localStorage.getItem("token");

    if(message.length>0){

        const messageJson={
            token:token,
            message:message
        }
        const response=await axios.post('/savemessage',messageJson);
        console.log('response:',response);
        if(response.status===200){
            console.log('message saved successfully');
            document.getElementById('message').value=""
        }
        else{
            alert("semething went wrong. try again later");
        }
    }
    else{
        
        alert("no message");
    }
}

