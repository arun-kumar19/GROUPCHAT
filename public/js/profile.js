const socket = io();
const token=localStorage.getItem("token");
console.log('taken:',token);
document.getElementById("sendMessage").addEventListener("click",saveMessage);

async function saveMessage(){
    const chatgroupid=localStorage.getItem("chatgroupid");

    const message=document.getElementById("message").value;
    const fileInput=document.getElementById("fileInput");
    const file = fileInput.files[0];

console.log('message:',typeof message,' len is:',message.length, 'fileinput :',file,'  condition:',(message.length>0 || typeof file!='undefined'));

    if(message.length>0 || typeof file!='undefined'){
console.log('hello world');
        const formData =new FormData();
        formData.append("token",token)
          formData.append("message",(message.length<=0)?'null':message);
            formData.append("chatgroupid",chatgroupid);
            formData.append("file",(file==='undefined')?'null':file);
            try{
        const response=await axios.post('/savemessage',formData,{headers:{Authorization:localStorage.getItem("token"),
        'Content-Type': 'multipart/form-data'},});
        console.log('response on save message:',response);
        
        
        if(response.status===200){
        
            const data={
                ContentURL:response.data.result.ContentURL,
                MessageType:response.data.result.MessageType,
                message:response.data.result.message,
                chatgroupid:response.data.result.groupid
            }
            localStorage.setItem("lastmessageinfo",JSON.stringify(data));
            document.getElementById('message').value=""
            const newFileInput = document.createElement('input');
            newFileInput.type = 'file';
            newFileInput.id= 'fileInput';
            
            // Replace the old file input with the new one
            fileInput.parentNode.replaceChild(newFileInput, fileInput);
            sendDataToServer()
        }
        else{
            alert("semething went wrong. try again later");
        }
    }catch(error){
        console.log('something went wrong during upload:',error);
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

}

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
    console.log('groupid:',groupid);
    tbody.setAttribute('data-groupid', groupid);
   // console.log('tbody first:',tbody);
    table.appendChild(tbody)
   
    if(datalength>0){
        const tr=document.createElement("tr");
        const td=document.createElement("td");
        td.textContent="You Joined";
        //td.classList="text-center"
        //td.id="center"
        tr.appendChild(td);
        tbody.appendChild(tr);

        for(let i=datalength-1;i>=start;i--){
                console.log('data:',data[i])
            const tr=document.createElement("tr");
            const td=document.createElement("td");

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
      


    if(data[i].MessageType=="text"){
        td.textContent = 'You: ' + data[i].message;
        td.innerHTML += "<br><span style='font-size: 0.6em;'>" + formattedTime + "</span>";
    }

    else if(data[i].MessageType.includes('image') || data[i].MessageType.includes('png') || data[i].MessageType.includes('jpg')){
        
    td.innerHTML='You'+'<br>'+'<img src="' + data[i].ContentURL + '" alt="Image" height="200" width="200">';

    if(data[i].message!="null"){
        console.log('not null');
    td.innerHTML += "<br>"+data[i].message+"<br><span style='font-size: 0.6em;'>" + formattedTime + "</span>";
    }
    else{
        console.log('null');
        td.innerHTML += "<br><span style='font-size: 0.6em;'>" + formattedTime + "</span>";
    }

    }

    else if(data[i].MessageType.includes('video') || data[i].MessageType.includes('mp4') || data[i].MessageType.includes('webm') || data[i].MessageType.includes('mov')){
        
        td.innerHTML='You'+'<br>'+'<video width="200" controls>'+'<source src="' + data[i].ContentURL + '" type="video/mp4"> Your browser does not support HTML video.</video>';

        if(data[i].message!="null"){
            console.log('not null');
        td.innerHTML += "<br>"+data[i].message+"<br><span style='font-size: 0.6em;'>" + formattedTime + "</span>";
        }
        else{
            console.log('null');
            td.innerHTML += "<br><span style='font-size: 0.6em;'>" + formattedTime + "</span>";
        }

        }

 }
    else{

        if(data[i].MessageType=="text"){
            td.textContent = `${data[i].name}: ` + data[i].message;
            td.innerHTML += "<br><span style='font-size: 0.6em;'>" + formattedTime + "</span>";
        }

        else if(data[i].MessageType.includes('image') || data[i].MessageType.includes('png') || data[i].MessageType.includes('jpg')){
        
            td.innerHTML=`${data[i].name}: `+'<br>'+'<img src="' + data[i].ContentURL + '" alt="Image" height="200" width="200">';

            if(data[i].message!=="null"){
                console.log('not null');
            td.innerHTML += "<br>"+data[i].message+"<br><span style='font-size: 0.6em;'>" + formattedTime + "</span>";
            }
            else{
                console.log('null');
                td.innerHTML += "<br><span style='font-size: 0.6em;'>" + formattedTime + "</span>";
            }
        }

        else if(data[i].MessageType.includes('video') || data[i].MessageType.includes('mp4') || data[i].MessageType.includes('webm') || data[i].MessageType.includes('mov')){
        
            td.innerHTML=`${data[i].name}: `+'<br>'+'<video width="200" controls>'+'<source src="' + data[i].ContentURL + '" type="video/mp4"> Your browser does not support HTML video.</video>';
            if(data[i].message!=="null"){
                console.log('not null');
            td.innerHTML += "<br>"+data[i].message+"<br><span style='font-size: 0.6em;'>" + formattedTime + "</span>";
            }
            else{
                console.log('null');
                td.innerHTML += "<br><span style='font-size: 0.6em;'>" + formattedTime + "</span>";
            }
        }
            
    }


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
    //console.log('hello world');

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


    var input = document.getElementById('message').value;
    console.log('input value:',input);
  
function sendDataToServer(){
      const storedDataString =localStorage.getItem("lastmessageinfo");
      const storedData=JSON.parse(storedDataString);
      //console.log('message1233:',storedData.ContentURL);
        const data={
            messengersendortoken:localStorage.getItem("token"),
            messengersendorname:localStorage.getItem("name"),
            message:storedData.message,
            ContentURL:storedData.ContentURL,
            MessageType:storedData.MessageType,
            chatgroupid:storedData.chatgroupid,
        }
      console.log('sending to server:',data);
        socket.emit('chat message', data);
      
    };
  

socket.on('chat message', async function(msg) {
    console.log('message from server:',msg);
    const messageType=msg.MessageType;
    
const tbody=document.querySelector(`tbody[data-groupid="${msg.chatgroupid}"]`);
console.log('tbody111:',tbody);
  const tr=document.createElement("tr");
  const td=document.createElement("td");
  
  try{
  const response=await axios.get('/getstatus',{
    headers: {
    'messengersendortoken': msg.messengersendortoken,
    'currentusertoken': localStorage.getItem("token")
  }
  })
console.log('response data:',response);
console.log('response.data.STATUS===1:',response.data.STATUS,' result:',response.data.STATUS===1)
// Get the current date

const currentDate = new Date();

const nextDate = new Date(currentDate);
nextDate.setDate(currentDate.getDate());

// Format the next date as a string (YYYY-MM-DD)
  const today = nextDate.toISOString().slice(0, 10);
 
  function addLeadingZero(number) {
  return number < 10 ? "0" + number : number;
}
// Get the current time in "HH:mm:ss" format
const timeNow = addLeadingZero(new Date().getHours()) + ":" +
                addLeadingZero(new Date().getMinutes()) + ":" +
                addLeadingZero(new Date().getSeconds());

// Concatenate the date and time
const dbTimeString = today + " " + timeNow;

    const dbTime = new Date(dbTimeString);
   // console.log('dbTime:',dbTime);
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

if(response.data.STATUS===1){
    td.classList='text-right'
    console.log('one');
    if(msg.MessageType.includes('text')){
        td.textContent = 'You: ' + msg.message;
        td.innerHTML +="<br><span style='font-size: 0.6em;'>" + formattedTime + "</span>";
    }
    else if(msg.MessageType.includes('image') || msg.MessageType.includes('png') || msg.MessageType.includes('jpg')){
    td.innerHTML='You '+'<br>'+'<img src="' + msg.ContentURL + '" alt="Image" height="200" width="200">';

    if(msg.message!=="null"){
        console.log('not null');
    td.innerHTML += "<br>"+msg.message+"<br><span style='font-size: 0.6em;'>" + formattedTime + "</span>";
    }
    else{
        console.log('null');
        td.innerHTML += "<br><span style='font-size: 0.6em;'>" + formattedTime + "</span>";
    }

    }

    else if(msg.MessageType.includes('video') || msg.MessageType.includes('mp4') || msg.MessageType.includes('webm') || data[i].MessageType.includes('mov')){
        
        td.innerHTML=`You `+'<br>'+'<video width="200" controls>'+'<source src="' + msg.ContentURL + '" type="video/mp4"> Your browser does not support HTML video.</video>';

        if(msg.message!=="null"){
            console.log('not null');
        td.innerHTML += "<br>"+msg.message+"<br><span style='font-size: 0.6em;'>" + formattedTime + "</span>";
        }
        else{
            console.log('null');
            td.innerHTML += "<br><span style='font-size: 0.6em;'>" + formattedTime + "</span>";
        }

        }

    
} 
 
if(response.data.STATUS===0){
    console.log('zero');
    td.classList='text-left'
console.log('msg.messengersendorname0:',msg.messengersendorname);
    if(messageType.includes('text')){
        td.textContent = `${msg.messengersendorname}: ` + msg.message;
        td.innerHTML +="<br><span style='font-size: 0.6em;'>" + formattedTime + "</span>";
    }

    else if(msg.MessageType.includes('image') || msg.MessageType.includes('png') || msg.MessageType.includes('jpg')){
        td.innerHTML=`${msg.messengersendorname}: `+'<br>'+'<img src="' + msg.ContentURL + '" alt="Image" height="200" width="200">';

        if(msg.message!=="null"){
            console.log('not null');
        td.innerHTML += "<br>"+msg.message+"<br><span style='font-size: 0.6em;'>" + formattedTime + "</span>";
        }
        else{
            console.log('null');
            td.innerHTML += "<br><span style='font-size: 0.6em;'>" + formattedTime + "</span>";
        }
    }    
    else if(msg.MessageType.includes('video') || msg.MessageType.includes('mp4') || msg.MessageType.includes('webm') || messageType.includes('mov')){
        
            td.innerHTML=`${msg.messengersendorname}: `+'<br>'+'<video width="200" controls>'+'<source src="' + msg.ContentURL + '" type="video/mp4"> Your browser does not support HTML video.</video>';

            if(msg.message!=="null"){
                console.log('not null');
            td.innerHTML += "<br>"+msg.message+"<br><span style='font-size: 0.6em;'>" + formattedTime + "</span>";
            }
            else{
                console.log('null');
                td.innerHTML += "<br><span style='font-size: 0.6em;'>" + formattedTime + "</span>";
            }

        }
    

    }
        
  }
  catch(error){
    console.log('error during getting status:',error);
  }

            tr.appendChild(td);
            tbody.appendChild(tr);
console.log('tr:',tr);
console.log('td:',td);
  });
