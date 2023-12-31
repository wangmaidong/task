import React from "react";
import './Task.less'
import { Button, Table, Popconfirm, Modal, Form, Input, DatePicker, Tag, message } from 'antd'
import { getTaskList, addTask, removeTask, completeTask } from '@/api/index.js'
const { TextArea } = Input;
/* 对日期处理的方法 */
const zero = function zero(text) {
    text = String(text);
    return text.length < 2 ? '0' + text : text;
};
const formatTime = function formatTime(time) {
    let arr = time.match(/\d+/g),
        [, month, day, hours = '00', minutes = '00'] = arr;
    return `${zero(month)}-${zero(day)} ${zero(hours)}:${zero(minutes)}`;
};
class Task extends React.Component {
    columns = [
        {
            title: '编号',
            dataIndex: 'id',

        },
        {
            title: '任务描述',
            dataIndex: 'task',

        },
        {
            title: '状态',
            dataIndex: 'state',
            render: (text, record, index) => {
                return text === 1 ? '未完成' : '已完成'
            }
        },
        {
            title: '完成时间',
            dataIndex: 'time',
            render: (text, record, index) => {
                let { state, time, complete } = record
                if (state === 2) time = complete
                return formatTime(time)
            }
        },
        {
            title: '操作',
            render: (text, record, index) => {
                let { id, state } = record
                return (<>
                    <Popconfirm
                        description="您确定要删除此任务吗？"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={this.handelRemove.bind(null, id)}
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>

                    {state === 1 ? (
                        <Popconfirm
                            description="您确把此任务设置为完成吗？"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={this.handleUpdate.bind(null, id)}
                        >
                            <Button type="link">完成</Button>
                        </Popconfirm>
                    ) : null}
                </>)
            }
        },

    ]
    state = {
        data: [],
        isModalOpen: false,
        tableLoading: false,
        selectedIndex: 0,
        submitLoading: false
    }
    handelRemove = async (id) => {
        try {
            await removeTask(id)
            this.queryData()
        } catch (error) {

        }
    }
    handleUpdate = async (id) => {
        try {
            await completeTask(id)
            this.queryData()
        } catch (error) {

        }
    }
    handleOk = async () => {
        try {
            await this.formRef.validateFields()
            this.setState({
                submitLoading: true
            })
            let formdata = this.formRef.getFieldsValue()
            let { task, complete } = formdata
            complete = complete.format("YYYY-MM-DD HH:mm:ss")
            let res = await addTask(task, complete)
            let { code, codeText } = res
            if (+code === 0) {
                this.queryData()
                this.handleCancel()
                message.success('添加成功')
            } else {
                message.error(codeText)
            }
        } catch (error) {

        }
        this.setState({
            submitLoading: false,
        })
    }
    handleCancel = () => {
        this.setState({
            isModalOpen: false
        })
        this.formRef.resetFields()
    }
    handleAddTask = () => {
        this.setState({
            isModalOpen: true
        })
    }
    queryData = async () => {
        let { selectedIndex } = this.state
        this.setState({
            tableLoading: true
        })
        try {
            let data = await getTaskList(selectedIndex)
            let { code, list } = data
            if (+code === 0) {
                this.setState({
                    data: list
                })
            }
        } catch (error) {

        }
        this.setState({
            tableLoading: false
        })

    }
    handleStateSelect = (state) => {
        if (this.state.selectedIndex === state) return;
        this.setState({
            selectedIndex: state
        }, () => {
            this.queryData()
        })
    }
    render() {
        let { data, isModalOpen, tableLoading, selectedIndex, submitLoading } = this.state
        console.log('render')
        return (
            <>
                <div className="taskbox">
                    <div className="taskheader">
                        <h1>TASK OA 任务管理系统</h1>
                        <Button type="primary" onClick={this.handleAddTask}>新增任务</Button>
                    </div>
                    <div className="taskbtn">
                        {['全部', '未完成', '已完成'].map((item, index) => {
                            return (
                                <Tag
                                    key={index}
                                    color={index === selectedIndex ? "#108ee9" : ''}
                                    onClick={this.handleStateSelect.bind(null, index)}
                                >
                                    {item}
                                </Tag>)
                        })}
                    </div>
                    <div className="taskcontent">
                        <Table
                            columns={this.columns}
                            dataSource={data}
                            pagination={false}
                            loading={tableLoading}
                            rowKey='id'
                        />
                        <Modal
                            title="新增任务窗口"
                            open={isModalOpen}
                            okText="提交信息"
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            okButtonProps={{
                                loading: submitLoading
                            }}
                        >
                            <Form layout="vertical" ref={x => this.formRef = x}>
                                <Form.Item
                                    label="任务描述"
                                    name="task"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入任务描述',
                                        },
                                    ]}
                                    validateTrigger='onBlur'
                                >
                                    <TextArea rows={4}></TextArea>
                                </Form.Item>
                                <Form.Item
                                    label="任务预期完成时间"
                                    name="complete"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择时间',
                                        },
                                    ]}
                                    validateTrigger='onBlur'
                                >
                                    <DatePicker />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>
                </div>

            </>
        )
    }
    componentDidMount() {
        this.queryData()
    }
}
export default Task