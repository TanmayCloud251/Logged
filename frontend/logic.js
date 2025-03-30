document.querySelector('button').addEventListener('click', async()=>{
    
    const name = document.querySelector("#name").value;
    const age = document.querySelector("#age").value;
    const email = document.querySelector("#email").value;

    if(!(email && age && name)){
        alert("All fields are compulsory")
        return;
    }
 
    try{
        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name, age, email})
        });

        const result = await response.text();
        alert(result)
    }catch(err){
        console.error(err)
        alert("Failed to connect to server")
    }
})