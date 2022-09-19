import React, {Component} from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'

import './product.less'

/*
商品路由
 */
export default class Product extends Component {
  render() {
    return (
      <Routes>
        <Route path='/product' element={<ProductHome />} exact/> {/*路径完全匹配*/}
        <Route path='/product/addupdate' element={<ProductAddUpdate />}/>
        <Route path='/product/detail' element={<ProductDetail />}/>
        {/* <Route path="/" element={<Navigate to ="/product" />}/> */}
      </Routes>
    )
  }
}