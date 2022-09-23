import React, {Component} from 'react'
import {
  Card,
  List
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory} from '../../api'
import memoryUtils from "../../utils/memoryUtils";
import withRouter from '../../utils/withRouter'

const Item = List.Item

class ProductDetail extends Component {

  state = {
    cName1: '',
    cName2: '',
  }

  async componentDidMount () {

    // Get the category ID of the current product from cache
    const {pCategoryId, categoryId} = memoryUtils.product
    if(pCategoryId==='0') {
      const result = await reqCategory(categoryId)
      const cName1 = result.data.name
      this.setState({cName1})
    } else { 
      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      const cName1 = results[0].data.name
      const cName2 = results[1].data.name
      this.setState({
        cName1,
        cName2
      })
    }

  }

  /*
 Clear data
 */
  componentWillUnmount () {
    memoryUtils.product = {}
  }


  render() {

    const {name, desc, price, detail, imgs} = memoryUtils.product
    const {cName1, cName2} = this.state

    const title = (
      <span>
        <LinkButton>
          <ArrowLeftOutlined
            style={{marginRight: 10, fontSize: 20}}
            onClick={() => this.props.navigate(-1)}
          />
        </LinkButton>

        <span>Product Details</span>
      </span>
    )
    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item>
            <span className="left">Name:</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className="left">Description:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className="left">Price:</span>
            <span>{price}元</span>
          </Item>
          <Item>
            <span className="left">Category:</span>
            <span>{cName1} {cName2 ? ' --> '+cName2 : ''}</span>
          </Item>
          <Item>
            <span className="left">Image:</span>
            <span>
              {
                imgs.map(img => (
                  <img
                    key={img}
                    src={BASE_IMG_URL + img}
                    className="product-img"
                    alt="img"
                  />
                ))
              }
            </span>
          </Item>
          <Item>
            <span className="left">Details:</span>
            <span dangerouslySetInnerHTML={{__html: detail}}>
            </span>
          </Item>

        </List>
      </Card>
    )
  }
}

export default withRouter(ProductDetail)