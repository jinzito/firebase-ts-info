import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const xhttp:XMLHttpRequest = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    // Typical action to be performed when the document is ready:
    const data: any = JSON.parse(xhttp.responseText) || {};
    ReactDOM.render(<App resource={data}/>, document.getElementById('root'));
  }
};

xhttp.open("GET", `text-resources.json`, true);
xhttp.send();


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
