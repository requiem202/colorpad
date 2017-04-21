<template>
  <a class="empty-square" href="#">
    <icon name="plus-circle" class="add"></icon>
  </a>
</template>

<script>
  import Icon from 'vue-awesome/components/Icon.vue'

  export default {
    data () {
      return {
      }
    },
    components: {
      Icon
    }
  }
</script>

<style scoped>
  .empty-square {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 150px;
    margin: 3px;
    background-color: rgba(229, 229, 229, .85);
    color: #bbb;
    transition: all 0.25s linear;
  }
  .empty-square:hover {
    color: #777;
    background-color: rgba(229, 229, 229, 1);
  }
  .fa-icon {
    width: auto;
  }
  .add {
    height: 2em;
  }
</style>
