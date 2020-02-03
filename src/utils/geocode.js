const request=require('request')

const geocode=(geo,callback)=>{
    const url="https://api.mapbox.com/geocoding/v5/mapbox.places/"+geo+"6.json?access_token=pk.eyJ1IjoiaGFyam90c2NzIiwiYSI6ImNrNHZpYjUzazBqYmgzbnNjMzlwOW1ibnYifQ.T4Nh2LhQ9733LUy7JMh1Vw"
    request({url,json:true},(error,{body})=>{
        if(error){
            callback('unable to Connect to location Services',undefined)
        }
        else if(body.features.length===0){
            callback('Unable To Find Location',undefined)
        }
        else{
            callback(undefined,{
                address:body.features[0].place_name
            })
        }
    })
}

module.exports=geocode