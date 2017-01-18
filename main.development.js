import os from 'os'
import path from 'path'
import {app, autoUpdater, BrowserWindow, Menu, shell, ipcMain, dialog, Tray} from 'electron';
import {moveToApplications} from 'electron-lets-move';
import pkg from './package.json'
import Storage from 'electron-json-storage'

/*
* Basics
*/
let menu;
let mainWindow = null;
let settingsWindow = null;

if (process.env.NODE_ENV === 'development') {
    require('electron-debug')();
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

/*
* autoUpdater
*/
const menuTemplate = require('./menu');
const platform = os.platform() + '_' + os.arch(); // darwin_x64
const updateURL = `https://download.getcaption.co/update/${platform}/${pkg.version}`;

autoUpdater.on('checking-for-update', () => {
    console.log('Checking for updates...');
});

autoUpdater.on('update-not-available', () => {
    console.log(`You've got the latest version.`)

    // const options = {
    //     type: 'info',
    //     buttons: ['Ok'],
    //     title: "Caption",
    //     message: `You've got the latest version.`,
    //     detail: `Caption ${pkg.version}`
    // }
    //
    // dialog.showMessageBox(options)
})

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
    console.log(`update-downloaded`);
    console.log(event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate);

    const options = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: "Caption",
        message: `The new version has been downloaded. Please restart the application to apply the updates.`,
        detail: releaseName + "\n\n" + releaseNotes
    }
    const index = dialog.showMessageBox(options)

    if (index === 1) {
        return;
    }

    // restart app, then update will be applied
    quitAndUpdate();
});

autoUpdater.on('error', (error) => {
    console.log(error)
});

autoUpdater.on('update-available', () => {
    console.log('New Update Available!');
});

try {
    autoUpdater.setFeedURL(updateURL)
    autoUpdater.checkForUpdates()
}
catch (error) {
    console.log(error)
}

/*
* Extentions
*/
const installExtensions = async () => {
    if (process.env.NODE_ENV === 'development') {
        // eslint-disable-line global-require
        const installer = require('electron-devtools-installer');

        const extensions = [
            'REACT_DEVELOPER_TOOLS',
            'REDUX_DEVTOOLS'
        ];
        const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
        for (const name of extensions) {
            try {
                await installer.default(installer[name], forceDownload);
            } catch (e) {} // eslint-disable-line
        }
    }
};

/*
* Create Main Window
*/
const createMainWindow = () => {

    // Create the windows
    mainWindow = new BrowserWindow({
        center: true,
        show: true,
        width: 360,
        height: 440,
        minWidth: 300,
        minHeight: 300,
        vibrancy: 'dark',
        transparent: true,
        titleBarStyle: 'hidden-inset'
    });

    // Set URL
    mainWindow.loadURL(`file://${__dirname}/app/app.html`);

    // Events
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show();
        mainWindow.focus();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', async () => {

    if (process.env.NODE_ENV !== 'development') {
        /*
        * Let's Move
        */
        Storage.get('do-not-move', async (doNotMove) => {

            if (!doNotMove) {
                try {
                    const moved = await moveToApplications();
                    if (!moved) {
                        // the user asked not to move the app, it's up to the parent application
                        // to store this information and not hassle them again.
                        Storage.set('do-not-move', true, (error) => {
                            if (error) throw error
                        })
                    }
                } catch (error) {
                    // log error, something went wrong whilst moving the app.
                    console.log(error);
                }
            }
        });
    }

    /*
    * Extentions
    */
    await installExtensions();

    /*
    * MainWindow
    */
    createMainWindow();

    /*
    * IPC's
    */
    ipcMain.on('close-main', () => {
        mainWindow.close();
        app.quit();
    });

    ipcMain.on('lang-changed', () => {
        mainWindow.webContents.send('change-language')
    })

    /*
    * Downloads
    */
    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
        item.on('updated', (event, state) => {
            if (state === 'interrupted') {
                console.log('Download is interrupted but can be resumed')
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    console.log('Download is paused')
                } else {
                    console.log(`Received bytes: ${item.getReceivedBytes()}`)
                }
            }
        })

        item.once('done', (event, state) => {
            if (state === 'completed') {
                console.log('Download successfully')
            } else {
                console.log(`Download failed: ${state}`)
            }
        })
    });

    /*
    * Development
    */
    if (process.env.NODE_ENV === 'development') {
        mainWindow.openDevTools();
        mainWindow.webContents.on('context-menu', (e, props) => {
            const { x, y } = props;

            Menu.buildFromTemplate([{
                label: 'Inspect element',
                click() {
                    mainWindow.inspectElement(x, y);
                }
            }]).popup(mainWindow);
        });
    }

    /*
    * Menu
    */
    menu = Menu.buildFromTemplate(menuTemplate);
    mainWindow.setMenu(menu);

});
