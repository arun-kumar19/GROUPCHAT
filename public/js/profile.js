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

document.addEventListener("DOMContentLoaded",fetchmessage);

async function fetchmessage(){
    
    const response=await axios.get('/fetchmessage',{headers:{'Authorization':localStorage.getItem("token")}});
    console.log('resonse:',response);
    const datalength=response.data.message.length;
    const data=response.data.message;
    //console.log('data:',data[i].message)
    const table=document.getElementById("tabledata");
    const tbody=document.createElement("tbody");
    tbody.id="tbody";
    table.appendChild(tbody)
    const tr=document.createElement("tr");
    const td=document.createElement("td");
    td.textContent="You Joined";
    tr.appendChild(td);
    tbody.appendChild(tr);

    td.textContent="You Joined";
    tr.appendChild(td);
    tbody.appendChild(tr);

    if(datalength>0){
        for(let i=0;i<datalength;i++){
                console.log('data:',data[i].message)
            const tr=document.createElement("tr");
            const td=document.createElement("td");
            td.textContent=data[i].message;
            tr.appendChild(td);
            tbody.appendChild(tr);

        }
    }
    else{
        const li=document.createElement("p");
            li.textContent='no message';
            ul.appendChild(li);
    }
    
}

setInterval(refreshMessages, 1000);


async function refreshMessages(){
    
   
    const table=document.getElementById("tabledata");
    const tablebody=document.getElementById("tbody");
    console.log('tablebody:',tablebody);
    table.removeChild(tablebody)
    const response=await axios.get('/fetchmessage',{headers:{'Authorization':localStorage.getItem("token")}});

    console.log('resonse:',response);
    const datalength=response.data.message.length;
    const data=response.data.message;
    //console.log('data:',data[i].message)

    const tbody=document.createElement("tbody");
    tbody.id="tbody";
    table.appendChild(tbody)
    const tr=document.createElement("tr");
    const td=document.createElement("td");
    td.textContent="You Joined";
    tr.appendChild(td);
    tbody.appendChild(tr);

    td.textContent="You Joined";
    tr.appendChild(td);
    tbody.appendChild(tr);

    if(datalength>0){
        
        for(let i=0;i<datalength;i++){
                console.log('data:',data[i].message)
            const tr=document.createElement("tr");
            const td=document.createElement("td");
            td.textContent=data[i].message;
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
    }
    else{
        const li=document.createElement("p");
            li.textContent='no message';
            ul.appendChild(li);
    }
    
}