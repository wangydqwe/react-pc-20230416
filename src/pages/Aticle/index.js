import { Link, useNavigate } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Table, Tag, Space } from 'antd'
import './index.scss'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import img404 from '@/assets/error.png'
import { useEffect, useState } from 'react'
import { http } from '@/utils'
import { useStore } from '@/store'
import { observer } from 'mobx-react-lite'

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  const { channelStore } = useStore()

  //文章列表管理 统一管理数据 将来修改给setList传对象
  const [articleData, setArticleData] = useState({
    list: [],//文章列表
    count: 0//文章数量
  })
  //文章参数管理
  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
    status: 0
  })
  //如果异步请求函数需要依赖一些数据的变化而重新执行
  //推荐把它写到内部
  //统一不抽离函数到外面 ，只要涉及到异步请求的函数 都放到useEffect 
  //本质区别：写到外面每次组件更新都会重新进行函数初始化 这本身就是一次性能消耗
  //而写到useEffect中 只会在依赖项发生变化的时候 函数才会进行重新初始化
  //避免性能损失
  useEffect(() => {
    const loadList = async () => {
      const res = await http.get('/mp/articles', { params })
      console.log(res)
      const { results, total_count } = res.data
      setArticleData({
        list: results,
        count: total_count
      })
    }
    loadList()
  }, [params])


  const onSearch = (values) => {
    console.log(values)
    const { channel_id, date, status } = values
    //数据处理
    const _params = {}
    if (status !== -1) {
      _params.status = status
    }
    if (channel_id) {
      _params.channel_id = channel_id
    }
    if (date) {
      _params.begin_pubdate = date[0].format('YYYY-MM-DD')
      _params.end_pubdate = date[1].format('YYYY-MM-DD')
    }
    //修改params数据 引起接口的重新发送 对象的合并是一个整体覆盖 改了对象的整体引用
    setParams({
      ...params,
      ..._params
    })
  }
  const onChange = (page) => {
    setParams({
      ...params,
      page
    })
  }
  const columns = [
    {
      title: '菜品',
      dataIndex: 'cover',
      width: 120,
      render: cover => {
        return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: '名称',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => <Tag color="green">审核通过</Tag>
    },
    {
      title: '更新時間',
      dataIndex: 'pubdate'
    },

    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => goPublish(data)} />
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => delArticle(data)}
            />
          </Space>
        )
      }
    }
  ]
  //删除
  const delArticle = async (data) => {
    console.log(data)
    await http.delete(`/mp/articles/${data.id}`)
    //刷新一下列表
    setParams({
      ...params,
      page: 1
    })
  }
  //编辑
  const navigate = useNavigate()
  const goPublish = (data) => {
    navigate(`/publish?id=${data.id}`)
  }
  return (
    <div>
      {/* 文章筛选区 */}
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/">トップページ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        <Form
          onFinish={onSearch}
          initialValues={{ status: null }}>
          <Form.Item label="状態" name="status">
            <Radio.Group>
              <Radio value={null}>全部</Radio>
              <Radio value={0}>一時</Radio>
              <Radio value={1}>未承認</Radio>
              <Radio value={2}>承認済み</Radio>
              <Radio value={3}>承認失敗</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="種類" name="channel_id">
            <Select
              placeholder="種類を選択してください"
              style={{ width: 120 }}
            >
              {channelStore.channelList.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="日付" name="date">
            {/* 传入locale属性 */}
            <RangePicker ></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              フィルターする
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 文章列表区 */}
      <Card title={`以上条件に基づいて、 ${articleData.count}件を検索しました を検索しました：`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={articleData.list}
          pagenation={{
            pageSize: params.per_page,
            total: articleData.count,
            onChange: onChange
          }

          }
        />
      </Card>
    </div >
  )
}

export default observer(Article) 