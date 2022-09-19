import {useLocation, useNavigate } from "react-router";  
import React from 'react'

export default function withRouter(Component) {
    return (props) => {
        const location = useLocation();
        const navigate = useNavigate();
        return <Component navigate={navigate} location={location} {...props} />;
    }
}
