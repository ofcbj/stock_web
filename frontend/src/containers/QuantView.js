import React, { Component } from 'react'
import axios from 'axios'
import { Card, Modal, Button, Select, Affix, message, Table, Divider, Row, Col, Drawer } from 'antd'
import { BarChartOutlined } from '@ant-design/icons'
import configData from '../config.json'
import '../custom.css'

import FinanceChart from '../components/FinanceChart'

const Option = Select.Option

class QuantView extends Component {
    state = {
    }

    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
    }

    onChangeValue = (key, value) => {
        this.setState({
            [key] : value
        })
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

    render() {
        return (
            <div>
                Constructing
            </div>
        )
    }
}

export default QuantView;
