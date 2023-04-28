import { Layout, Menu, Popconfirm } from 'antd'
import { observer } from 'mobx-react-lite'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import './index.scss'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { useEffect } from 'react'

const { Header, Sider } = Layout

const GeekLayout = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { userStore, loginStore, channelStore } = useStore()
  useEffect(() => {
    try {
      userStore.getUserInfo()
      channelStore.loadChannelList()
    } catch { }
  }, [userStore, channelStore])
  //确认退出
  const onConfirm = () => {
    //退出登录 删除token 跳回到登录
    loginStore.loginOut()
    navigate('/login')
  }
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{userStore.userInfo.name}</span>
          <span className="user-logout">
            <Popconfirm
              onConfirm={onConfirm}
              title="ログアウトしますか？" okText="ログアウト" cancelText="キャンセル">
              <LogoutOutlined /> ログアウト
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          {/* 高亮原理：defaultSelectedKeys === item key */}
          {/* 获取当前激活的path路径？ */}
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={[pathname]}
            style={{ height: '100vh', borderRight: 0 }}
            items={[
              {
                key: "/",
                icon: <HomeOutlined />,
                label: 'トップページ',
                onClick: () => { navigate('/') }
              },
              {
                key: "/aticle",
                icon: <DiffOutlined />,
                label: '内容管理',
                onClick: () => { navigate('/aticle') }
              },
              {
                key: "/publish",
                icon: <EditOutlined />,
                label: '菜品登録',
                onClick: () => { navigate('/publish') }
              }
            ]}
          />
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* 二级路由出口 */}
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}

export default observer(GeekLayout)