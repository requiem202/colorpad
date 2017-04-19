<template>
  <div>
      <ul>
          <li v-for="row in colors">
              <color-square v-for="(item, index) in row" v-model="row[index]"></color-square>
              <a href="#" v-on:click="addItem(row)">Add</a>
          </li>
      </ul>
      <div>
        <a href="#" v-on:click="addRow()">Add</a>
      </div>
  </div>
</template>

<script>
  import ColorSquare from './LandingPageView/ColorSquare'
  const {dialog} = require('electron').remote
  const ipcRenderer = require('electron').ipcRenderer
  const fs = require('fs')
  let colors = []

  ipcRenderer.on('file-save', function () {
    dialog.showSaveDialog(function (fileName) {
      if (fileName === undefined) return

      fs.writeFile(fileName, JSON.stringify(colors), function (err) {
        if (err) {
          throw err
        }
      })
    })
  })
  ipcRenderer.on('file-open', function () {
    dialog.showOpenDialog(function (fileNames) {
      if (fileNames === undefined) return

      let fileName = fileNames[0]

      fs.readFile(fileName, 'utf-8', function (err, data) {
        if (err) {
          throw err
        }
        let tmp = JSON.parse(data)
        colors.splice(0, 1)
        tmp.forEach(function (item, index) {
          colors.push(tmp[index])
        })
      })
    })
  })

  export default {
    components: {
      ColorSquare
    },
    name: 'landing-page',
    data () {
      return {
        colors: colors
      }
    },
    methods: {
      addItem: function (row) {
        row.push(
          {
            bgHex: '#ffffff'
          }
        )
      },
      addRow: function () {
        this.colors.push([
          {
            bgHex: '#ffffff'
          }
        ])
      }
    },
    created: function () {
      if (this.colors.length === 0) {
        this.addRow()
      }
    }
  }
</script>

<style scoped>
    img {
    margin-top: -25px;
    width: 450px;
    }
    ul {
        list-style: none;
        clear: both;
        display: block;
    }

    ul li {
        clear: both;
        display: block;
    }
</style>
