<template>
  <span class="color-square" v-bind:style="{ backgroundColor: bg() }">
      <span class="del"
            v-bind:style="{color:textColor()}"
            v-on:click="delClicked()">
        <icon name="times"></icon>
      </span>
      <input type="text"
             class="bgHex"
             v-bind:value="value.bgHex"
             v-bind:style="{color:textColor()}"
             v-on:input="updateValue($event.target.value)"/>
  </span>
</template>

<script>
  const tinycolor = require('tinycolor2')
  import Icon from 'vue-awesome/components/Icon.vue'

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
          if (!c.isValid() || c.isLight()) {
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
      },
      delClicked: function () {
        this.$emit('del', this.value)
      }
    },
    components: {
      Icon
    }
  }
</script>

<style scoped lang="less">
    .color-square {
        display: inline-flex;
        position: relative;
        align-items: center;
        justify-content: center;
        width: 150px;
        height: 150px;
        transition: all linear 0.25s;

        margin: 3px;

        &:hover {
            .del {
                opacity: 1;
            }
        }
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

        &:focus,&:active {
            outline: none;
            border-bottom: 1px solid #888;
        }
    }
    .color-square .del {
        position: absolute;
        left: 0;
        top: 0;
        padding: 5px;
        opacity: 0;
        cursor: pointer;
        color: #fff;
        transition: opacity 0.15s linear;

        .fa-icon {
            height: 1.2em;
            width: auto;
        }

    }
</style>
