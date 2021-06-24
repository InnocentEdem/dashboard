msgContainer=document.querySelector('.the-body')

    if(JSON.parse(localStorage.getItem('events'))){
        
     let events=JSON.parse(localStorage.getItem('events'))
     console.log(events)
      for(let i=0;i<events.length;i++){
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
      
   