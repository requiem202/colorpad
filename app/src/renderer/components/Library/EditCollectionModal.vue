<template>
  <modal :show.sync="show" v-on:onClose="close">
    <div class="modal-header">
      <h3>Edit Collection</h3>
    </div>

    <div class="modal-body">
      <label class="form-label">
        Name
        <input v-model="value.name" class="form-control">
      </label>
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

  export default {
    props: {
      value: {
        type: Object
      },
      show: {
        type: Boolean
      }
    },
    methods: {
      close: function () {
        this.$emit('close', this.value)
      }
    },
    components: {
      Modal
    }
  }
</script>
