import React, {useState, useEffect} from 'react';
import './App.css';
import data from './data.js';

const weatherAPI = {
  key: "a64d07a306972de8e9f8c8267a9cc2c0",
  base: "https://api.openweathermap.org/data/2.5/"
}

const newsAPI = {
  key: "1321740c80c3874a09a04e802b81c02a",
  base: "https://gnews.io/api/v4/"
}


function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({main:{temp: ''},name: '', sys: {country: ''}, weather: [{main: ''}]});
  const [news, setNews] = useState(data);
  const search = evt => {
    if (evt.key === "Enter") {
      fetch(`${weatherAPI.base}weather?q=${query}&units=metric&APPID=${weatherAPI.key}`)
        .then(res => {
          if (res.ok) 
          return res.json();
          else{
            setQuery('');
            throw new Error('Invalid location/city/country');
          }
        })
        .then(result => {
          setWeather(result);
          setQuery('');
          console.log(result);
        })
        .catch((error) => {
          console.log(error)
        });
    }
  }
  useEffect(() =>{
    const fetchWeather = async () =>{
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(async (position) =>{
          // get user's location
          let pos = {
            lat: position.coords.latitude,
            lon: position.coords.longitude, 
          }
          // get whether of user's location
          await fetch(`${weatherAPI.base}weather?lat=${pos.lat}&lon=${pos.lon}&units=metric&appid=${weatherAPI.key}`)
          .then(res => {
            if (res.ok)
              return res.json();
            else
              throw new Error('Invalid location/city/country');
          })
          .then(result => {
            setWeather(result);
            console.log(result);
          })
          .catch(error => console.log(error));
        });
      }
    }
    const fetchNews = async () =>{
      if(news.articles.length === 1){
        await fetch(`${newsAPI.base}top-headlines?&lang=hi&token=${newsAPI.key}`)
          .then(function (response) {
              if(response.ok)
              return response.json();
            else
              throw new Error('Something went wrong')
          })
          .then(function (data) {
            setNews(data);
            console.log(data);
          })
          .catch(error => console.log(error));
        }
    }
   fetchWeather();
   fetchNews();
  }, [])
  

  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }
  
  return (
    <div className="App">
    <div className='weather-info'>
    <div className="weather-search-box">
      <input className="search" type="text" onChange={e => setQuery(e.target.value)} placeholder="search.." value={query} onKeyPress={search}></input>
    </div>
    <div className="location-box">
            <div className="location">{weather.name}, {weather.sys.country}</div>
            <div className="date">{dateBuilder(new Date())}</div>
          </div>
      <div className="weather-box">
        <div className="temp">{Math.round(weather.main.temp)}°c</div>
        <div className="weather">{weather.weather[0].main}</div>
      </div>
      </div>
      <div className='news-info'>
          {news.articles.map((article) => {
            return <article className='article' key={article.title}>
            <a href={article.url}><h3>{article.title}</h3></a>
              <p>{article.description}</p>
              <img src={article.image} width='200px' height='200px'/>
            </article>
          })}
      </div>
    </div>
  );
}

export default App;
// {articles:[{title: '', description: '', url: '', image: '', publishedAt: ''}]}
