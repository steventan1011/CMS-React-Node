import React, {Component} from 'react'
import {Navigate, Routes, Route, useNavigate, Outlet} from 'react-router-dom'
import {Layout} from 'antd'
import {connect} from 'react-redux'

// import Login from '../login/login'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
// import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import NotFound from '../not-found/not-found'
// import Order from '../order/order'

const { Footer, Sider, Content } = Layout

class Admin extends Component {
    render() {
        const user = this.props.user

        if(!user || !user._id) {
          // if there is no user in the store, then redirect to /login page
          return <Routes><Route path="/" element={<Navigate to ="/login" />}/></Routes>
        }
        return (
          <Layout style={{minHeight: '100%'}}>
            <Sider>
              <LeftNav/>
            </Sider>
            <Layout>
              <Header>Header</Header>
              <Content style={{margin: 20, backgroundColor: '#fff', height: '560px'}}>
                <Routes>
                  <Route path="/" element={<Navigate to ="/home" />}/>
                  <Route path='home' element={<Home />}/>
                  <Route path='/category' element={<Category />}/>
                  <Route path='/product' element={<Product />}/>
                  <Route path='/role' element={<Role />}/>
                  {/* <Route path='/user' element={<User />}/> */}
                  <Route path='/charts/bar' element={<Bar />}/>
                  <Route path='/charts/line' element={<Line />}/>
                  <Route path='/charts/pie' element={<Pie />}/>
                  {/* <Route path="/order" element={<Order />}/> */}
                  <Route path="*" element={<NotFound />}/>
                </Routes>
                
              </Content>
              <Footer style={{textAlign: 'center', color: '#cccccc'}}>Use Chrome</Footer>
            </Layout>
          </Layout>
        )
    }
}

export default connect(state => ({user: state.user}), {})(Admin)