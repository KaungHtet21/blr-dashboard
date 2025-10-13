import React from 'react';
import { Layout, Menu, Button, Typography, Avatar, Drawer } from 'antd';
import { 
  UserOutlined, 
  CrownOutlined, 
  LogoutOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';

const { Sider } = Layout;
const { Text } = Typography;

const StyledSider = styled(Sider)`
  background: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  
  .ant-layout-sider-trigger {
    background: #f0f2f5;
    color: #1890ff;
    border-top: 1px solid #f0f0f0;
  }

  @media (max-width: 768px) {
    position: fixed !important;
    height: 100vh;
    z-index: 1000;
  }
`;

const LogoContainer = styled.div`
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
`;

const UserInfo = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
  text-align: center;
`;

const LogoutButton = styled(Button)`
  width: 100%;
  margin: 16px;
  border-radius: 6px;
`;

interface NavigationDrawerProps {
  collapsed: boolean;
  selectedKey: string;
  onMenuClick: (key: string) => void;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  collapsed,
  selectedKey,
  onMenuClick,
  isMobile = false,
  onMobileClose,
}) => {
  const { logout, user } = useAuth();

  const menuItems = [
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users Management',
    },
    {
      key: 'premium',
      icon: <CrownOutlined />,
      label: 'Give Premium',
    },
  ];

  const handleMenuClick = (key: string) => {
    onMenuClick(key);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const drawerContent = (
    <>
      <LogoContainer>
        {!collapsed ? (
          <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
            BLR Dashboard
          </Text>
        ) : (
          <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
            BLR
          </Text>
        )}
      </LogoContainer>

      <UserInfo>
        <Avatar 
          size={collapsed ? 32 : 48} 
          icon={<UserOutlined />} 
          style={{ backgroundColor: '#1890ff', marginBottom: collapsed ? 0 : 8 }}
        />
        {!collapsed && (
          <div>
            <div>
              <Text strong style={{ fontSize: '14px' }}>
                {user?.email}
              </Text>
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Administrator
            </Text>
          </div>
        )}
      </UserInfo>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({ key }) => handleMenuClick(key)}
        style={{ border: 'none' }}
      />

      <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <LogoutButton
          type="text"
          danger
          icon={<LogoutOutlined />}
          onClick={logout}
        >
          {!collapsed && 'Logout'}
        </LogoutButton>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        title="BLR Dashboard"
        placement="left"
        onClose={onMobileClose}
        open={!collapsed}
        width={250}
        bodyStyle={{ padding: 0 }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <StyledSider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      collapsedWidth={80}
    >
      {drawerContent}
    </StyledSider>
  );
};

export default NavigationDrawer;
