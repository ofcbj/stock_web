import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

//import 'antd/dist/antd.css'

import SectorView from './containers/SectorView'
import QuantView from './containers/QuantView'

const { Content, Footer, Sider } = Layout;

class SectorPage extends Component {
  render() {
    return <div style={{ background: '#fff', padding: 24, minHeight: 800 }}>
      {<SectorView refreshCallback={this.forceUpdate.bind(this)}/>}
    </div>
  }
}

class QuantPage extends Component {
  render() {    
    return <div style={{ background: '#fff', padding: 24, minHeight: 800 }}>
      {<QuantView refreshCallback={this.forceUpdate.bind(this)}/>}
    </div>
  }
}  

class App extends React.Component {
  onContentScroll = (event) => {
    event.stopPropagation(); // Content 영역에서의 스크롤 이벤트 버블링을 막음
  };

  render() {
        return (
          <Router>
            <Layout className="layout">
              <Sider width='200' collapsible style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
                <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                  <Menu.Item key="1">
                    <Link to="/sector-info">섹터별 기업 정보</Link>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Link to="/quant-info">퀀트 분석</Link>
                  </Menu.Item>
                </Menu>
              </Sider>
              <Layout className="site-layout" style={{marginLeft:'150px'}}>
                <Content style={{ padding: '0 50px'}} onWheel={this.onContentScroll}>
                  <Routes>
                    <Route path="/" element={<SectorPage />} />
                    <Route path="/sector-info" element={<SectorPage />} />
                    <Route path="/quant-info" element={<QuantPage />} />
                  </Routes>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                </Footer>
              </Layout>
            </Layout>
          </Router>
    );
  }
}

export default App;

