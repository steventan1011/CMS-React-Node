import React, {Component} from 'react';
import {BrowserRouter , Routes, Route} from 'react-router-dom';

import Login from './pages/login/login';
import Admin from './pages/admin/admin';
import Home from './pages/home/home';

// root component for the appilication
class App extends Component {
    render() {
        return (
            <BrowserRouter >
                <Routes>
                    {/* There should be a * to have nested routes in Admin */}
                    <Route path="/*" element={<Admin />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                </Routes>
            </BrowserRouter >
        )
    }
}

export default App;
