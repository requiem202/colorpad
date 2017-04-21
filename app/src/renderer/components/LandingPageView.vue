<template>
  <div>
      <ul>
          <li v-for="row in colors">
              <color-square v-for="(item, index) in row" v-model="row[index]"></color-square>
              <empty-square v-on:click.native="addItem(row)"></empty-square>
          </li>
      </ul>
      <div>
          <empty-square v-on:click.native="addRow()"></empty-square>
      </div>
  </div>
</template>

<script>
  import ColorSquare from './LandingPageView/ColorSquare'
  import EmptySquare from './LandingPageView/EmptySquare'
  const {dialog} = require('electron').remote
  const ipcRenderer = require('electron').ipcRenderer
  const fs = require('fs')
  const tinycolor = require('tinycolor2')
  let colors = []

  ipcRenderer.on('file-save', function () {
    dialog.showSaveDialog(
      {'defaultPath': 'mycolors.json'},
      function (fileName) {
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
      ColorSquare,
      EmptySquare
    },
    name: 'landing-page',
    data () {
      return {
        colors: colors
      }
    },
    methods: {
      addItem: function (row) {
        let color = '#ffffff'
        if (row.length >= 2) {
          // look at the trend of previous squares
          let s1 = tinycolor(row[row.length - 1].bgHex)
          let s2 = tinycolor(row[row.length - 2].bgHex)
          if (s1.isValid() && s2.isValid()) {
            let trend = s2.getBrightness() - s1.getBrightness()
            if (trend > 0) color = tinycolor(row[row.length - 1].bgHex).darken(10).toHexString()
            else color = tinycolor(row[row.length - 1].bgHex).lighten(10).toHexString()
          } else {
            color = tinycolor(row[row.length - 1].bgHex).lighten(10).toHexString()
          }
        } else if (row.length >= 1) {
          // Copy previous square and lighten it up
          color = tinycolor(row[row.length - 1].bgHex).lighten(10).toHexString()
        }
        row.push(
          {
            bgHex: color
          }
        )
      },
      addRow: function () {
        this.colors.push([
          {
            bgHex: tinycolor.random().toHexString()
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
        display: flex;
    }

</style>
