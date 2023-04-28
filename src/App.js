import { Routes, Route } from 'react-router-dom'
import { HistoryRouter, history } from './utils/history'
//import Login from './pages/Login'
import Login from '@/pages/Login'
import Layout from './pages/Layout'
import './App.css'
import { AuthComponent } from '@/components/AuthComponent'
import Public from './pages/Public'
import Aticle from './pages/Aticle'
import Home from './pages/Home'

function App () {
  return (
    //路由配置
    <HistoryRouter history={history}>
      <div className="App">
        <Routes>
          {/* 创建路由path和组件对应关系 */}
          {/* Layout需要鉴权处理的 */}
          {/* 这里的Layout不一定不能写死 要根据是否登录进行判断 */}
          <Route path='/' element={
            <AuthComponent>
              <Layout />
            </AuthComponent>
          }>
            <Route index element={<Home />}></Route>
            <Route path='aticle' index element={<Aticle />}></Route>
            <Route path='publish' index element={<Public />}></Route>
          </Route>
          {/* 不需要鉴权处理 */}
          <Route path='/login' element={<Login />}></Route>
        </Routes>
      </div>
    </HistoryRouter>
  )
}

export default App
