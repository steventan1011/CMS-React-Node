import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import {reqDeleteImg} from '../../api'
import {BASE_IMG_URL} from "../../utils/constants";

/*
For image uploading
 */
export default class PicturesWall extends React.Component {

  static propTypes = {
    imgs: PropTypes.array
  }

  state = {
    previewVisible: false, // whether to preview
    previewImage: '', // url
    fileList: [
      /*{
        uid: '-1', // each file has its own unique id
        name: 'xxx.png', // image file name
        status: 'done', // status: done, uploading, removed
        url: '', // url
      },*/
    ],
  }

  constructor (props) {
    super(props)

    let fileList = []

    const {imgs} = this.props
    if (imgs && imgs.length>0) {
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: 'done', 
        url: BASE_IMG_URL + img
      }))
    }

    this.state = {
      previewVisible: false, 
      previewImage: '',
      fileList 
    }
  }

  getImgs  = () => {
    return this.state.fileList.map(file => file.name)
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    console.log('handlePreview()', file)
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = async ({ file, fileList }) => {
    console.log('handleChange()', file.status, fileList.length, file===fileList[fileList.length-1])

    if(file.status==='done') {
      const result = file.response  // {status: 0, data: {name: 'xxx.jpg', url: ''}}
      if(result.status===0) {
        message.success('Upload image successfully!')
        const {name, url} = result.data
        file = fileList[fileList.length-1]
        file.name = name
        file.url = url
      } else {
        message.error('Failed to upload image')
      }
    } else if (file.status==='removed') { // delete the image
      const result = await reqDeleteImg(file.name)
      if (result.status===0) {
        message.success('Delete image successfully!')
      } else {
        message.error('Failed to delete image!')
      }
    }

    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload" /*upload address*/
          accept='image/*'  /*only accept image*/
          name='image' /*request param*/
          listType="picture-card"  /*card type*/
          fileList={fileList}  /*uploaded image list*/
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>

        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}