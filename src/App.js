import React, { Component } from 'react';
import DeviceList from './DeviceList';
import 'antd/dist/antd.css'; 
import CopyRight from './CopyRight';
import './App.css'
import firebase from "firebase";


const os = window.require('os');
const {screen, ipcRenderer} = window.require('electron');

class App extends Component {

  constructor(){
    super();
    this.state = {
      apppath:''
    };
    ipcRenderer.on('got-app-path', (event, path) => {
      this.setState({
        apppath:path
      });
    });
  }
  componentDidMount(){
    var config = {
      apiKey: "AIzaSyCkzClbB4_6cM6wwiVH-ZwVhRlP3MzH6a0",
      authDomain: "woza-desktop.firebaseapp.com",
      databaseURL: "https://woza-desktop.firebaseio.com",
      projectId: "woza-desktop",
      storageBucket: "woza-desktop.appspot.com",
      messagingSenderId: "661510488857"
    };
    firebase.initializeApp(config);
  }

  handleGetAppPath(e){
    console.log(e);
    ipcRenderer.send('get-app-path');
  }



  render() {
    const size = screen.getPrimaryDisplay().size;

    return (
      <div className='App'>
        <DeviceList/>
        <CopyRight/>
          {/* <div>
            Home Dir: {os.homedir()} <br/>
            Screen is {size.width}px x {size.height}px <br/>
            <button onClick={this.handleGetAppPath.bind(this)}>Get app path</button> <br/>
            <span>App path: {this.state.apppath}</span>
          </div> */}
    </div>
    );
  }
}

export default App;
