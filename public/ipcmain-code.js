const {app, BrowserWindow, ipcMain} = require('electron')
const woza = require('woza');
const path = require('path');
const frida = require('frida');

ipcMain.on('get-app-path', (event) => {
  event.sender.send('got-app-path',app.getAppPath());
});

ipcMain.on('get-device-list', (event) => {
  woza.Core.getDeviceList()
  .then((devices) => {
    let res = [];
    for(const device of devices){
      res.push({
        id:device.id,
        name:device.name
      });
    }
    event.sender.send('get-device-list',res);
  }).catch( e => {
    event.sender.send('get-device-list','failed');
  });
});

ipcMain.on('listen-on-device-change', (event) => {
  const manager = frida.getDeviceManager();
  manager.added.connect((device) => {
    console.log(`device added :${device}`);
    if(device.type === 'usb'){
      event.sender.send('on-device-changed',{ });
    }
  });
  manager.removed.connect((device) => {
    console.log(`device removed :${device}`);
    if(device.type === 'usb'){
      event.sender.send('on-device-changed',{ });
    }
  });

});

ipcMain.on('get-apps',(event,deviceId) => {
  console.log(`device id tapped : ${deviceId}`);

  woza.Core.getDeviceList()
  .then((devices)=>{
    let gotDevice;
    for(const device of devices){
      if(device.id === deviceId){
        gotDevice = device;
        break;
      }
    }
    if(!gotDevice){
      console.log(`No pair device for ${deviceId}`);
      return;
    }

    woza.Core.getApplicationList(gotDevice)
    .then((apps) => {
      let res = [];
      for(const app of apps){
        res.push({
          pid:app.pid,
          name:app.name,
          identifier:app.identifier,
          icon: {
            width: app.icon?app.icon.width:0,
            height: app.icon?app.icon.height:0,
            rowstride: app.icon?app.icon.rowstride:0,
            pixels: app.icon?app.icon.pixels:undefined
          }
        });
      }
      event.sender.send('get-apps',res)
    });
  });
});

ipcMain.on('start-dump-app',(event,deviceId,appIdentifier) => {
  woza.Core.getDeviceList()
  .then((devices)=>{
    let gotDevice;
    for(const device of devices){
      if(device.id === deviceId){
        gotDevice = device;
        break;
      }
    }
    if(!gotDevice){
      console.log(`No pair device for ${deviceId}`);
      return;
    }

    const targetDir = app.getPath('desktop');
    const ipaPath = path.join(targetDir, appIdentifier + '.ipa');

    const hammer = new woza.Hammer();
    hammer.ipaPath = ipaPath;
    hammer.onMessage = (type, message, object) => {
      event.sender.send('dump-app-state',type,message,object);
    };
    hammer.dumpApplicationInDevice(gotDevice, appIdentifier);
  });
});
