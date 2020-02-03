const iemail=document.querySelector('#email')
const sendotp=document.querySelector('#sendotp')
const verifybutton=document.querySelector('#verify')
const iotp=document.querySelector('#otp')
const verifybtn=document.getElementById('verify')
const reportbtn=document.getElementById('reportbtn')
const success=document.getElementById('success')

verifybtn.style.visibility="hidden";
reportbtn.style.visibility="hidden";
z=1;

sendotp.addEventListener('click',(e)=>{
    
    if(z===3){
        sendotp.style.visibility="hidden";
    }
    z=z+1
    e.preventDefault()
    success.textContent='OTP Sent To '+iemail.value;
    reportbtn.style.visibility="hidden";
    verifybtn.style.visibility="visible";
    sendotp.textContent='Resend OTP'
    const email=iemail.value
    fetch('/sendotp?email='+email).then((response)=>{
        response.json().then((datax)=>{
            if (datax.error)
            {
                console.log(datax.error)
              
            }
            verifybutton.addEventListener('click',(e)=>{
                e.preventDefault()
                const otp=iotp.value
                var key = datax.key.toString();
                if (key===otp){
                    console.log("OTP Matched")
                    reportbtn.style.visibility="visible";
                    var votp='true'
                    success.textContent='OTP Matched'
                    success.style.color='green'
                }
                else{
                    var votp='false'
                    success.textContent='OTP Not Matched'
                    success.style.color='Red'
                }
                fetch('/verify?otp='+votp).then((response)=>{
                    response.json().then((data)=>{
                        if (data.error)
                {
                    console.log(data.error)
              
                }
                    })  
                })  
                
                
                
            })
        })  
    })  
    
    
})




