import React, { useState, useEffect } from 'react';
import { Layout, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import NavigationDrawer from './NavigationDrawer';
import UsersPage from '../../pages/UsersPage';
import GivePremiumPage from '../../pages/GivePremiumPage';

const { Header, Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  background: #fff;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleButton = styled(Button)`
  font-size: 16px;
  width: 40px;
  height: 40px;
  border: none;
  box-shadow: none;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const StyledContent = styled(Content)`
  margin: 0;
  padding: 0;
  background: #f5f5f5;
  
  @media (max-width: 768px) {
    margin-left: 0 !important;
  }
`;

const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedPage, setSelectedPage] = useState('users');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMenuClick = (key: string) => {
    setSelectedPage(key);
  };

  const handleMobileClose = () => {
    setCollapsed(true);
  };

  const renderPage = () => {
    switch (selectedPage) {
      case 'users':
        return <UsersPage />;
      case 'premium':
        return <GivePremiumPage />;
      default:
        return <UsersPage />;
    }
  };

  return (
    <StyledLayout>
      <NavigationDrawer
        collapsed={collapsed}
        selectedKey={selectedPage}
        onMenuClick={handleMenuClick}
        isMobile={isMobile}
        onMobileClose={handleMobileClose}
      />
      <Layout>
        <StyledHeader>
          <HeaderLeft>
            <ToggleButton
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
          </HeaderLeft>
        </StyledHeader>
        <StyledContent>
          {renderPage()}
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
};

export default DashboardLayout;
