import React, {Component} from 'react';
import {HashRouter, Routes, Route} from 'react-router-dom';

import Login from './pages/login/login';
import Admin from './pages/admin/admin';

// root component for the appilication
class App extends Component {
    render() {
        return (
            <HashRouter>
                <Routes>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/" element={<Admin />}></Route>
                </Routes>
            </HashRouter>
        )
    }
}

export default App;
