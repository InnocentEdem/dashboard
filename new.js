
 const contentTag = document.querySelector(".main");
 const infoWithOption=document.getElementById('alert-with-input');
 const btn = document.querySelector("#add-button");
 const categoryInfo=document.querySelector(".category-info")

 function newEntryHandler(response,token){

        if(response===undefined || token===undefined){
        let status="1";
        addNew = document.querySelectorAll(".add-new");
        console.log(addNew.length); 
        checkValues()
        function checkValues(){
            for(let i=0; i<addNew.length;i++){
                if (addNew[i].value===""){
                addNew[i].style.border="solid 1px red";
                addNew[i].placeholder="Enter Valid Values"
                status="not okay"
                console.log(status)
                return
                console.log(status)
                }else{status="1";}
                if( addNew[i].value==="--Please choose an option--"){
                categoryInfo.innerText='Please choose a category';
                status='not okay'
                console.log(status)
                return
                }else {status="1";}
            }
             if(document.getElementById('description').value===""||
             document.getElementById('description').value==="Please enter a Description!!!"){
                 console.log(document.getElementById('description').innerText)
                document.getElementById('description').value="Please enter a Description!!!" 
                document.getElementById('description').style.border="solid 1px red"
                status="not okay"
                console.log(status)
                return
            }else {status="1"}
        }
        console.log(status)
        if (status==="1"){
        var code = securityToken();
        console.log(code)
        alertHandler(true,"Confirm New Changes?","newEntryHandler",code)
        console.log("alert handler called")

        }
    } else{
        if (response==="okay"){
            saveValues()
            
        }
        else {
            alertHandler(false,"Changes not saved")
            return
        }
        }

    function saveValues(){
     allProductsPlus=JSON.parse(localStorage.getItem("allProductsPlus"));
     console.log(allProductsPlus)
     let newIndex= +allProductsPlus.length + 1
     newObj={
         "id":newIndex,
          "title":addNew[0].value,
          quantity:addNew[1].valueAsNumber,
          price:addNew[2].valueAsNumber,
        category:addNew[3].value,
        "description":document.getElementById('description').value,
         }
         allProductsPlus.push(newObj);
         localStorage.setItem("allProductsPlus",JSON.stringify(allProductsPlus))
         location.reload()
         alertHandler(false,"New Changes Saved Successfully")
    }
}
btn.addEventListener('click',newEntryHandler)

function alertHandler(reqres,message,from,token){ //reqres is boolean, message is string, true means response required
    

    if (typeof(reqres) !== "boolean" || message===""){ //reqres is only true when response is required.
             console.log('alerthandler error! request-response not clear, or message is empty!')
         }
    else{
        if(reqres===true){      
           return callAlert(1,message,token);
        }
        else{
            callAlert(0,message);
        }
    }

    function callAlert(type,message,token){  //typeof(type) = number, 0 for show-info, 1 for alert with input
     
        let justAlert = `<div id="show-info">
                            <p id="info-p">${message}</p>
                            <button id="okay-and-nothing">Okay</button>
                        </div>`
        let notJustAlert=`<div id="alert-with-input">
                            <p id="info-input-p">${message}</p>
                            <button id="cancel" name="cancel" class="do-this">Cancel</button>
                            <button id="okay" name = "okay"class="do-this">Okay</button>
                          </div>`        
        if (type === 0 ){                                          //
            document.querySelector('.back-drop').style.display="block";//className = ('back-drop visibility');
            console.log(document.querySelector('.back-drop').className)
            contentTag.insertAdjacentHTML('afterbegin',justAlert)
            document.getElementById("okay-and-nothing").addEventListener('click',(e)=>{
                document.getElementById('show-info').remove();
                document.querySelector('.back-drop').style.display="none"//className = ('back-drop');
            });
        } 
        else{
            var code = token;
            var sender = from;
            document.querySelector('.back-drop').className = ('back-drop visibility');
           
            contentTag.insertAdjacentHTML('afterbegin',notJustAlert);
            document.querySelectorAll('.do-this').forEach(element => { 
                element.addEventListener('click', (e)=>{
                    var result = e.target.getAttribute('name');
                    console.log(code)
                    window[sender](result,token);
                    console.log(sender)
                   document.getElementById('alert-with-input').remove();
                   document.querySelector('.back-drop').className = ('back-drop')
                   
                })
                
            })
                    
        }  
    }     

}

function securityToken(){   //generate 5 digit code for secure local storage lear and delete operations

    let CodeSaverArray = [];
    let hexRef = [1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','0'];
    for(let i = 0; i < 5; i++){
        let thisIndex = Math.floor((Math.random() * 15) + 1);
        CodeSaverArray.push(hexRef[thisIndex]);
    }
    return CodeSaverArray.join("");
}