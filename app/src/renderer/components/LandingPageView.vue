<template>
  <div class="main">
      <transition name="slideIn">
          <div class="library" v-show="showLibrary">
            <library v-bind:collection="library" v-bind:currentId="currentId"></library>
          </div>
      </transition>
      <div class="workspace">
          <transition-group name="colors" tag="ul">
              <transition-group name="colors-row" tag="li" v-for="row in colors()" v-bind:key="row" class="colors-row">
                  <color-square
                          v-for="(item, index) in row"
                          v-model="row[index]"
                          v-bind:key="item"
                          v-on:del="delItem(row, item, index)"
                          class="colors-row-item">
                  </color-square>
                  <empty-square v-on:click.native="addItem(row)" v-bind:key="row"></empty-square>
              </transition-group>
          </transition-group>
          <div>
              <empty-square v-on:click.native="addRow()"></empty-square>
          </div>
      </div>
  </div>
</template>

<script>
  import ColorSquare from './LandingPageView/ColorSquare'
  import EmptySquare from './LandingPageView/EmptySquare'
  import Library from './Library'
//  const {dialog} = require('electron').remote
  const ipcRenderer = require('electron').ipcRenderer
//  const fs = require('fs')
  const guid = require('guid')
  const tinycolor = require('tinycolor2')
  const storage = require('electron-json-storage')
  const USER_LIBRARY = 'userLibrary'

  let _isEmptyObject = function (obj) {
    for (let p in obj) {
      return false
    }
    return true
  }

  let library = {}
  let currentId = ''
//  let colors = []

//  storage.set(USER_LIBRARY, {library: library}, function (error) {
//    if (error) throw error
//  })
//  storage.clear(function (error) {
//    if (error) throw error
//  })
  storage.get(USER_LIBRARY, function (error, data) {
    if (error) throw error

//    console.log(data)
    if (!data) return
    library = data.library
  })

  let newCollection = function () {
    return {
      id: guid.raw(),
      name: 'Untitled collection',
      colors: [[
        {
          bgHex: tinycolor.random().toHexString()
        }
      ]]
    }
  }
  if (_isEmptyObject(this.library)) {
    let collection = newCollection()
    library[collection.id] = collection
    currentId = collection.id
  }

//  ipcRenderer.on('file-save', function () {
//    dialog.showSaveDialog(
//      {'defaultPath': 'mycolors.json'},
//      function (fileName) {
//        if (fileName === undefined) return
//
//        fs.writeFile(fileName, JSON.stringify(colors), function (err) {
//          if (err) {
//            throw err
//          }
//        })
//      })
//  })
//  ipcRenderer.on('file-open', function () {
//    dialog.showOpenDialog(function (fileNames) {
//      if (fileNames === undefined) return
//
//      let fileName = fileNames[0]
//
//      fs.readFile(fileName, 'utf-8', function (err, data) {
//        if (err) {
//          throw err
//        }
//        let tmp = JSON.parse(data)
//        colors.splice(0, 1)
//        tmp.forEach(function (item, index) {
//          colors.push(tmp[index])
//        })
//      })
//    })
//  })

  export default {
    components: {
      Library,
      ColorSquare,
      EmptySquare
    },
    name: 'landing-page',
    data () {
      return {
        library: library,
        showLibrary: false,
        currentId: currentId,
        collection: (id) => {
          if (id) return this.library[id]
          return this.library[this.currentId]
        },
        colors: () => {
          return this.collection().colors
        }
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
        this.colors().push([
          {
            bgHex: tinycolor.random().toHexString()
          }
        ])
      },
      delItem: function (row, item, index) {
        row.splice(index, 1)
        if (row.length <= 0) {
          let i = this.colors().indexOf(row)
          this.colors().splice(i, 1)
        }
      },
      toggleLibrary: function () {
        this.showLibrary = !this.showLibrary
      },
      newCollection: newCollection
    },
    created: function () {
      let that = this
      ipcRenderer.on('open-library', function () {
        that.toggleLibrary()
      })
    }
  }
</script>

<style scoped lang="less">
    .main {
        display: flex;
    }
    .library {
        background-color: white;
        min-width: 250px;
    }
    .workspace {
        width: 100%;
        transition: all .4s;
    }

    .slideIn-enter-active {
        transition: all .4s
    }
    .slideIn-leave-active {
        transition: all .7s
    }
    .slideIn-enter, .slideIn-leave-to {
        transform: translateX(-100%);
    }
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
    .colors-enter, .colors-leave-to {
        opacity: 0;
        transform: translateY(-30px);
    }
    .colors-row-enter-active, .colors-row-leave-to {
        opacity: 0;
        transform: translateX(-30px);
    }
</style>
