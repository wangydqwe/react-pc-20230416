import { Card, Form, Input, Checkbox, Button, message } from 'antd'
//导入样式文件
import './index.scss'
import { useStore } from '@/store'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const { loginStore } = useStore()
  const navigate = useNavigate()
  async function onFinished (values) {
    console.log(values)
    //values：放置的是所有表单项中用户输入的内容
    //todo：登录
    try {
      await loginStore.getToken({
        mobile: values.usename,
        code: values.password
      })
      //跳转首页
      navigate('/', { replace: true })
      //提示用户
      message.success('ログイン成功')
    } catch (e) {
      message.error('ログイン失敗')
    }

  }
  return (
    <div className="login">
      <Card className="login-container">
        <span className="login-logo">ｘｘｘｘ　システム</span>
        {/* 登录表单 */}
        {/* 子项用到的触发事件 需要在From中都声明一下才可以 */}
        <Form
          validateTrigger={['onBlur', 'onChange']}
          initialValues={{
            remember: true,

          }}
          onFinish={onFinished}
        >
          <Form.Item
            label="Usename"
            name="usename"
            rules={[
              {
                required: true,
                message: 'メールアドレスを入力してください!',
              },
              {

                message: '正確なメールアドレスを入力してください!',
                validateTrigger: 'onBlur'
              }
            ]}
          >
            <Input size="large" placeholder="メールアドレス" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'パスワードを入力してください!',
              },
              {
                len: 6,
                message: '6桁のパスワードを入力してください!',
                validateTrigger: 'onBlur'
              }
            ]}
          >
            <Input size="large" placeholder="パスワードを入力してください" />
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked"
          >
            <Checkbox className="login-checkbox-label">
              アカウントの作成またはログインすることによって、利用規約、Cookieポリシー、プライバシー規約を理解し、同意したものとします。
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              ログイン
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login