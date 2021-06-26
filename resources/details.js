
let forDetailsPage = JSON.parse(localStorage.getItem("forDetailsPage"))
let allProductsPlus = JSON.parse(localStorage.getItem("allProductsPlus"))

function loadDetails(forDetailsPage){
    
    const details = document.querySelectorAll('.des-content')
    document.querySelector('.de-image').src=allProductsPlus[+forDetailsPage].image
    details[0].innerHTML=allProductsPlus[+forDetailsPage]['title']
    details[1].innerHTML=allProductsPlus[+forDetailsPage]['category']
    details[2].innerHTML=allProductsPlus[+forDetailsPage]['quantity']
    details[3].innerHTML=allProductsPlus[+forDetailsPage]['price']
    var str = allProductsPlus[+forDetailsPage]['description']
    var parts = str.split(' ')
    var outStr = '';
    for (var i = 0; i < parts.length; i++) {
    outStr += ' ' + parts[i];
    
    //every tenth word, add a new-line. Change this to '<br/>' if you want html.
    if ((i + 1) % 7 === 0) {
      outStr += "<br/>";
    }
  }
    details[4].innerHTML=outStr;

}
loadDetails(forDetailsPage)

function displayAlert(count){
  let counter;
  if (count !==1){counter=0;}

if(!JSON.parse(localStorage.getItem('alertCounter'))){

document.querySelector('.bell-back').innerHTML=counter;
localStorage.setItem('alertCounter',JSON.stringify(counter))
}else{
   alertCount= +JSON.parse(localStorage.getItem('alertCounter'))+counter;
   document.querySelector('.bell-back').innerHTML=alertCount;
   localStorage.setItem('alertCounter',JSON.stringify(alertCount))
}

}
displayAlert()
