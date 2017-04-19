<template>
  <span class="color-square" v-bind:style="{ backgroundColor: bg() }">
      <input type="text"
             class="bgHex"
             v-bind:value="value.bgHex"
             v-bind:style="{color:textColor()}"
             v-on:input="updateValue($event.target.value)"/>
  </span>
</template>

<script>
  const tinycolor = require('tinycolor2')

  export default {
    props: {
      value: {
        type: Object,
        default: function () {
          return { bgHex: '#ffffff' }
        }
      }
    },
    data () {
      return {
        bg: () => {
//          console.log(this.value.bgHex)
          let color = this.value.bgHex
          if (!color) {
            return '#ffffff'
          }
          if (color.indexOf('#') !== 0) {
            color = '#' + color
            this.value.bgHex = color
          }
          return color
        },
        textColor: () => {
          let c = tinycolor(this.bg())
          if (!c.isValid() || c.getBrightness() > 110) {
            return '#333'
          }
          return '#ffffff'
        }
      }
    },
    methods: {
      updateValue: function (value) {
        this.value.bgHex = value
        this.$emit('input', this.value)
      }
    }
  }
</script>

<style scoped>
    .color-square {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 150px;
        height: 150px;
        /*float: left;*/
        margin: 3px;
        transition: background-color linear 0.25s;
    }

    .color-square .bgHex {
        min-width: 50px;
        max-width: 80px;
        font-size: 16px;
        padding: 5px 0;
        text-align: center;
        border: 1px solid transparent;
        background: transparent;
        transition: color linear 0.25s;
    }
    .color-square .bgHex:focus,
    .color-square .bgHex:active {
        outline: none;
        border-bottom: 1px solid #888;
    }
</style>
