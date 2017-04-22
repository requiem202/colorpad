<template>
    <div>
        <div class="header">Collection</div>
        <transition-group name="collection" tag="ul">
            <li  v-for="row in collection" v-bind:key="row" class="collection-row" v-bind:class="{active:isActive(row)}">
                {{ row.name }}
            </li>
        </transition-group>
    </div>
</template>

<script>

  export default {
    name: 'library',
    props: [
      'collection',
      'currentId'
    ],
    data () {
      return {
      }
    },
    methods: {
      isActive: function (row) {
        return this.currentId === row.id
      }
    }
  }
</script>

<style scoped lang="less">
  .header {
    font-size: 18px;
    padding: 30px 8px 3px 8px;
    background-color: #eaeaea;
    font-weight: 900;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
  li {
    padding: 6px 3px;
    margin-top: 3px;
    margin-bottom: 3px;

    &.active {
      font-style: italic;
    }
  }
</style>
