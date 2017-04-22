'use strict'

import { app, BrowserWindow, Menu } from 'electron'

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // eslint-disable-next-line no-console
  console.log('mainWindow opened')

  const template = [
    {
      label: 'File',
      submenu: [
        { role: 'open',
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: function () {
            let focusedWindow = BrowserWindow.getFocusedWindow()
            focusedWindow.webContents.send('file-open')
          }
        },
        { role: 'save',
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: function () {
            let focusedWindow = BrowserWindow.getFocusedWindow()
            focusedWindow.webContents.send('file-save')
          }
        },
        { role: 'export',
          label: 'Export',
          accelerator: 'CmdOrCtrl+E',
          click: function () {
            let focusedWindow = BrowserWindow.getFocusedWindow()
            focusedWindow.webContents.send('file-export')
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'pasteandmatchstyle'},
        {role: 'delete'},
        {role: 'selectall'}
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'openlibrary',
          label: 'Library',
          accelerator: 'CmdOrCtrl+L',
          click: function () {
            let focusedWindow = BrowserWindow.getFocusedWindow()
            focusedWindow.webContents.send('open-library')
          }
        },
        {type: 'separator'},
        {role: 'reload'},
        {role: 'forcereload'},
        {role: 'toggledevtools'},
        {type: 'separator'},
        {role: 'togglefullscreen'}
      ]
    }
  ]
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {role: 'services', submenu: []},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
