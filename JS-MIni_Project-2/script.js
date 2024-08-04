

const userTab = document.querySelector("[data-userweather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer =document.querySelector(".user-info-Container");


let currentTab = userTab;
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab")

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage()
        }

    }

}
    

userTab.addEventListener('click',()=>{
    switchTab(userTab);
})

searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
})

// checks if co-ordinates are already stored in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }else{
        const coordinates = JSON.parse(localCoordinates);
        fetchWeatherData(coordinates);
    }
}

async function fetchWeatherData(coordinates){
    const {lat,long} = coordinates;
    // make grant container invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // API call
    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid={API_key}&units=metric`);
        const data = await res.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(error){
        loadingScreen.classList.remove("active");
        console.error(error);
    }
}


function renderWeatherInfo(WeatherInfo){
    // firstly we have to fetch Elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const weatherDesc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[weatherIcon]");
    const weatherTemp = document.querySelector("[data-temperature]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudity = document.querySelector("[data-cloud]");

    cityName.innerText = WeatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${WeatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = WeatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${WeatherInfo?.weather?.[0]?.icon}.png` ;
    weatherTemp.innerText = WeatherInfo?.main?.temp;
    windSpeed.innerText = WeatherInfo?.wind?.speed;
    humidity.innerText = WeatherInfo?.main?.humidity;
    cloudity.innerText = WeatherInfo?.clouds?.all;
}

const grantAccessbtn = document.querySelector("[data-grantAccess]");
grantAccessbtn.addEventListener('click',getLocation);

async function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position){
    const userCoordinate = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinate));
    fetchWeatherData(userCoordinate);
}


let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityname = searchInput.value;
    if(cityname === ""){
        return;
    }else{
        fetchSearchWeatherInfo(cityname);
    }
    
})


async function fetchSearchWeatherInfo(cityname){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_key}&units=metric`);
        const data = await result.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(error){
        alert("City not found");
    }
}






































// function rendeerWeatherInfo(result){
//     let newPara = document.createElement('p');
//     newPara.textContent = `${result?.main?.temp.toFixed(2)} °C`;
//     document.body.appendChild(newPara);
// }

// async function WeatherIT(){
//     let city = `Mumbai`
//     const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`;

//     try {
        
//         const response = await fetch(url);
//         const result = await response.json();
//         console.log(result);
//         // let newPara = document.createElement('p');
//         // newPara.textContent = `${result?.main?.temp.toFixed(2)} °C`;
//         // document.body.appendChild(newPara);
//         rendeerWeatherInfo(result);

//     } catch (error) {
//         console.error(error);
//     }
// }



// function GetLocation(){
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }else{
//         console.log("Geolocation is not supported by this browser.");
//     }
// }
// function showPosition(position){
//     let lat = position.coords.latitude;
//     let long = position.coords.longitude;
//     console.log(`latitude: ${lat}`);
//     console.log(`longitude: ${long}`);
// }