
const contentTag = document.querySelector(".main");
const infoWithOption=document.getElementById('alert-with-input');
var code;
var NameIt;
infoArray=[]




//download and save json data
 function fetchData(){

    var allProductsPlus;
    var allCategories;

    fetch('https://fakestoreapi.com/products/categories')
            .then(res=>res.json())
            .then(json=>saveCategory(json))
     
    fetch('https://fakestoreapi.com/products')
    .then(res=>res.json())
    .then(json=>addNewField(json))

    function saveCategory(input){
      allCategories=input; 
      lstorageReadWrite(false,"allCategories",allCategories)
       
    }
   
    function addNewField(input){  //add a new field called quantity, required for project
       let allProducts=input
      for(let i=0;i<allProducts.length;i++){
        let quantity = Math.floor(Math.random() * 41); //generate random number for quantity  
        allProducts[i].quantity=quantity;
      }
      allProductsPlus=allProducts;
      lstorageReadWrite(false,"allProductsPlus",allProductsPlus)
      location.reload();
      

   }
 }

//conditional data fetch from API!!!
 if(!lstorageReadWrite(true,"allProductsPlus")){  //Make sure API loads only once
     logger("APi fetch successful")
     fetchData();
 }
 function logger(msg){
   
    anEvent={}
    var timeStamp = Number(new Date());
    anEvent['timeStamp']= timeStamp;
    anEvent["msg"]=msg;
    
    if(!localStorage.getItem("events")){
        infoArray.push(anEvent);
        localStorage.setItem("events",(JSON.stringify(infoArray)));
    }
    else{
    let events=JSON.parse(localStorage.getItem("events"));
    events.push(anEvent);
    localStorage.setItem("events",(JSON.stringify(events)));
    }
     
}

//read/write handler below!!!
function lstorageReadWrite(readOrWrite,name,content,token){   // readOrWrite is boolean, true=read, false=write ,delete and clear means same
    
    if(readOrWrite===true){ //means read
        if(localStorage.getItem(name)){
         let jsonString=localStorage.getItem(name);       //  Only objects saved and retrieved
         return JSON.parse(jsonString);
        }
        else{
         console.log('No such object found')
         return 0;
        }
    }
    else if(readOrWrite===false){  //means write
        localStorage.setItem(name,JSON.stringify(content))
    }
    else if(readOrWrite==="delete"){
             //use keyword "delete" 
            if(alertHandler(true, "confirm delete")==="okay"){
                localStorage.removeItem(content) 
            }        
    }
    else if(readOrWrite==="clear"){     //use keyword "clear" NB: Dangerous operation
        
        
        console.log(code)
        console.log(token)
        if (token===undefined){
            code = securityToken();
            console.log(code)
            alertHandler(true, "Wipe localstorage?  Warning: Irreversible! ","lstorageReadWrite",code)   
        }else if(token=== code&&content==="okay")
        {   console.log("called")
            localStorage.clear();
            alertHandler(false,"wipe successful")
        }
        else{console.log('not excuted')}
                 
    }
    else if(typeof readOrWrite !== "boolean" && readOrWrite !=="clear" && readOrWrite !=="delete"){
        console.log('self debug,read/write instruction not clear, program terminated');
        return;
    }
   
}


function statisticsHandler(indicator,dataSet){ //choose the dataset for the calculation
    var workingSet;                     
    if (dataSet==="allProducts"){
        workingSet=lstorageReadWrite(true,'allProductsPlus');
    }else {workingSet=dataSet; }

    if (indicator==="totalStockValue"){
        var totalStockValue=0;
        for(let i=0;i<workingSet.length;i++){
        totalStockValue=totalStockValue+(+workingSet[i].quantity * (+workingSet[i].price))
        }
        return Math.floor(totalStockValue)
    }
    if(indicator==="quantityByCategory"){
        var clothing_men=0;  var jewelery=0; var electronics=0; var clothing_women=0;
        for(let i=0;i<workingSet.length;i++){
            if(workingSet[i].category==="men's clothing"){
                clothing_men=clothing_men + 1
            }else if(workingSet[i].category==="women's clothing"){
                clothing_women = clothing_women + 1
            }else if(workingSet[i].category==="electronics"){
                electronics=electronics + 1
            }else{
                jewelery = jewelery + 1
            }
        }
       
        return {"clothing_men":clothing_men,
                "clothing_women":clothing_women,
                "jewelery":jewelery,
                "electronics": electronics,}
        
    }

    if(indicator==='stockValueByCategory'){
        var clothing_men=0;  var jewelery=0; var electronics=0; var clothing_women=0;
        for(let i=0;i<workingSet.length;i++){
            if(workingSet[i].category==="men's clothing"){
                clothing_men = clothing_men + (+workingSet[i].quantity * (+workingSet[i].price))
            }else if(workingSet[i].category==="women's clothing"){
                clothing_women = clothing_women + (+workingSet[i].quantity * (+workingSet[i].price))
            }else if(workingSet[i].category==="electronics"){
                electronics=electronics + (+workingSet[i].quantity * (+workingSet[i].price))
            }else{
                jewelery = jewelery + (+workingSet[i].quantity * (+workingSet[i].price))
            }
        }
       
        return {"clothing_men":clothing_men,
                "clothing_women":clothing_women,
                "jewelery":jewelery,
                "electronics": electronics,}    
    }
    if(indicator==="totalItems"){
       return workingSet.length
    }

    if(indicator==="depletedStocks"){
        var depletedStocksArray=[];
        console.log(workingSet)
        for(let i=0;i<workingSet.length;i++){
            if(+workingSet[i].quantity<1){
                
                depletedStocksArray.push(workingSet[i].title)
            }
            }
            console.log(depletedStocksArray)
        if(depletedStocksArray.length>0){
            return depletedStocksArray;
        }else{
            depletedStocksArray=[];
            depletedStocksArray.push("All stocks High")
            return depletedStocksArray;
        }
        

    }
}

function sideBarSummary(){
    sideBarTotal=document.querySelector('.total-value');
    sideBarDepleted=document.querySelector('.depleted')
    sideBarCategories=document.querySelector('.sum-categories')
    sideBarTotal.innerHTML=`Total Stock Value: $ ${statisticsHandler("totalStockValue","allProducts")}`
    depletedResponse=statisticsHandler("depletedStocks","allProducts")
    console.log(depletedResponse)
    depletedResponse.forEach((item,index)=>{
        let div=document.createElement('li');
        div.innerHTML=item.substring(0,18);
        sideBarDepleted.appendChild(div)

    })
}
sideBarSummary();

function topStatsHandler(){
    let totalStockValue = statisticsHandler('totalStockValue',"allProducts")
    let totalCategories = 4;
    let totalItems = statisticsHandler('totalItems','allProducts')
    let position = document.querySelectorAll('.main-res')
    console.log(position)
    position[0].innerHTML=totalCategories;
    position[1].innerHTML=totalItems;
    position[2].innerHTML=totalStockValue

}
topStatsHandler();

function colorLabel(qty,i){

    if(+qty===0){
        return `.item${i}`+" label-red"
    }
    else if(+qty>=1 && +qty<21){
        return `.item${i}`+" label-gold"
    }
    else{
        return `.item${i}`+" label-green"
    }

}



function tableFillHandler(){     //fills the table with data from localstorage
     let allProductsPlus = lstorageReadWrite(true,"allProductsPlus");
     
     for(let i=0;i<allProductsPlus.length;i++){
        htmlGenerator(i);
        let rowList=document.querySelectorAll(`.item${i}`)
        rowList[1].innerHTML=i+1;
        rowList[2].innerHTML=allProductsPlus[i].category.substring(0,25);
        rowList[3].innerHTML=allProductsPlus[i].title.substring(0,30);
        rowList[4].innerHTML=allProductsPlus[i].description.substring(0,60);
        rowList[5].innerHTML=allProductsPlus[i].price;
        rowList[6].innerHTML=allProductsPlus[i].quantity;
        rowList[7].className= colorLabel(allProductsPlus[i].quantity,i)
        console.log(allProductsPlus[i].quantity)
        
     }
}
tableFillHandler()


function htmlGenerator(i){  //used to generate new rows

    newRow = document.createElement("tr");
    newRow.className = ' row-'+ i;
    document.querySelector('.row-template').appendChild(newRow);

    createRowContent = `<td class="rows"><input type="checkbox" class="check item${i}"></td>
                        <td class="rows"><div class="label-code item${i}"></div></td>
                        <td class="rows"><div class="category item${i}"></div></td>
                        <td class="rows"><div class="name item${i}"></div></td>
                        <td class="rows"><div class="description item${i}"></div></td>
                        <td class="rows"><div class="label-code item${i}">price</div></td>
                        <td class="rows"><div class="quantity item${i}"></div></td>
                        <td class="rows"><div class=" item${i}"><div class="label"></div></div></td> 
                        <td><div><button class="edit" id="edit${i}">Edit</button></div></td>`
document.querySelector(`.row-${i}`).innerHTML = createRowContent;

}

//Interactive popup message handler for entire web page below!!!!
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
                    window[sender]("clear",undefined,result,token);
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

function buildSearchArray(){

    let allProducts = lstorageReadWrite(true,"allProductsPlus")
    var namesArray=[];
    var categoriesArray=[];
    for(let i=0; i< allProducts.length; i++){
        namesArray[i]=allProducts[i].title;
        categoriesArray[i] = allProducts[i].category;
    }
}

function search(){
    
}

const quickEditButtons=document.querySelectorAll(".edit")
quickEditButtons.forEach(element => {
    element.addEventListener('click',(e)=>{
        thisEvent=e.target.getAttribute("id").match(/\d+/g,'')
        quickEditHandler(thisEvent)
        console.log(thisEvent)
    })
});

function quickEditHandler(eventString){
    localStorage.setItem("forEditPage",JSON.stringify(eventString))
    location.assign("./resources/edit.html")
}



const rows = document.querySelectorAll(".rows");  // Event handler for details page 
rows.forEach(element => {
    element.addEventListener('click',(e)=>{
        let thisEvent=e.target.getAttribute("class").match(/\d+/g,'')
        itemEventsHandler(thisEvent)
        console.log(e)
    })
});
function itemEventsHandler(eventString){
  localStorage.setItem("forDetailsPage",JSON.stringify(eventString))
  location.assign("./details.html")
}




// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {
    categoryObj = statisticsHandler('quantityByCategory','allProducts')
    console.log(categoryObj)
  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Categories');
  data.addColumn('number', 'Quantity');
  data.addRows([
    ['Clothing-Men', categoryObj.clothing_men],
    ['Clothing-Women',categoryObj.clothing_women],
    ['Jewelery', categoryObj.jewelery],
    ['Electronics', categoryObj.electronics],
   
  ]);

  // Set chart options
  var options = {'title':'Quantities by Category',
                 'width':550,
                 'height':180};

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(document.getElementById('chart-div'));
  chart.draw(data, options);
}

let resOpen = document.querySelector('.res-open')
let resClose = document.querySelector('.res-close')

resOpen.addEventListener("click",(e)=>{
    document.querySelector('.side-responsive').style.display="block"
    document.querySelector('.side-menu').style.display="none"
})

resClose.addEventListener('click',(e)=>{ 
        document.querySelector('.side-responsive').style.display='none'
        document.querySelector('.side-menu').style.display='block'
})


