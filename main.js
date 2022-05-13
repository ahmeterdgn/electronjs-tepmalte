const electron = require('electron');
const url = require('url');
const path = require('path');
const { Console } = require('console');

process.env.NODE_ENV = 'development';

const {app, BrowserWindow, Menu,ipcMain} = electron;


let mainwindow;
let addwindow;

// Listen App

app.on('ready', function(){
    mainwindow = new BrowserWindow({});
    mainwindow.loadURL(url.format({
        pathname:path.join(__dirname,'mainWindow.html'),
        protocol:'file:',
        slashes:true,
    }));

    mainwindow.on('closed',function(){
        app.quit();
    });

    const mainMenu = Menu.buildFromTemplate(mainMenuTelmpalte);
    Menu.setApplicationMenu(mainMenu);
});

function createAddWindow(){
    addwindow = new BrowserWindow({
        width:500,
        height:400,
        title:'Add ',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
          },        
    });
    addwindow.loadURL(url.format({
        pathname:path.join(__dirname,'addwindow.html'),
        protocol:'file:',
        slashes:true,
    }));


    addwindow.on('closed',function(){
        addwindow = null;
    });

}

ipcMain.on('item:add',function(e,item){
    mainwindow.webContents.send('item:add',item);
    addwindow.close();
});

// CREAT MENU TEMPLATE

const  mainMenuTelmpalte = [
    {
        label:'File',
        submenu:[
            {
                label: 'Add',
                click(){
                    createAddWindow();
                }
            },
            {
                label:'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

// 
if(process.platform == 'darwin'){
    mainMenuTelmpalte.unshift({});
}

if(process.env.NODE_ENV !== 'production'){
    mainMenuTelmpalte.push({
        label:'Developer Tools',
        submenu: [
            {
                label:'Toogle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item,focusesWin){
                    focusesWin.toggleDevTools();
                }
            },
            {
                role: 'reload',
            }
        ]
    });
}