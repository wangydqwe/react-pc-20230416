import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
//引入index.scss文件
import './index.scss'

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// )

createRoot(document.getElementById('root')).render(<App />)