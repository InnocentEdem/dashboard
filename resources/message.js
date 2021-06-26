msgContainer=document.querySelector('.the-body')

    if(JSON.parse(localStorage.getItem('events'))){
        
     let events=JSON.parse(localStorage.getItem('events'))
     console.log(events)
      for(let i=1;i<events.length;i++){
          console.log(events[i])
          var timestamp = events[i]['timeStamp']
          var date = new Date(timestamp);
          let row = document.createElement('tr')
        let rowElement=`
        <td>${date}<td></td>${events[i].msg}</td>
       `
       row.innerHTML=rowElement
       msgContainer.insertAdjacentElement('afterbegin',row)
      }
   }
   function resetAlert(){
        document.querySelector('.bell-back').innerHTML='0'
        let alertCount=0
        localStorage.setItem('alertCounter',JSON.stringify(alertCount)) 
    
}
      resetAlert()
      
      $(document).ready(function(){
        $('.res-open').click(function(){
            $('.side-menu').hide("slow");
            $('.side-responsive').show("slow");
        })
        $('.res-close').click(function(){
            $('.side-menu').show("slow");
            $('.side-responsive').hide("slow");
        })
    })
   