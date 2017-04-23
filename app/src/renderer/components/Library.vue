<template>
  <div>
    <div class="header">
      <img src="../../../images/colorpad.png">
      <span class="collection-btn"
            v-on:click="addCollection()">
          <icon name="plus"></icon>
      </span>
      <span class="hide-btn"
            v-on:click="toggleLibrary()">
          <icon name="chevron-circle-left"></icon>
      </span>
    </div>
    <transition-group name="collection" tag="ul">
      <li v-for="row in collection"
          v-bind:key="row"
          class="collection-row"
          v-bind:class="{active:isActive(row)}"
          v-on:click="selectCollection(row)">
        {{ row.name }}

        <span class="del-btn"
              v-on:click.stop="delCollection(row)">
          <icon name="trash"></icon>
        </span>
        <span class="rename-btn"
              v-on:click.stop="editCollection(row)">
          <icon name="edit"></icon>
        </span>
      </li>
    </transition-group>
    <edit-collection-modal :show.sync="showModal"
                           v-on:close="modalClosed"
                           v-model="editingRow">
    </edit-collection-modal>
  </div>
</template>

<script>
  import Icon from 'vue-awesome/components/Icon.vue'
  import EditCollectionModal from './Library/EditCollectionModal'

  export default {
    name: 'library',
    props: [
      'collection',
      'currentId'
    ],
    data () {
      return {
        showModal: false,
        editingRow: {}
      }
    },
    methods: {
      isActive: function (row) {
        return this.currentId === row.id
      },
      addCollection: function () {
        this.$emit('addCollection', null)
      },
      selectCollection: function (row) {
        console.log('select')
        this.$emit('selectCollection', row)
      },
      delCollection: function (row) {
        this.$emit('delCollection', row)
      },
      editCollection: function (row) {
        this.showModal = true
        this.editingRow = row
      },
      modalClosed: function (row) {
        this.showModal = false
        if (row) {
          this.$emit('editCollection', row)
        }
      },
      toggleLibrary: function () {
        this.$emit('toggleLibrary', null)
      }
    },
    components: {
      Icon,
      EditCollectionModal
    }
  }
</script>

<style scoped lang="less">
  img {
    padding-top: 10px;
    max-width: 250px;
  }
  .header {
    position: relative;
    font-size: 18px;
    //padding: 30px 8px 3px 8px;
    background-color: #eaeaea;
    font-weight: 900;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    text-align: right;
  }

  .collection-btn {
    /*float: right;*/
    cursor: pointer;
    padding-right: 8px;
    padding-bottom: 8px;
    color: #333;
  }

  .hide-btn {
    position: absolute;
    right: 8px;
    top: 5px;
    cursor: pointer;
    color: #888;
  }

  .del-btn, .rename-btn {
    float: right;
    cursor: pointer;
    opacity: 0;
    padding-right: 5px;
  }

  li {
    padding: 6px 3px 6px 10px;
    margin-top: 3px;
    margin-bottom: 3px;
    cursor: pointer;

    &.active {
      font-style: italic;
      background-color: rgba(133, 133, 133, 0.58);
    }

    &:hover {
      .del-btn, .rename-btn {
        opacity: 1;
      }
    }
  }
</style>
