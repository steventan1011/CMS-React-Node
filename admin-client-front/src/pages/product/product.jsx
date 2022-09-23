import React, {Component} from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'
import NotFound from '../not-found/not-found'
import ProductTest from './test'

import './product.less'

/*
商品路由
 */
export default class Product extends Component {
  render() {
    return (
      <Routes>
        <Route path='/' element={<ProductHome />} exact/>
        <Route path='/addupdate' element={<ProductAddUpdate />}/>
        <Route path='/detail' element={<ProductDetail />}/>
        <Route path='/test' element={<ProductTest />}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  }
}