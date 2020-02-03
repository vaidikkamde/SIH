const map=document.querySelector('#map')
    const iaddress=document.querySelector('#crimeAddress')
    const check=document.querySelector('#check')
    const geo=document.querySelector('#geo')

    iaddress.value='loading...'
    map.addEventListener('click',(e)=>{
        e.preventDefault()
        fetch('/getlocation?geo='+geo.textContent).then((response)=>{
            response.json().then((data)=>{
                if (data.error)
                {
                    iaddress.value=data.error
                }
                else{
                    iaddress.value=data.address
                }
            })  
        })  

    })