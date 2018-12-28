import React, { Component } from 'react';
import { Tabs } from 'antd';
import AppList from './AppList';
const {ipcRenderer} = window.require('electron');

const TabPane = Tabs.TabPane;

class DeviceList extends Component {
    constructor(){
        super();

        this.state = {
            devices: [],
            msg:''
        };

        // get device list
        ipcRenderer.on('get-device-list', (event, devices) => {
            if(devices === 'failed'){
                this.setState({
                    msg:'Found 0 device'
                });
            }
            this.setState({
                devices: devices
            });
        });

        // device change event
        ipcRenderer.on('on-device-changed', (event, devices) => {
            ipcRenderer.send('get-device-list');
        });

        // get once
        ipcRenderer.send('get-device-list');
        // listen
        ipcRenderer.send('listen-on-device-change');
    }

    onTabChanged(key){
        console.log(`tab changed : ${key}`);
    }

    render(){
        const deviceElements = [];
        for(let device of this.state.devices){
            deviceElements.push(
                <TabPane tab={device.name} key={device.id}>
                    <AppList deviceId={device.id}/>
                </TabPane>
            );
        }

        if(deviceElements.length === 0){
            return <div>Found 0 Device</div>
        }else{
            return (
                <Tabs defaultActiveKey="1" onChange={this.onTabChanged.bind(this)}>
                    {deviceElements}
                </Tabs>
            )
        }
    }
}

export default DeviceList;
