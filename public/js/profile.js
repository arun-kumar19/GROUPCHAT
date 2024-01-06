const getNameFromLocalStorage=localStorage.getItem("name");
console.log('name:',getNameFromLocalStorage);
document.getElementById("name").innerText=getNameFromLocalStorage.replace(/\b[a-z]/g, (x) => x.toUpperCase())