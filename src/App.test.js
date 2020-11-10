import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen, fireEvent, act, cleanup, findByText, getByRole} from '@testing-library/react';
import '@testing-library/jest-dom';
import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();
import App from './App';

beforeEach(()=>{
  cleanup();
  fetch.resetMocks();
})


test('renders App and it display weather(place,temp) based on user geolocation and news(title,description)', async () => {
  const mockGeolocation = {
    getCurrentPosition: jest.fn()
      .mockImplementationOnce((success) => Promise.resolve(success({
        coords: {
          latitude: 51.1,
          longitude: 45.3
        }
      })))
  };
  global.navigator.geolocation = mockGeolocation;
  fetch.mockResponses(
    [
      JSON.stringify({main:{temp: 17},name: 'Silao', sys: {country: 'IN'}, weather: [{main: 'Mist'}]}), { status: 200}
    ],
    [
      JSON.stringify({articles:[{title: 'news_title', description: 'news_description', url: 'news_url', image: 'news_img', publishedAt: '12-12-12'}]}), { status: 200}
    ]
  )
  await act(async () =>{ render(<App />) });
  //console.log(fetch.mock.calls);
  expect(screen.getByText(/news_title/i)).toBeInTheDocument();
  expect(screen.getByText(/news_description/i)).toBeInTheDocument();

  expect(screen.getByText(/Silao/i)).toBeInTheDocument();
  expect(screen.getByText(/17/i)).toBeInTheDocument();
  expect(screen.getByText(/mist/i)).toBeInTheDocument();
  fetch.resetMocks();
});

test('Able to get weather of any location(valid) through input box and firing keyPress(Enter) event', async () => {
  const mockGeolocation = {
    getCurrentPosition: jest.fn()
      .mockImplementationOnce((success) => Promise.resolve(success({
        coords: {
          latitude: 51.1,
          longitude: 45.3
        }
      })))
  };
  global.navigator.geolocation = mockGeolocation;
  fetch.mockResponses(
    [
      JSON.stringify({main:{temp: 18},name: 'Kolkata', sys: {country: 'IN'}, weather: [{main: 'Warm'}]}), { status: 200}
    ],
    [
      JSON.stringify({articles:[{title: 'news_title2', description: 'news_description2', url: 'news_url', image: 'news_img', publishedAt: '12-12-12'}]}), { status: 200}
    ],
    [
      JSON.stringify({main:{temp: 19},name: 'Texas', sys: {country: 'US'}, weather: [{main: 'Cloud'}]}), { status: 200}
    ],
  )
  await act(async () =>{ render(<App />) });
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(screen.getByText(/news_title2/i)).toBeInTheDocument();
  expect(screen.getByText(/news_description2/i)).toBeInTheDocument();

  expect(screen.getByText(/kolkata/i)).toBeInTheDocument();
  expect(screen.getByText(/18/i)).toBeInTheDocument();
  expect(screen.getByText(/warm/i)).toBeInTheDocument();

  const input = document.getElementsByTagName('INPUT')[0];  
  await act(async () =>{ 
    /* fire events that update state */
    fireEvent.change(input, {target: {value: 'Texas'}});
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13}); 
  });
  expect(screen.getByText(/texas/i)).toBeInTheDocument();
  expect(screen.getByText(/19/i)).toBeInTheDocument();
  expect(screen.getByText(/cloud/i)).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledTimes(3);
  //console.log(fetch.mock.calls);
  fetch.resetMocks();
});

//console.log(fetch.mock.calls);
//to see your fetchcalls

test('should be able to handle invalid location request', async () =>{
  const mockGeolocation = {
    getCurrentPosition: jest.fn()
      .mockImplementationOnce((success) => Promise.resolve(success({
        coords: {
          latitude: 51.1,
          longitude: 45.3
        }
      })))
  };
  global.navigator.geolocation = mockGeolocation;
  fetch.mockResponses(
    [
      JSON.stringify({main:{temp: 17},name: 'Silao', sys: {country: 'IN'}, weather: [{main: 'Mist'}]}), { status: 200}
    ],
    [
      JSON.stringify({articles:[{title: 'news_title', description: 'news_description', url: 'news_url', image: 'news_img', publishedAt: '12-12-12'}]}), { status: 200}
    ],
    [
      (() => Promise.reject("API is down"))
    ]
  )
  await act(async () =>{ render(<App />) });
  
  expect(screen.getByText(/news_title/i)).toBeInTheDocument();
  expect(screen.getByText(/news_description/i)).toBeInTheDocument();

  expect(screen.getByText(/Silao/i)).toBeInTheDocument();
  expect(screen.getByText(/17/i)).toBeInTheDocument();
  expect(screen.getByText(/mist/i)).toBeInTheDocument();
  const input = document.getElementsByTagName('INPUT')[0];  
  await act(async () =>{ 
    /* fire events that update state */
    fireEvent.change(input, {target: {value: 'adsf'}});
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13}); 
  });
  expect(screen.getByText(/Silao/i)).toBeInTheDocument();
  expect(screen.getByText(/17/i)).toBeInTheDocument();
  expect(screen.getByText(/mist/i)).toBeInTheDocument();
  console.log(fetch.mock.calls);
  fetch.resetMocks();
})
