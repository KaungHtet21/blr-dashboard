import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import type { LoginCredentials } from '../types';

const { Title } = Typography;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const LoginCard = styled(Card)`
  width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
`;

const LoginForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 24px;
  }
`;

const LoginButton = styled(Button)`
  width: 100%;
  height: 45px;
  font-size: 16px;
  border-radius: 8px;
`;

const LoginPage: React.FC = () => {
  const { login, loading } = useAuth();
  const [form] = Form.useForm();

  const onFinish = async (values: LoginCredentials) => {
    const result = await login(values);
    if (result.success) {
      message.success(result.message);
    } else {
      message.error(result.message);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
            BLR Dashboard
          </Title>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Sign in to access the admin panel
          </p>
        </div>

        <LoginForm
          form={form}
          name="login"
          onFinish={(values) => onFinish(values as LoginCredentials)}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <LoginButton
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
            >
              Sign In
            </LoginButton>
          </Form.Item>
        </LoginForm>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <p style={{ color: '#999', fontSize: '12px' }}>
            Demo credentials: nox@gmail.com / admin123
          </p>
        </div>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;
