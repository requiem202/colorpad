<template>
  <transition name="modal">
    <div class="modal-mask" :class="type" v-on:click="close" v-show="show">
      <div class="modal-container" @click.stop>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: ['show', 'onClose', 'type'],
    methods: {
      close: function () {
        this.$emit('onClose')
      }
    },
    created: function () {
      document.addEventListener('keydown', (e) => {
        if (this.show && e.keyCode === 27) {
          this.$emit('onClose')
        }
      })
    }
  }
</script>

<style lang="less">

  .modal-mask {
    * {
      box-sizing: border-box;
    }
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s ease;
  }

  .modal-container {
    width: 300px;
    margin: 40px auto 0;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-mask.clear {
    .modal-container {
      width: 300px;
      margin: 40px auto 0;
      padding: 20px 30px;
      background-color: transparent;
      border-radius: 2px;
      box-shadow: none;
      transition: all .3s ease;
      font-family: Helvetica, Arial, sans-serif;
    }
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  .modal-body {
    margin: 20px 0;
  }

  .text-right {
    text-align: right;
  }

  .form-label {
    display: block;
    margin-bottom: 1em;
  }

  .form-label > .form-control {
    margin-top: 0.5em;
  }

  .form-control {
    display: block;
    width: 100%;
    padding: 0.5em 1em;
    line-height: 1.5;
    border: 1px solid #ddd;
  }

  .modal-default-button {
    background-color: #eee;
    color: #333;
    padding: 5px;
    border: 1px solid transparent;
    outline: none;
    cursor: pointer;
  }

  .modal-enter, .modal-leave {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>
