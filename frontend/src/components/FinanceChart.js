import React, { Component } from 'react';
import { Column } from '@antv/g2plot';

class FinanceChart extends Component {
  constructor(props) {
    super(props);
    this.chartRefs =  Array(4).fill().map(() => React.createRef());
  }

  componentDidMount = () => {
    this.createCharts();
  }

  componentWillUnmount = () => {
    this.charts.forEach(chart => {
      chart.destroy();
    });
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.data !== this.props.data) {
      this.charts.forEach(chart => {
        chart.destroy();
      });
      this.createCharts();
    }
  }  

  createCharts = () => {
    const { data } = this.props;

    const fields = ['revenue', 'capital', 'profit', 'earning']
    this.charts = fields.map((field, index) => {
      const chart = new Column(this.chartRefs[index].current, {
        data: data,
        xField: 'year',
        yField: field,
        label: {
          position: 'middle',
          style: {
            fill: '#FFFFFF',
            opacity: 0.6
          }
        }
      });
      chart.render();
      return chart;
    });
  }

  render() {
    const titles = ['매출', '자본', '영업이익', '순이익'];    
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', height: '100%', gap: '10px' }}>
        {this.chartRefs.map((ref, index) => (
          <div key={index} style={{ width: '100%', height: '85%' }}>
            <h3 style={{ textAlign: 'center' }}>{titles[index]}</h3>
            <div key={index} ref={ref} style={{ width: '100%', height: '100%' }} />
          </div>
        ))}
      </div>
    );
  }
}

export default FinanceChart;
