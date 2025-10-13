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
  Modal
} from 'antd';
import { SearchOutlined, CrownOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import type { User } from '../types';
import { useUsers, useGivePremium } from '../hooks/useUsers';

const { Title } = Typography;

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
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
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

const GivePremiumPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const { data, isLoading, error } = useUsers({
    page: 1,
    limit: 100,
    search: searchQuery || undefined,
  });
  
  const givePremiumMutation = useGivePremium();

  const columns: any[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      responsive: ['md'] as any,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <span style={{ fontWeight: 500 }}>{email}</span>
      ),
    },
    {
      title: 'Premium Status',
      dataIndex: 'hasPremium',
      key: 'hasPremium',
      width: 120,
      render: (hasPremium: boolean) => (
        <Tag color={hasPremium ? 'gold' : 'default'}>
          {hasPremium ? 'Premium' : 'Free'}
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
    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: (_: any, record: User) => (
        <Button
          type="primary"
          size="small"
          icon={<CrownOutlined />}
          disabled={record.hasPremium}
          onClick={() => handleGivePremium(record)}
        >
          {record.hasPremium ? 'Already Premium' : 'Give Premium'}
        </Button>
      ),
    },
  ];

  const handleSearch = () => {
    // The query will automatically refetch when searchQuery changes
  };

  const handleGivePremium = (user: User) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleConfirmGivePremium = async () => {
    if (!selectedUser) return;

    try {
      const result = await givePremiumMutation.mutateAsync(selectedUser.id);
      if (result.success) {
        message.success(result.message);
        setModalVisible(false);
        setSelectedUser(null);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Failed to give premium');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  // Show error message if there's an error
  if (error) {
    message.error('Failed to fetch users');
  }

  return (
    <PageContainer>
      <PageHeader>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          Give Premium
        </Title>
      </PageHeader>

      <FilterCard>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search by email (gmail or icloud)"
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
          dataSource={data?.users || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
            responsive: true,
            size: 'small',
          }}
          scroll={{ x: 600 }}
        />
      </Card>

      <Modal
        title="Give Premium Access"
        open={modalVisible}
        onOk={handleConfirmGivePremium}
        onCancel={handleModalCancel}
        confirmLoading={givePremiumMutation.isPending}
        okText="Give Premium"
        cancelText="Cancel"
        okButtonProps={{ 
          icon: <CrownOutlined />,
          type: 'primary'
        }}
      >
        {selectedUser && (
          <div>
            <p>Are you sure you want to give premium access to:</p>
            <div style={{ 
              padding: '16px', 
              background: '#f5f5f5', 
              borderRadius: '6px',
              margin: '16px 0'
            }}>
              <Space direction="vertical" size="small">
                <div>
                  <UserOutlined style={{ marginRight: '8px' }} />
                  <strong>Email:</strong> {selectedUser.email}
                </div>
                <div>
                  <strong>Current Status:</strong> 
                  <Tag color={selectedUser.hasPremium ? 'gold' : 'default'} style={{ marginLeft: '8px' }}>
                    {selectedUser.hasPremium ? 'Premium' : 'Free'}
                  </Tag>
                </div>
              </Space>
            </div>
            <p style={{ color: '#666', fontSize: '14px' }}>
              This action will grant premium access to the user and cannot be undone.
            </p>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default GivePremiumPage;
