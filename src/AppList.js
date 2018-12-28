import React, { Component } from 'react';
import { List, Card, Avatar, Icon, Button, Modal, message } from 'antd';
import { Input } from 'antd';
const { TextArea } = Input;

const {ipcRenderer} = window.require('electron');
  
class AppList extends Component {

    constructor(){
        super();
        this.state = {
            allApps:[],
            apps:[], // after filter
            dumping:false,
            modalVisible:false,
            info:'',
            modalDoneText:'woza...',
            filter:'',
        };
        ipcRenderer.on('get-apps',(event,apps) => {
            this.setState({
                allApps: apps,
                apps: apps
            });
        });

        ipcRenderer.on('dump-app-state',(event,type,message,object) => {
            console.log(`type=${type},message=${message},object=${object}`);

            switch(type){
                // succeed
                case 0:{
                    this.setState({ 
                        dumping:false,
                        modalDoneText:'woza succeed'
                    });
                    this.addLine('🌈Succeed');
                    break;
                }
                // failed
                case 1:{
                    this.setState({ 
                        dumping:false,
                        modalDoneText:'woza Failed'
                    });
                    this.addLine('😢Failed');
                    break;
                }
                // info
                case 2:{
                    this.addLine(`> ${message}`);
                    break;
                }
                case 3:{
                    this.addLine(`.app path: ${object}`);
                    break;
                }
                case 4:{
                    this.addLine(`dump ${object.from} -> ${object.to}`);
                    break;
                }
                case 5:{
                    this.addLine(`dump succeed`);
                    break;
                }
                default:{
                    this.addLine(`unknown message`);
                    break;
                }
            }
        });
    }

    addLine(logline){
        let curinfo = this.state.info;
        curinfo = curinfo + "\n";
        curinfo = curinfo + logline;

        this.setState({
            info:curinfo
        });
        
        if(this.textarea){
            this.textarea.textAreaRef.scrollTop=this.textarea.textAreaRef.scrollHeight;
        }
    }

    componentDidMount(){
        if(this.props.deviceId){
            ipcRenderer.send('get-apps',this.props.deviceId);
        }
    }

    onAppStartDump(appIdentifier){
        // reset
        this.setState({
            info:'',
            modalDoneText:'woza...',
            dumping:true,
            modalVisible:true
        });

        this.addLine(`start to dump:`)
        this.addLine(`device id : ${this.props.deviceId}`);
        this.addLine(`app identifier : ${appIdentifier}`);

        ipcRenderer.send('start-dump-app',this.props.deviceId, appIdentifier);
    }
    
    handleDumpOK(){
        console.log(`dump ok`);

        this.setState({ modalVisible:false });
    }
    handleDumpCancel(){
        console.log(`dump cancel`);
        if(this.state.dumping){
            message.info('woza can not stop...')
        }else{
            this.setState({ modalVisible:false });
        }
    }

    handleInputChange(e){
        let filter = e.target.value;

        this.setState({
            filter:filter
        });

        let apps = this.state.allApps.filter((app) => {
            if (filter.length === 0) {
                return true;
            }
            if (app.name.indexOf(filter) !== -1){
                return true;
            }

            if (app.identifier.indexOf(filter) !== -1){
                return true;
            }

            return false;
        });
        this.setState({
            apps:apps
        });
    }

    render(){

        return (
            <div>
                <Input 
                placeholder="Type to filter" 
                onChange={this.handleInputChange.bind(this)} 
                value={this.state.filter}
                />
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.apps}
                    renderItem={app => (
                    <List.Item>
                        <List.Item.Meta
                        title={app.name}
                        description={app.identifier}
                        />
                        <Button type="dashed" onClick={()=> this.onAppStartDump(app.identifier)}>woza</Button>
                    </List.Item>
                    )}
                />   
                <Modal
                visible={this.state.modalVisible}
                title="woza..."
                onOk={this.handleDumpOK.bind(this)}
                onCancel={this.handleDumpCancel.bind(this)}
                footer={[
                    <Button key="submit" type="primary" loading={this.state.dumping} onClick={this.handleDumpOK.bind(this)}>
                        {this.state.modalDoneText}
                    </Button>
                ]}
                >
                    <TextArea rows={12} value={this.state.info}
                    ref={(textarea) => this.textarea = textarea}
                    />
                </Modal>
            </div>
        )
    }
}

export default AppList;
