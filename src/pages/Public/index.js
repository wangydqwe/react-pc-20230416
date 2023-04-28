import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useStore } from '@/store'
import { observer } from 'mobx-react-lite'
import { useState, useRef, useEffect } from 'react'
import { http } from '@/utils'

const { Option } = Select

const Publish = () => {
  const { channelStore } = useStore()
  //存放上传图片的列表
  const [fileList, setFileList] = useState([])

  //useRef声明一个暂存仓库
  const cacheImgList = useRef([])
  const onUploadChange = ({ fileList }) => {
    //采取受控的写法：在最后一次log里有response
    //最终react state fileList中存放的数据有response.data.url
    setFileList(fileList)
    //同时把图片列表存入仓库一份
    //这里关键位置：需要做数据格式化
    const formatList = fileList.map(file => {
      //上传完毕 做数据处理
      if (file.response) {
        return {
          url: file.response.data.url
        }
      }
      //否则在上传中时，不做处理
      return file
    })
    setFileList(formatList)
    cacheImgList.current = fileList
  }

  //切换图片
  const [imgCount, setImgCount] = useState(1)
  const radioChange = (e) => {
    //这里的判断依据我们采取原始值 不采取经过useState修改之后的数据
    //useState修改之后的数据无法同步获取修改之后的新值
    const rawValue = e.target.value
    setImgCount(rawValue)
    //从仓库里面取对应的图片数量 交给我们用来渲染图片列表的fileList
    //通过调用setFileList
    if (cacheImgList.current.length === 0) {
      return false
    }

    if (rawValue === 1) {
      const img = cacheImgList.current ? cacheImgList.current[0] : []
      setFileList([img])
    } else if (rawValue === 3) {
      setFileList(cacheImgList.current)
    }
  }
  //提交表单
  const navigator = useNavigate()
  const onFinish = async (value) => {
    console.log(value)
    //数据的二次处理 重点是处理cover字段
    const { channel_id, content, title, type } = value

    const params = {
      channel_id,
      content,
      title,
      type,
      cover: {
        type: type,
        images: fileList.map(item => item.url)
      }
    }
    if (id) {
      await http.put(`/mp/articles/${id}?draft=false`, params)
    } else {
      //新增
      await http.post('/mp/articles?draft=false', params)
    }
    //跳转列表 提示用户
    navigator('/aticle')
    message.success(`${id ? '更新成功' : '发布成功'}`)
  }
  //编辑功能
  //文案适配 路由参数id 判断条件
  const [params] = useSearchParams()
  const id = params.get('id')
  console.log('rounte:', id)
  //数据回填 id调用接口 1 .表单回填 2、暂存列表 3.Upload组件fileList
  const form = useRef(null)
  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/mp/articles/${id}`)
      //表单数据回填 实例方法
      const data = res.data
      form.current.setFieldsValue({ ...data, type: data.cover.type })
      //调用setFileList方法回填upload
      const formatImgList = data.cover.images.map(url => ({ url }))
      setFileList(formatImgList)
      //暂存列表也存一份(暂存列表和fileList回显列表保持数据解构统一就可以)
      cacheImgList.current = formatImgList
    }
    //必须是编辑状态 才可以发送请求 
    if (id) {
      loadDetail()
      console.log(form.current)
    }
  }, [id])

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/">トップページ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>菜品{id ? '更新' : '登録'}</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1, content: '内容を入力してください' }}
          onFinish={onFinish}
          ref={form}
        >
          <Form.Item
            label="菜品"
            name="title"
            rules={[{ required: true, message: '菜品名称を入力してください' }]}
          >
            <Input placeholder="菜品名称を入力してください" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="種類"
            name="channel_id"
            rules={[{ required: true, message: '種類を選択してください' }]}
          >
            <Select placeholder="種類を選択してください" style={{ width: 400 }}>
              {channelStore.channelList.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="図">
            <Form.Item name="type">
              <Radio.Group onChange={radioChange}>
                <Radio value={1}>単図</Radio>
                <Radio value={3}>三図</Radio>
                <Radio value={0}>なし</Radio>
              </Radio.Group>
            </Form.Item>
            {imgCount > 0 && (
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList
                action="http://geek.itheima.net/v1_0/upload"
                fileList={fileList}
                onChange={onUploadChange}
                multiple={imgCount > 1}
                maxCount={imgCount}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>
          {/* 这里的富文本组件 已经被Form.item控制 */}
          {/* 他的输入内容 会在onFinished回调中收集起来 */}
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '内容を入力してください' }]}
          >
            <ReactQuill
              className="publish-quill"

            />
          </Form.Item>


          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                内容{id ? '更新' : '登録'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default observer(Publish) 