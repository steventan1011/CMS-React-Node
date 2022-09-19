import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Menu, Icon} from 'antd'
import {connect} from 'react-redux'
import withRouter from '../../utils/withRouter'

import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import './index.less'
import {setHeadTitle} from '../../redux/actions'

const SubMenu = Menu.SubMenu;

class LeftNav extends Component {

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
  Use map() + recursive call
  */
  getMenuNodes_map = (menuList) => {
    return menuList.map(item => {
      if(!item.children) {
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon}/>
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      } else {
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
              <Icon type={item.icon}/>
              <span>{item.title}</span>
            </span>
            }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
        )
      }

    })
  }

  /*
  Generate the corresponding label array according to the data array of menu
  Use reduce() + recursive call
  */
  getMenuNodes = (menuList) => {
    const path = this.props.location.pathname

    return menuList.reduce((pre, item) => {

      if (this.hasAuth(item)) {
        if(!item.children) {
          if (item.key===path || path.indexOf(item.key)===0) {
            this.props.setHeadTitle(item.title)
          }

          pre.push((
            <Menu.Item key={item.key}>
              <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>
                <Icon type={item.icon}/>
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          ))
        } else {
          const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
          if (cItem) {
            this.openKey = item.key
          }

          pre.push((
            <SubMenu
              key={item.key}
              title={
                  <span>
                    <Icon type={item.icon}/>
                    <span>{item.title}</span>
                  </span>
              }
            >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          ))
        }
      }

      return pre
    }, [])
  }

  /*
    Execute once before the first render()
    Prepare data for the first render() (must be synchronized)
   */
  componentWillMount () {
    this.menuNodes = this.getMenuNodes(menuList)
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