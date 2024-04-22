import React from 'react';
import { Layout, Menu } from 'antd';
//import 'antd/dist/antd.css'

import SectorView from './containers/SectorView'

const { Content, Footer, Sider } = Layout;

class App extends React.Component {
  onContentScroll = (event) => {
    event.stopPropagation(); // Content 영역에서의 스크롤 이벤트 버블링을 막음
  };

  memberRender = () => {
    return (    
      <div style={{ background: '#fff', padding: 24, minHeight: 800 }}>
        {<SectorView refreshCallback={this.forceUpdate.bind(this)}/>}
      </div>
    )
  }

  render() {
        return (
          <Layout className="layout">
            <Sider width='200' collapsible style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
              <div className="logo" />
              <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1">
                  섹터별 기업 정보
                </Menu.Item>
                <Menu.Item key="2">
                  Etc
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout className="site-layout" style={{marginLeft:'150px'}}>
              <Content style={{ padding: '0 50px'}} onWheel={this.onContentScroll}>
                {this.memberRender()}
              </Content>
              <Footer style={{ textAlign: 'center' }}>
              </Footer>
            </Layout>
          </Layout>
    );
  }
}

export default App;

