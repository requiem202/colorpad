<template>
  <div>
      <transition-group name="colors" tag="ul">
          <transition-group name="colors-row" tag="li" v-for="row in colors" v-bind:key="row" class="colors-row">
              <color-square v-for="(item, index) in row" v-model="row[index]" v-bind:key="item" class="colors-row-item"></color-square>
              <empty-square v-on:click.native="addItem(row)" v-bind:key="row"></empty-square>
          </transition-group>
      </transition-group>
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
    ul {
        list-style: none;
        clear: both;
        display: block;
    }

    .colors-row {
        clear: both;
        display: flex;
        transition: all 0.25s ease-out;
    }
    .color-square.colors-row-item {
        /* replace .color-square*/
        transition: all 0.25s ease-out, backgroud-color 0.25s linear;
    }
    .colors-enter, .colors-leave-to {
        opacity: 0;
        transform: translateY(-30px);
    }
    .colors-row-enter-active, .colors-row-leave-to {
        opacity: 0;
        transform: translateX(-30px);
    }
</style>
