import Bar from '@/components/Bar'
import './index.scss'
//思路
//1.看官方文档 把echars加入项目中
// 如何在react获取dom -> useRef
// 在什么地方获取dom节点 -> useEffect
//2.不抽离定制化的参数 先把最小化的demo跑出来
//3.按照需求，哪些参数需要自定义 抽象出来

const Home = () => {

  return (
    <div>
      {/* 渲染Bar组件 */}
      <Bar
        title='主流框架使用满意度'
        xData={['react', 'vue', 'angular']}
        yData={['30', '40', '50']}
        style={{ width: '500px', height: '400px' }} />
      <Bar
        title='主流框架使用满意度2'
        xData={['react', 'vue', 'angular']}
        yData={['20', '30', '50']}
        style={{ width: '300px', height: '2 00px' }} />
    </div >
  )
}

export default Home