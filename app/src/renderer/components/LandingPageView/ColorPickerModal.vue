<template>
  <modal v-if="show" v-show="show" v-on:onClose="close" :type="type">
    <div class="modal-body">
      <sketch-picker v-model="value" @change-color="colorPicked"></sketch-picker>
    </div>

    <div class="modal-footer text-right">
      <button class="modal-default-button" v-on:click="close()">
        Close
      </button>
    </div>
  </modal>
</template>

<script>
  import Modal from '../Modal'
  import { Sketch } from 'vue-color'

  export default {
    props: {
      value: {
        type: Object
      },
      show: {
        type: Boolean
      },
      type: {
        type: String
      }
    },
    methods: {
      close: function () {
        this.$emit('close', this.value)
      },
      colorPicked: function (color) {
        this.$emit('colorPicked', color)
      }
    },
    components: {
      Modal,
      'sketch-picker': Sketch
    }
  }
</script>
