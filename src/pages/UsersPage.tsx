import React, { useState } from 'react';
import { 
  Table, 
  Input, 
  Select, 
  Button, 
  Space, 
  Typography, 
  Tag, 
  message,
  Card,
  Row,
  Col
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useUsers } from '../hooks/useUsers';

const { Title } = Typography;
const { Option } = Select;

const PageContainer = styled.div`
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const FilterCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: #fafafa;
    font-weight: 600;
  }
`;

const UsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [premiumFilter, setPremiumFilter] = useState<boolean | null>(null);
  
  const { data, isLoading, error } = useUsers({
    page: 1,
    limit: 100,
    search: searchQuery || undefined,
    hasPremium: premiumFilter !== null ? premiumFilter : undefined,
  });

  const columns: any[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
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
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const handleSearch = () => {
    // The query will automatically refetch when searchQuery changes
    // due to the dependency in the useUsers hook
  };

  const handlePremiumFilter = (value: boolean | null) => {
    setPremiumFilter(value);
    // The query will automatically refetch when premiumFilter changes
  };

  const handleReset = () => {
    setSearchQuery('');
    setPremiumFilter(null);
  };

  // Show error message if there's an error
  if (error) {
    message.error('Failed to fetch users');
  }

  return (
    <PageContainer>
      <PageHeader>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          Users Management
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
            <Select
              placeholder="Filter by Premium"
              value={premiumFilter}
              onChange={handlePremiumFilter}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value={true}>Premium Users</Option>
              <Option value={false}>Free Users</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={10}>
            <Space>
            <Button 
              type="primary" 
              onClick={handleSearch}
              loading={isLoading}
              icon={<SearchOutlined />}
            >
              Search
            </Button>
            <Button 
              onClick={handleReset}
              icon={<ReloadOutlined />}
            >
              Reset
            </Button>
            </Space>
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
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </PageContainer>
  );
};

export default UsersPage;
