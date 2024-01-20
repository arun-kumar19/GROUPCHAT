//const { json } = require("body-parser");

/*const getNameFromLocalStorage=localStorage.getItem("name");
console.log('name:',getNameFromLocalStorage);
document.getElementById("name").innerText=getNameFromLocalStorage.replace(/\b[a-z]/g, (x) => x.toUpperCase())
*/
let localStorageMessages;
const token=localStorage.getItem("token");
console.log('taken:',token);
document.getElementById("sendMessage").addEventListener("click",saveMessage);

async function saveMessage(){
    const chatgroupid=localStorage.getItem("chatgroupid");

    const message=document.getElementById("message").value;
console.log('message:',message);

const token=localStorage.getItem("token");

    if(message.length>0){

        const messageJson={
            token:token,
            message:message,
            chatgroupid:chatgroupid
        }
        const response=await axios.post('/savemessage',messageJson);
        console.log('response:',response);
        if(response.status===200){
            alert('message sent successfully');
            /* const jsonData={
                id:response.data.result.id,
                message:response.data.result.message
            }
console.log('jsonData:',jsonData);
            if(localStorageMessages.length===10){
                console.log('abcd');
                localStorageMessages.shift();
                console.log('localStorageMessages updated:',localStorageMessages);

                localStorageMessages.push(jsonData)
                console.log('localStorageMessages updated after push:',localStorageMessages);
                localStorage.setItem("last10messages",JSON.stringify(localStorageMessages))
            }
            else{
                localStorageMessages.push(jsonData);
            } */
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
    const toggleElement = document.getElementById("toggle");
    toggleElement.style.display = "none";
    document.getElementById('welcome').textContent="Welcome "+localStorage.getItem("name")
   const fetchgroups= await axios.get('/groupinfo',{headers:{'Authorization':token}})
    console.log('fetchgroups:',fetchgroups);
    const data=fetchgroups.data.groupInfos;
    const div=document.getElementById("groupid");
    //<button type="submit" class="btn btn-primary btn-block" id="group" title="group" data-toggle="modal" data-target="#myModal">Create Group</button>
    for(let i=0;i<data.length;i++){
        const button=document.createElement("button");
        button.type="submit";
        button.className="mb-1"
        button.classList="btn btn-success btn-block"
        button.id=data[i].groupid;
        button.onclick=function() {
            loadChat(data[i].groupid,data[i].groupname,data[i].memberstatus);
          };
        button.value=data[i].groupname;
        button.title=data[i].groupname;
        button.textContent=data[i].groupname;
        div.appendChild(button);
    }

    async function loadChat(groupid,chatgroupname,memberstatus){
        toggleElement.style.display = "block";
    console.log('group id:',groupid,' chatgroupname:',chatgroupname);
    const getChat=await axios.get(`/loadchat?groupid=${groupid}`,{headers:{'Authorization':localStorage.getItem('token')}})
    console.log('response chat:',getChat);
    document.getElementById("chat_header").textContent=chatgroupname;
    loadChatContent(getChat,groupid,chatgroupname);
    console.log('memberstatus:',memberstatus);
    if(!memberstatus){
        document.getElementById("message").disabled="disabled"
    }

    }
/* 
localStorageMessages=JSON.parse(localStorage.getItem("last10messages"));
    //console.log('total localStorageMessages:',localStorageMessages.length,'  and type is :',typeof localStorageMessages);    

    //load messages from local storage
    if(localStorageMessages!=null && localStorageMessages.length>0){
        console.log('loaded from local storage');
    const length=localStorageMessages.length;

    const table=document.getElementById("tabledata");
    const tbody=document.createElement("tbody");
    tbody.id="tbody";
    table.appendChild(tbody)
    const tr=document.createElement("tr");
    const td=document.createElement("td");
    td.class="text-center"
    td.textContent="You Joined";
    tr.appendChild(td);
    tbody.appendChild(tr);
   
        for(let i=0;i<length;i++){
                console.log('data:',localStorageMessages[i].message)
            const tr=document.createElement("tr");
            const td=document.createElement("td");
            td.textContent=localStorageMessages[i].message;
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
    
    }
 
    const response=await axios.get('/fetchmessage',{headers:{'Authorization':localStorage.getItem("token")}});
    console.log('resonse:',response);
    const datalength=response.data.message.length;
    const fixTenLength=datalength<6?datalength:6;
    console.log('fix10:',fixTenLength);
    const data=response.data.message;
    console.log('data:',data)
    const table=document.getElementById("tabledata");
    const tbody=document.createElement("tbody");
    tbody.id="tbody";
    table.appendChild(tbody)
    const tr=document.createElement("tr");
    const td=document.createElement("td");
    td.class="text-center"
    td.textContent="You Joined";
    tr.appendChild(td);
    tbody.appendChild(tr);

    const messages=[];
    if(datalength>0){

        for(let i=0;i<fixTenLength;i++){
                console.log('data:',data[i].message)
            const tr=document.createElement("tr");
            const td=document.createElement("td");
            td.textContent=data[i].message;
            if(i<=9){
            messages.push(data[i]);
            console.log('messages arr length',messages.length);
            }
            tr.appendChild(td);
            tbody.appendChild(tr);
        }

        localStorage.setItem('last10messages',JSON.stringify(messages));
    }
    else{
        const li=document.createElement("p");
            li.textContent='no message';
            ul.appendChild(li);
    }
}   
*/
}

//setInterval(refreshMessages, 1000);


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
    td.class="text-center"
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


document.getElementById("group").addEventListener("click",function(){
    loadContacts('contacts1')
});

async function loadContacts(name){

    const response=await axios.get("/loadcontacts",{headers:{'Authorization':localStorage.getItem("token")}});

    console.log('contacts:',response.data.message);
    const contacts=response.data.message;
    const parent=document.getElementById(name);
    parent.innerHTML='';
   const h4=document.createElement("h5")
   h4.textContent="Select Contacts";
    parent.appendChild(h4)
    for(let i=0;i<contacts.length;i++){
        const input=document.createElement("input");
            input.type="checkbox";
        input.id="flexCheckDefault";
        input.name=contacts[i].id;
        input.value=contacts[i].name;
        input.class="form-check-input"
        const label=document.createElement("label");
        label.for="flexCheckDefault";
        let contact=contacts[i].name+' '+contacts[i].phone;
        label.textContent=contact;
        label.class="form-check-input"
        const br=document.createElement("br");
        parent.appendChild(input);
        parent.appendChild(label);
        parent.appendChild(br);

    }


}

document.getElementById("createGroupSubmitBtn").addEventListener("click",submitForm)

async function submitForm() {
    console.log('hello from submit form');
    
    const groupName = document.getElementById('groupname').value;

    const checkboxes = document.querySelectorAll('#contacts1 input[type="checkbox"]:checked');

    // Extract and log the names of the selected checkboxes
    const selectedNames = Array.from(checkboxes).map(checkbox => {
        const label = checkbox.getAttribute('name'); // Get the <label> element next to the checkbox
        return label; // Extract and trim the text content
    });

    const groupinfo={
        groupname:groupName,
        member:selectedNames
    }

    console.log('Selected Names:', selectedNames);
    console.log('Group Name:', groupName);
    $('#myModal').modal('hide');

    const response=await axios.post('/creategroup',groupinfo,{headers:{'Authorization':localStorage.getItem("token")}})

    if(response.data.STATUS===1){
        alert('Group Created Successdully')
    }
    else{
        alert('Something went wrong!!!')
    }
}


function loadChatContent(response,groupid,groupname){
    localStorage.setItem("chatgroupid",groupid);
    localStorage.setItem("groupname",groupname);
    const datalength=response.data.message.length;
    const cid=response.data.cid;
    const fixTenLength=datalength<6?datalength:6;
    const start=datalength>fixTenLength?datalength-fixTenLength:0;
    console.log('fix10:',fixTenLength);
    const data=response.data.message;
    console.log('data:',data)
    const table=document.getElementById("tabledata");
    table.innerHTML="";
    table.name=groupid;//for specific chat group
    const tbody=document.createElement("tbody");
    tbody.id="tbody";
    table.appendChild(tbody)
   
    const messages=[];
    if(datalength>0){
        console.log('hello from line 301');
        const tr=document.createElement("tr");
        const td=document.createElement("td");
        td.textContent="You Joined";
        //td.classList="text-center"
        //td.id="center"
        tr.appendChild(td);
        tbody.appendChild(tr);

        for(let i=start;i<datalength;i++){
                console.log('data:',data[i].message)
            const tr=document.createElement("tr");
            const td=document.createElement("td");
            //td.id="hello";
            const dbTimeString = data[i].createdAt;
    const dbTime = new Date(dbTimeString);
    const options = { 
        hour: '2-digit', 
        minute: '2-digit'
        
};

const options2 = { 
    day: '2-digit', 
    month: 'short',
    year:'2-digit',
    
};

const formattedTime =dbTime.toLocaleString('en-US', options)+' '+dbTime.toLocaleString('en-US', options2);
    if(data[i].memberid==cid){
        td.classList='text-right'
        td.textContent = 'You: ' + data[i].message;
    }
    else{
        td.textContent = `${data[i].name}: ` + data[i].message;
    }
        td.innerHTML += "<br><span style='font-size: 0.6em;'>" + formattedTime + "</span>";
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
}
else{
    const tr=document.createElement("tr");
    const td=document.createElement("td");
    td.textContent="no chat found";
    tr.appendChild(td);
    tbody.appendChild(tr);

    const tr1=document.createElement("tr");
    const td1=document.createElement("td");
    td1.textContent="You Joined:";
    td1.class="text-center";
    tr1.appendChild(td1);
    tbody.appendChild(tr1);

}
}


document.getElementById("myModalgroupinfo1").addEventListener("click",()=>{
    console.log('group chat name:',localStorage.getItem("groupname"));
document.getElementById("modal-title_group").textContent=localStorage.getItem("groupname");
})


document.getElementById("myModalgroupinfo1").addEventListener("click",function(){
    loadGroupContacts('contacts2')
});

async function loadGroupContacts(name){
const groupid=localStorage.getItem("chatgroupid");
    const response=await axios.get(`/loadgroupcontacts?groupid=${groupid}`,{headers:{'Authorization':localStorage.getItem("token")}});

    console.log('contacts:',response.data);
    const adminstatus=response.data.isadmin;
    console.log('adminstatus:',adminstatus);
    console.log('currentuserid:',response.data.userid);
    const currentuserid=response.data.userid;
    const contacts=response.data.data;
    const parent=document.getElementById(name);
    parent.innerHTML='';
    const ul=document.createElement("ul");
    ul.classList="mt-1"
    parent.appendChild(ul);

    for(let i=0;i<contacts.length;i++){
        const li=document.createElement("li");
        li.name=contacts[i].id;
        li.style.marginBottom = '10px';
        li.value=contacts[i].usersignup.name;
        let contact;
console.log('data:',contacts[i].adminid,' ', response.data.userid,' ',contacts[i].memberid,contacts[i].adminid===contacts[i].memberid && contacts[i].memberid===currentuserid)
console.log(typeof contacts[i].adminid,' ', typeof contacts[i].memberid,' ',typeof  currentuserid)

        if(contacts[i].adminid==contacts[i].memberid && contacts[i].memberid==currentuserid ){
            console.log('admin yes');
        contact=`You <b> admin </b><button type="submit" id=${contacts[i].memberid} onclick="checkAdmin('${localStorage.getItem('chatgroupid')}', '${contacts[i].memberid}', 1)", class="btn btn-primary btn-sm"> dismiss as admin</button>`;
    
        }

        if(contacts[i].adminid===contacts[i].memberid && contacts[i].memberid!=currentuserid && adminstatus){
            console.log('admin no');
        contact=`${contacts[i].usersignup.name}<b> admin</b> <button type="submit" id=${contacts[i].memberid} onclick="checkAdmin('${localStorage.getItem('chatgroupid')}', '${contacts[i].memberid}', 1)", class="btn btn-primary btn-sm"> dismiss as admin</button>
         <button type="submit" id=${contacts[i].memberid} onclick="removeuser('${localStorage.getItem('chatgroupid')}', '${contacts[i].memberid}')", class="btn btn-secondary btn-sm"> remove</button>`;
        }
        if(contacts[i].adminid!==contacts[i].memberid && contacts[i].memberid==currentuserid && !adminstatus){
            contact='You'
        }

        if(contacts[i].adminid!==contacts[i].memberid && contacts[i].memberid!=currentuserid && !adminstatus){
            contact=`${contacts[i].usersignup.name}`
        }

        if(contacts[i].adminid!==contacts[i].memberid && contacts[i].memberid!=currentuserid && adminstatus){
            contact=`${contacts[i].usersignup.name} <button type="submit" id=${contacts[i].memberid}, onclick="checkAdmin('${localStorage.getItem('chatgroupid')}', '${contacts[i].memberid}', 0)", class="btn btn-primary btn-sm"> make admin</button>
            <button type="submit" id=${contacts[i].memberid} onclick="removeuser('${localStorage.getItem('chatgroupid')}', '${contacts[i].memberid}')", class="btn btn-secondary btn-sm"> remove</button>`;
        }

        if(contacts[i].adminid==contacts[i].memberid && contacts[i].memberid!=currentuserid && !adminstatus){
            contact=`${contacts[i].usersignup.name} <b>admin</b>`
        }
    
    
        li.innerHTML=contact;
        console.log('li=',li);
        ul.appendChild(li);
    }
if(adminstatus){
    const btn=document.createElement("button");
    btn.classList="btn btn-dark btn-sm"
    btn.value='Add Particpient'
    btn.style.marginBottom = '10px';
    btn.id="myModal2";
    btn.onclick=function(){
       loadContactsfiltered(localStorage.getItem("chatgroupid"));
    }
    btn.textContent='add participient';
    ul.appendChild(btn);
    const para=document.createElement("p")
    para.id="loadfilteredcontacts";
    ul.appendChild(para);
}

}

async function checkAdmin(chatgroupid,userid,isadmin){
    const message=chatgroupid+' '+userid+' '+isadmin;
    alert(message);
    const info={
        chatgroupid,
        userid,
        isadmin
    }
    try{
    const response=await axios.post('/adminaction',info);
    console.log('response:',response.data.message);
    if(response.data.status==1){
        $('#myModalgroupinfo').modal('hide');
        alert("admin created successfully");
    }
    if(response.data.status==2){
        $('#myModalgroupinfo').modal('hide');
        alert("admin removed successfully");
    }
    }
    catch(error){
        console.log('error:',error.response.data.message);
        if(error.response.data.message=='unauthorised'){
        alert('Group creator cannot remove from admin right.')
        }
    }
}

/* document.getElementById('updateGroupSubmitBtn').addEventListener('click',async function(){
alert(document.getElementById('newgroupname').value);
const data={
    groupname:document.getElementById('newgroupname').value,
    groupid:localStorage.getItem('chatgroupid'),
    token:localStorage.getItem('token')
}
console.log('data:',data);
try{
const response=await axios.post('/updategroupname',data)
console.log('response:',response);
alert("group name updated successfully.")
$('#myModalgroupinfo').modal('hide');
}
catch(error){
    console.log('error:',error);
    alert("something went wrong. please try again later");
    $('#myModalgroupinfo').modal('hide');
}
}) */


async function loadContactsfiltered(chatgroupid){
    console.log('hello world');

    const response=await axios.get(`/loadcontactsexcluded?groupid=${chatgroupid}`,{headers:{'Authorization':localStorage.getItem("token")}});

    console.log('contacts:',response.data.message);
    const contacts=response.data.message;
    const parent=document.getElementById('loadfilteredcontacts');
    parent.innerHTML='';
   const h4=document.createElement("h5")
   h4.textContent="Select Contacts";
    parent.appendChild(h4)
    for(let i=0;i<contacts.length;i++){
        const input=document.createElement("input");
            input.type="checkbox";
        input.id="flexCheckDefault2";
        input.name=contacts[i].id;
        input.value=contacts[i].name;
        input.class="form-check-input"
        const label=document.createElement("label");
        label.for="flexCheckDefault";
        let contact=contacts[i].name+' '+contacts[i].phone;
        label.textContent=contact;
        label.class="form-check-input"
        const br=document.createElement("br");
        parent.appendChild(input);
        parent.appendChild(label);
        parent.appendChild(br);
    }

}

document.getElementById('updateGroupSubmitBtn').addEventListener('click',async function(){

    alert(document.getElementById('newgroupname').value);

        const checkboxes = document.querySelectorAll('#loadfilteredcontacts input[type="checkbox"]:checked');
    
        // Extract and log the names of the selected checkboxes
        const selectedNames = Array.from(checkboxes).map(checkbox => {
            const label = checkbox.getAttribute('name'); // Get the <label> element next to the checkbox
            return label; // Extract and trim the text content
        });
    
        const groupinfo={
            groupname:document.getElementById('newgroupname').value||localStorage.getItem("groupname")||'undefined',
            groupid:localStorage.getItem('chatgroupid'),
            token:localStorage.getItem('token'),
            member:selectedNames,
        }
        console.log('groupinfo:', groupinfo);
       
    
        const response=await axios.post('/updategroupmemberdetails',groupinfo,{headers:{'Authorization':localStorage.getItem("token")}})
    
        if(response.data.STATUS===1){
            $('#myModal').modal('hide');
            $('#myModalgroupinfo').modal('hide');
            alert('member added Successdully')
        }
        else{
            $('#myModalgroupinfo').modal('hide');
            alert('Something went wrong!!!')
        }

})


async function removeuser(groupid,userid){
    console.log(groupid,' ',userid);
    const info={
        groupid:groupid,
        memberid:userid,
        actionbyid:localStorage.getItem("token")
    }
console.log('info:',info);
    const response=await axios.post('/removeuser',info);
    console.log('respose:',response);

    if(response.status=200){
        alert("user removed successfully");
        $('#myModalgroupinfo').modal('hide');
    }
}