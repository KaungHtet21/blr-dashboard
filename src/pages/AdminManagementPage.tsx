import React, { useState } from 'react';
import { 
  Table, 
  Input, 
  Button, 
  Space, 
  Typography, 
  Tag, 
  message,
  Card,
  Row,
  Col,
  Modal,
  Form,
  Select
} from 'antd';
import { SearchOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import type { AdminUser } from '../types';
import { useAuth } from '../hooks/useAuth';
import { adminService } from '../services/authService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const { Title } = Typography;
const { Option } = Select;

const PageContainer = styled.div`
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

const FilterCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: #fafafa;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 8px 4px;
      font-size: 12px;
    }
  }
`;

const AdminManagementPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminUsers', { search: searchQuery }],
    queryFn: () => adminService.getAllAdminUsers({ 
      search: searchQuery || undefined,
      limit: 100 
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const createAdminMutation = useMutation({
    mutationFn: adminService.createAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      message.success('Admin user created successfully');
      setModalVisible(false);
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to create admin user');
    },
  });

  const columns: any[] = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (username: string) => (
        <span style={{ fontWeight: 500 }}>{username}</span>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      responsive: ['lg'] as any,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const handleSearch = () => {
    // The query will automatically refetch when searchQuery changes
  };

  const handleCreateAdmin = async (values: any) => {
    await createAdminMutation.mutateAsync(values);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  // Show error message if there's an error
  if (error) {
    message.error('Failed to fetch admin users');
  }

  // Only show this page to admins
  if (user?.role !== 'admin') {
    return (
      <PageContainer>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Title level={3} style={{ color: '#ff4d4f' }}>
              Access Denied
            </Title>
            <p>Only administrators can access this page.</p>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          Admin Management
        </Title>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => setModalVisible(true)}
          size="large"
        >
          Create Admin User
        </Button>
      </PageHeader>

      <FilterCard>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search by username"
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button 
              type="primary" 
              onClick={handleSearch}
              loading={isLoading}
              icon={<SearchOutlined />}
            >
              Search
            </Button>
          </Col>
        </Row>
      </FilterCard>

      <Card>
        <StyledTable
          columns={columns}
          dataSource={data?.adminUsers || []}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} admin users`,
            responsive: true,
            size: 'small',
          }}
          scroll={{ x: 600 }}
        />
      </Card>

      <Modal
        title="Create Admin User"
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          name="createAdmin"
          onFinish={handleCreateAdmin}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: 'Please input username!' },
              { min: 3, message: 'Username must be at least 3 characters!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password
              placeholder="Enter password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select placeholder="Select role" size="large">
              <Option value="admin">Admin</Option>
              <Option value="seller">Seller</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleModalCancel}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createAdminMutation.isPending}
                icon={<UserAddOutlined />}
              >
                Create Admin User
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default AdminManagementPage;
