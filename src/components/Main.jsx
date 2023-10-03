import React, { useEffect, useRef, useState } from "react";
import Day from "./Day";
import Temp from "./Temp";
import Location from "./Location";

// section for desktiop view
import Date from "./desktop/Date";
import Hourly from "./desktop/Hourly";
import Chart from "./desktop/Chart";
import Forecast from "./desktop/Forecast";

//pictures
import DailySummary from "./DailySummary";
import WeatherSpecifics from "./WeatherSpecifics";

import '../css/Main.css';
import axios from "axios";
import Search from "./desktop/Search";
import Recents from "./desktop/Recents";


function Main(){
    const [searchValue,setSearchValue] = useState();
    const [key,setKey] = useState(false);
    const[isLoading,setIsLoading] = useState(true);
    const[location, setLocation] = useState();
    const [data, setData] = useState(false);
    const [forecast, setForecast] = useState({});
    const[forecastHour, setForecastHour] = useState();
    const [specifics, setSpecifics] = useState({});
    const[temp, setTemp] = useState("");
    const initialized = useRef(false);
    const [condition, setCondition] = useState();
    const[date, setDate] = useState()
    const[current, setCurrent] = useState();


    const [latLong, setLatLong] = useState(false)
    const [latitude, setLatitude] = useState(false)

    // const successCallback = (position) => {
    //     // console.log( "latitude " +position.coords.latitude)
    //     setLatitude(position.coords.latitude.toString());
    //     setLongitude(position.coords.longitude.toString());  
    // }
    // fires off function to get lat and longitude
    // navigator.geolocation.getCurrentPosition(successCallback);


    window.navigator.geolocation.getCurrentPosition(
        position => {
          const location = {
            lat:position.coords.latitude,
            long:position.coords.longitude
            
          }
          showLocation(location); // <- Function that will use location data
        },
        (err)=>console.log(err),
      
      );

      function showLocation(location) {
        
        setLatLong(location.lat.toString()+","+location.long.toString());
        // setLongitude(location.long.toString());
        setKey("84487a92cee24d95bff41045232309");  

    }


     //lifted up state from child component Search
        const getData = (searchValue) => {
            setSearchValue(searchValue);
            console.log(searchValue);
         }





        const getRequest = async (key, lat)=> {
            
            await axios.get("https://api.weatherapi.com/v1/forecast.json?key="+key+"&q="+lat+"&days=10&aqi=no&alerts=no").then(res => {
                    
                    setIsLoading(false);
                    const weatherDetails = res.data.current;
                    setCurrent(res.data.current);
                    setLocation(res.data.location)
                    setData(res);
                    //set temp value
                    console.log();
                    setTemp(res.data.current.temp_f);
                    //set weather condition
                    setCondition(res.data.current.condition.text)
                    setForecast(res.data.forecast.forecastday)
                    setForecastHour(res.data.forecast.forecastday[0].hour)
                    setDate(res.data.current.last_updated.toString().substring(0,10))
                    setSpecifics ({
                    Wind:{
                        icon: "Wind",
                        value: weatherDetails.humidity + " mp/h",
                        name: "Wind"},
                    Humidity: {icon: "Humidity",
                        value: weatherDetails.humidity + "%",
                        name: "Humidity"},
                    Visibility: {icon: "Visibility",
                        value: weatherDetails.vis_miles + " miles",
                        name: "Visibility"}}
                    )
                    setIsLoading(false);
                }).catch(err => {
                    console.log(err)
                })
               
        }
        useEffect(() => {
            if(!latitude && !key){
            }else{
                if(!searchValue){
                    initialized.current = true;
                    getRequest(key, latLong);
                }else{
                    getRequest(key, searchValue)
                }
                
            }
            // console.log("http://api.weatherapi.com/v1/forecast.json?key="+key+" &q="+latLong+"&days=10&aqi=no&alerts=no")
            // console.log(latitude)
            
           
        },[isLoading, latitude, key, searchValue])


    
    if(isLoading){
        return "Loading...";
    }
    if(!isLoading && window.innerWidth < 500){
          return(
            <div>
                <Search onSubmit={getData}/>
                <Location location={location}/>
                <Day condition={condition}/>
                <Temp prop={temp}/>
                {/* <DailySummary/> */}
                <WeatherSpecifics prop={specifics} forecast={forecast} forecastHour={forecastHour}/> 
            </div>
        ) 
    }
    if(!isLoading && window.innerWidth > 500){
        return(
            <div className="mainDesk">
                <div className="left">
                    <Search onSubmit={getData}/>
                    <Forecast forecast={forecast}/>

                </div>
                <div className="right">
                    
               
                    {forecastHour && <Hourly location={location} forecastHour={forecastHour} current={current}/>}
                    {/* <Recents/> */}
                
                
                    <div className="beside">
                            <Chart forecast={forecast}/>
                            
                    </div>
                </div>
             
            </div>
        )
    } 

}

export default Main;