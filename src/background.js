'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

let win_db

ipcMain.on('douban', (event, arg) => {
  win_db = new BrowserWindow({
    width: 1800,
    height: 600,
    // frame: false,
    menu: null,
    webPreferences: {
      devTools: true
    }
  })
  win_db.loadURL('https://accounts.douban.com/passport/login')
  win_db.webContents.openDevTools()
  let webContents = win_db.webContents
  webContents.on('will-navigate', event => {
    event.sender.send('douban-log', 'will-navigate')
    // webContents.session.cookies.get({}, function(err, cookies) {
    //   if (err) {
    //     win_db.close() // 关闭登陆窗口
    //     // return reject(err)
    //   }
    //   event.sender.send('douban-log', cookies)

    //   event.preventDefault()
    //   win_db.close()
    // })
  })
  webContents.on('did-navigate', (e, url) => {
    console.log('did-navigate', url)
    event.sender.send('douban-log', 'did-navigate')
  })
  webContents.on(
    'did-frame-navigate',
    (
      e,
      url,
      httpResponseCode,
      httpStatusText,
      isMainFrame,
      frameProcessId,
      frameRoutingId
    ) => {
      console.log('did-frame-navigate', url)
      if (url === 'https://www.douban.com/') {
        webContents.session.cookies.get({}, function(err, cookies) {
          if (err) {
            win_db.close() // 关闭登陆窗口
            // return reject(err)
          }
          event.sender.send('douban-log', cookies)

          event.preventDefault()
          win_db.close()
        })
      }
      event.sender.send('douban-log', 'did-frame-navigate')
    }
  )
  // webContents.on('did-start-navigation', () => {
  //   event.sender.send('douban-log', 'did-start-navigation')
  // })
  // webContents.on('did-navigate-in-pag', () => {
  //   event.sender.send('douban-log', 'did-navigate-in-pag')
  // })
  // webContents.on('did-redirect-navigation', function() {
  //   event.sender.send('douban-log', 'redirect')
  //   // 这里可以看情况进行参数的传递，获取制定的 cookies
  //   webContents.session.cookies.get({}, function(err, cookies) {
  //     if (err) {
  //       win_db.close() // 关闭登陆窗口
  //       // return reject(err)
  //     }
  //     event.sender.send('douban-log', cookies)
  //   })
  // })
  // const ses = win_db.webContents.session
  event.sender.send('douban-log', 'hhh')
})

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      secure: true,
      standard: true
    }
  }
])

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
