import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen, fireEvent, act, cleanup, findByText} from '@testing-library/react';
import '@testing-library/jest-dom';
import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();
import App from './App';

beforeEach(()=>{
  cleanup();
  fetch.resetMocks();
})


test('renders App and it display weather(place,temp) and news(title,description)', async () => {
  fetch.mockResponses(
    // [
    //   JSON.stringify({main:{temp: '17°c'},name: 'Silao', sys: {country: 'IN'}, weather: [{main: 'Mist'}]}), { status: 200}
    // ],
    [
      JSON.stringify({articles:[{title: 'news_title', description: 'news_description', url: 'news_url', image: 'news_img', publishedAt: '12-12-12'}]}), { status: 200}
    ]
  )
  await act(async () =>{ render(<App />) });
  console.log(fetch.mock.calls);
  expect(screen.getByText(/news_title/i)).toBeInTheDocument();
  expect(screen.getByText(/news_description/i)).toBeInTheDocument();
  expect(screen.getByText(/Silao/)).toBeInTheDocument();
  expect(screen.getByText(/17/i)).toBeInTheDocument();
  expect(screen.getByText(/mist/i)).toBeInTheDocument();
  fetch.resetMocks();
});

