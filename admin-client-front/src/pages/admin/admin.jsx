import React, {Component} from 'react'
import {Navigate, Routes, Route} from 'react-router-dom'
import {Layout} from 'antd'
import {connect} from 'react-redux'

import Login from '../login/login'
// import LeftNav from '../../components/left-nav'
// import Header from '../../components/header'
// import Home from '../home/home'
// import Category from '../category/category'
// import Product from '../product/product'
// import Role from '../role/role'
// import User from '../user/user'
// import Bar from '../charts/bar'
// import Line from '../charts/line'
// import Pie from '../charts/pie'
// import NotFound from '../not-found/not-found'
// import Order from '../order/order'

const { Footer, Sider, Content } = Layout

class Admin extends Component {
    render() {
        const user = this.props.user
        console.log("hello")

        if(!user || !user._id) {
          // if there is no user in the store, then redirect to /login page
          return <Routes><Route path="/*" element={<Navigate to ="/login" />}/></Routes>
        }
        return (<div>Admin</div>)
    }
}

export default connect(state => ({user: state.user}), {})(Admin)