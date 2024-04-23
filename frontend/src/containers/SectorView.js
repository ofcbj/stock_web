import React, { Component } from 'react'
import axios from 'axios'
import { Card, Modal, Button, Select, Affix, message, Table, Divider, Row, Col, Drawer } from 'antd'
import { SearchOutlined, BarChartOutlined } from '@ant-design/icons'
import configData from '../config.json'
import '../custom.css'

import FinanceChart from '../components/FinanceChart'

const Option = Select.Option

class SectorView extends Component {
    state = {
        sectorList: [],
        sectorCompanyList: [],
        sectorFinanceList: [],
        financeChartVisible: false,
        financeChartCompany: '',
        financeChartData: null,
    }

    componentDidMount = () => {
        this.requestSectorList().then(res => {
            this.setState({
                sectorList : res
            })

            this.onChangeSector({'label': res[0]})
        })
    }

    onChangeValue = (key, value) => {
        this.setState({
            [key] : value
        })
    }    

    requestSectorList = () => {
        return new Promise((resolve, ) => {
            axios.post(`http://${configData.server}:${configData.port}/sector_list/`)
                .then(res => {
                    if (res.data.length > 0) {
                        let d = JSON.parse(res.data);
                        if (d.status === 'success') {
                            resolve(d.sectorList);
                        }
                        else {
                            console('error1')
                            Modal.error({
                                title: '입력 오류',
                                content: d.message
                            })
                        }
                    }
                })
                .catch(error => {
                    this.handleRequestError(error);
                })
        })
    }

    requestSectorCompanyList = (sector) => {
        return new Promise((resolve, ) => {
            axios.post(`http://${configData.server}:${configData.port}/sector_company_list/`,
                        {'sector': sector})
                .then(res => {
                    if (res.data.length > 0) {
                        let d = JSON.parse(res.data);
                        if (d.status === 'success') {
                            resolve({'companyList': d.companyList, 'financeList': JSON.parse(d.financeList)});
                        }
                        else {
                            console('error1')
                            Modal.error({
                                title: '입력 오류',
                                content: d.message
                            })
                        }
                    }
                })
                .catch(error => {
                    this.handleRequestError(error);
                })
        })
    }

    onChangeSector = (value) => {
        this.requestSectorCompanyList(value['label']).then(res => {
            this.setState({
                sectorCompanyList : res['companyList'],
                sectorFinanceList : res['financeList']
            })

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        })
    }

    onFinanceChartClick = (companyName) => {
        console.log(companyName);
        this.onChangeValue('financeChartCompany', companyName);
        this.onChangeValue('financeChartVisible', true);
        this.onChangeValue('financeChartData', this.getFinanceList(companyName));
    }    

    handleRequestError = (error) => {
        if (!error.response) {
            message.info('NETWORK ERROR');
        } else {
            const code = error.response.status
            if (code === 401) {
                sessionStorage.removeItem('api_key');
                message.info("로그인 세션이 종료되었습니다. 다시 로그인 해주세요.");
            }
        }
    }

    getFinanceList = (name) => {
        const { sectorFinanceList } = this.state
        const retRows = [];
        let found = false;
        for (let i = 0; i < sectorFinanceList.length; i++) {
          if (sectorFinanceList[i].name === name) {
            found = true;
            retRows.push(sectorFinanceList[i])
          } else {
            if (found === true)
                break
          }
        }
        return retRows;
    }    

    sectorCompanyRender = () => {
          const columns = [
            { title: '년도',        dataIndex: 'year',  key: 'year'},            
            { title: '자산',        dataIndex: 'asset', key: 'asset'},
            { title: '부채',        dataIndex: 'liability', key: 'liability'},
            { title: '유동부채',    dataIndex: 'payable', key: 'payable'},
            { title: '자본',        dataIndex: 'capital', key: 'capital'},
            { title: '유동자산',    dataIndex: 'liquidAsset', key: 'liquidAsset'},
            { title: '현금자산',    dataIndex: 'cashAsset', key: 'cashAsset'},
            { title: '재고',        dataIndex: 'inventory', key: 'inventory'},
            { title: '매출',        dataIndex: 'revenue', key: 'revenue'},
            { title: '매출원가',    dataIndex: 'cost', key: 'cost'},
            { title: '판관비',      dataIndex: 'expense', key: 'expense'},
            { title: '영업이익',    dataIndex: 'profit', key: 'profit'},
            { title: '순이익',      dataIndex: 'earning', key: 'earning'},
            { title: '매출현금흐름', dataIndex: 'operatingCashFlow', key: 'operatingCashFlow'},
            { title: '배당율',      dataIndex: 'dividend', key: 'dividend'},
            { title: '시총',        dataIndex: 'marketCap', key: 'marketCap'},
          ];

        const { sectorCompanyList } = this.state

        const cardList = [];
        let i;
        let dataLen = sectorCompanyList.length;
        for (i = 0; i < dataLen; i++) {
            let companyName = sectorCompanyList[i]
            let financeRows = this.getFinanceList(companyName)
            cardList.push(<Card key={i} style={{marginBottom: 20}} title={companyName}
                         extra = {<Button style={{marginLeft:10}} type="primary" icon={<BarChartOutlined />} onClick={() => this.onFinanceChartClick(companyName)}>차트보기</Button>}>
                <Table dataSource={financeRows} columns={columns} pagination={false} />
            </Card>);
        }

        return (<div>{cardList}</div>);
    }


    searchConditionRender = () => {
        const { sectorList } = this.state
        if (sectorList === undefined){
            return
        }

        return (
            <React.Fragment>
                <Affix>
                    <Select 
                        labelInValue={true}
                        style={{width: 180, marginLeft: 10, marginTop: 10}} 
                        defaultValue={{key: '0'}} 
                        onChange={this.onChangeSector}>
                        {sectorList.map((sector, index) => (
                            <Option key={index}>{sector}</Option>
                        ))}
                    </Select>
                </Affix>
            </React.Fragment>
        )
    }

    render() {
        const { financeChartVisible, financeChartCompany, financeChartData } = this.state;
        return (
            <div>
                <Drawer title={financeChartCompany} placement="right" closable={true} open={financeChartVisible} width={1200}
                    onClose={() => this.onChangeValue("financeChartVisible", false)} 
                >
                    <FinanceChart data={financeChartData} />
                </Drawer>
                {this.searchConditionRender()}
                <Divider></Divider> 
                <Row id="member_table" type="flex">
                    <Col span={24} order={1}>
                        {this.sectorCompanyRender()}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default SectorView;
