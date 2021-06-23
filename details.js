
let forDetailsPage = JSON.parse(localStorage.getItem("forDetailsPage"))
let allProductsPlus = JSON.parse(localStorage.getItem("allProductsPlus"))
console.log(allProductsPlus[+forDetailsPage].image)
function loadDetails(forDetailsPage){
    console.log(forDetailsPage)
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
    if ((i + 1) % 6 === 0) {
      outStr += "\n";
    }
  }
    details[4].innerHTML=outStr;

}
loadDetails(forDetailsPage)