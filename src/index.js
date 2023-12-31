import React from 'react';
import ReactDOM from 'react-dom/client';
const root = ReactDOM.createRoot(document.getElementById('root'));
import Task from './views/Task';
import './assets/reset.min.css'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN';
import './index.less'
root.render(
  <ConfigProvider locale={zhCN}>
    <Task></Task>
  </ConfigProvider>
);
