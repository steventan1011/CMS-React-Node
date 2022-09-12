import React, { Component } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Login from './pages/login/login';
import Admin from './pages/admin/admin';

// root component for the appilication
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" component={Login}/>
          <Route path="/" component={Admin}/>
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App;
