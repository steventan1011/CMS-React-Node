import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Menu} from 'antd'
import * as Icon from '@ant-design/icons'
import {connect} from 'react-redux'
import withRouter from '../../utils/withRouter'

import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import './index.less'
import {setHeadTitle} from '../../redux/actions'

const SubMenu = Menu.SubMenu;

class LeftNav extends Component {

  constructor(props) {
    super(props)
    
    this.menuNodes = this.getMenuNodes(menuList)
  }

  /*
  Determine whether the currently logged in user has permission to the item
   */
  hasAuth = (item) => {
    const {key, isPublic} = item

    const menus = this.props.user.role.menus
    const username = this.props.user.username
    /*
    1. If the current user is admin
    2. If the current item is public
    3. The current user has permission for this item: Is the key in the menus?
     */
    if(username==='admin' || isPublic || menus.indexOf(key)!==-1) {
      return true
    } else if(item.children){ // 4. If the current user has permission to a sub-item of this item
      return !!item.children.find(child =>  menus.indexOf(child.key)!==-1)
    }

    return false
  }

  /*
  Generate the corresponding label array according to the data array of menu
  Use reduce() + recursive call
  */
  getMenuNodes = (menuList) => {
    return  menuList.map(v => {
       if (!v.children) {
         const icon = React.createElement(
           Icon[v.icon],
           {
             style:{ fontSize: '16px'}
           }
         )
         return (
           <Menu.Item key={v.key} icon={icon}>
             <Link to={v.key}>
               {v.title}
             </Link>
           </Menu.Item>
         )
       }else{
          const icon= React.createElement(
             Icon[v.icon],
             {
               style:{ fontSize: '16px'}
             }
           )
         return (
           <SubMenu key={v.key} title={v.title} icon={icon}>
 
             {
               this.getMenuNodes(v.children)
             }
           </SubMenu>
         )
       }
     })
   }

  render() {
    // debugger
    let path = this.props.location.pathname
    console.log('render()', path)
    if(path.indexOf('/product')===0) { 
      path = '/product'
    }

    const openKey = this.openKey

    return (
      
      <div className="left-nav">
        <Link to='/' className="left-nav-header">
          <img src={logo} alt="logo"/>
          <h1>CMS</h1>
        </Link>

        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
        >

          {
            this.menuNodes
          }

        </Menu>
      </div>
    )
  }
}


export default connect(
  state => ({user: state.user}),
  {setHeadTitle}
)(withRouter(LeftNav))