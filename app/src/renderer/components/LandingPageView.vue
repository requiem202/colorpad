<template>
  <div class="main">
    <transition name="slideIn">
      <div class="library" v-show="showLibrary">
        <library v-bind:collection="library"
                 v-bind:currentId="currentId"
                 v-on:addCollection="addCollection()"
                 v-on:selectCollection="selectCollection"
                 v-on:delCollection="delCollection"
                 v-on:editCollection="editCollection"
                 v-on:toggleLibrary="toggleLibrary"></library>
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
              v-on:doubleClicked="doubleClicked"
              class="colors-row-item">
          </color-square>
          <empty-square v-on:click.native="addItem(row)" v-bind:key="row"></empty-square>
        </transition-group>
      </transition-group>
      <div>
        <empty-square v-on:click.native="addRow()"></empty-square>
      </div>
      <color-picker-modal :show.sync="showColorPicker"
                             v-on:colorPicked="colorPicked"
                             v-on:close="colorPickerClosed"
                          v-bind:value="currentColorPicker"
                          type="clear">
      </color-picker-modal>
    </div>
  </div>
</template>

<script>
  import ColorSquare from './LandingPageView/ColorSquare'
  import EmptySquare from './LandingPageView/EmptySquare'
  import Library from './Library'
  import ColorPickerModal from './LandingPageView/ColorPickerModal'
  const {dialog} = require('electron').remote
  const ipcRenderer = require('electron').ipcRenderer
  const fs = require('fs')
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
  let _isCountObject = function (obj) {
    let i = 0
// eslint-disable-next-line no-unused-vars
    for (let p in obj) {
      i++
    }
    return i
  }

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

  function init () {
    let state = {}
    let collection = newCollection()
    state.library = {}
    state.library[collection.id] = collection
    state.currentId = collection.id
    return state
  }

  let state = init()

  //  if (_isEmptyObject(state.library)) {
  //    let collection = newCollection()
  //    state.library[collection.id] = collection
  //    state.currentId = collection.id
  //  }

  export default {
    components: {
      Library,
      ColorSquare,
      EmptySquare,
      ColorPickerModal
    },
    name: 'landing-page',
    data () {
      return {
        library: state.library,
        showLibrary: true,
        currentId: state.currentId,
        collection: (id) => {
          if (id) return this.library[id]
          return this.library[this.currentId]
        },
        colors: () => {
          return this.collection().colors
        },
        currentColor: {},
        currentColorPicker: {},
        showColorPicker: false
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
      newCollection: newCollection,
      addCollection: function () {
        let collection = newCollection()
        this.library[collection.id] = collection
        this.currentId = collection.id
      },
      delCollection: function (row) {
        let count = _isCountObject(this.library)
        if (count <= 1) {
          this.addCollection()
        } else {
          for (let p in this.library) {
            if (p !== row.id) {
              this.currentId = p
              break
            }
          }
        }
        delete this.library[row.id]
      },
      editCollection: function (row) {
      },
      selectCollection: function (row) {
        this.currentId = row.id
      },
      colorPicked: function (color) {
        this.currentColor.bgHex = color.hex
      },
      doubleClicked: function (item) {
        this.currentColor = item

        let c = tinycolor(item.bgHex)
        this.currentColorPicker.hex = c.toHexString()
        this.currentColorPicker.hsl = c.toHsl()
        this.currentColorPicker.hsv = c.toHsv()
        this.currentColorPicker.rgba = c.toRgb()
        this.currentColorPicker.a = c.getAlpha()
        this.showColorPicker = true
      },
      colorPickerClosed: function () {
        this.showColorPicker = false
      }
    },
    created: function () {
      let that = this

      storage.get(USER_LIBRARY, function (error, data) {
        if (error || !data || !data.library || _isEmptyObject(data.library)) {
          let collection = that.newCollection()
          that.library[collection.id] = collection
          that.currentId = collection.id
        } else {
          that.library = data.library
          that.currentId = data.currentId
        }
      })

      ipcRenderer.on('open-library', function () {
        that.toggleLibrary()
      })

      ipcRenderer.on('file-save', function () {
        storage.set(USER_LIBRARY, {
          library: that.library,
          currentId: that.currentId
        }, function (error) {
          if (error) throw error
        })
      })
      ipcRenderer.on('file-export', function () {
        dialog.showSaveDialog(
          {'defaultPath': 'library.colors'},
          function (fileName) {
            if (fileName === undefined) return

            fs.writeFile(fileName, JSON.stringify(that.library), function (err) {
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
            for (let p in that.library) {
              delete that.library[p]
            }
            for (let p in tmp) {
              that.library[p] = tmp[p]
              that.currentId = p
            }
          })
        })
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
