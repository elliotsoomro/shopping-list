<template>
  <div>
    <section class="section">
      <div v-if="list" class="shopping-list">
        <b-button
          type="is-text"
          icon-left="angle-left"
          class="mb-2"
          style="margin-left: -1rem;"
          tag="nuxt-link"
          to="/"
        >
          Lists
        </b-button>

        <div class="is-flex is-justify-content-space-between is-align-items-center mb-3">
          <div>
            <b-input
              v-if="editingList"
              ref="listNameInput"
              v-model="list.name"
              @blur="editingList = false; updateList()"
              @keyup.native.enter="editingList = false; updateList()"
            />

            <h3 v-else class="is-size-3 editable" @click="editList">
              {{ list.name }}
            </h3>
          </div>

          <div>
            <b-dropdown>
              <template #trigger>
                <b-button type="is-light" icon-left="cog" />
              </template>

              <b-dropdown-item @click="deleteList">
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>

        <div class="mb-4" style="width: 200px;">
          <v-select
            v-model="sorting"
            :options="[
              { label: 'Order added', value: 'createdAt' },
              { label: 'Alphabetical', value: 'alphabetical' },
              { label: 'Categories', value: 'categories' }
            ]"
            :reduce="sort => sort.value"
          />
        </div>

        <div class="box">
          <b-field>
            <v-select
              ref="select"
              label="name"
              placeholder="Add item"
              :value="selected"
              :options="options"
              :create-option="item => ({ name: item })"
              taggable
              @search="onSearch"
              @input="addItem"
            />
          </b-field>

          <template v-if="sorting === 'createdAt'">
            <div
              v-for="item in sortedCreatedAt"
              :key="item.id"
              class="list-item"
            >
              <div class="is-flex is-align-items-center">
                <b-checkbox v-model="item.checked" @input="check(item.id, $event)" />

                <div>
                  {{ item.name }}
                </div>
              </div>

              <div class="actions">
                <b-icon icon="pen" @click.native="editItem(item)" />

                <b-icon icon="trash" @click.native="deleteItem(item.id)" />
              </div>
            </div>
          </template>

          <template v-if="sorting === 'alphabetical'">
            <div
              v-for="item in sortedAlphabetical"
              :key="item.id"
              class="list-item"
            >
              <div class="is-flex is-align-items-center">
                <b-checkbox v-model="item.checked" @input="check(item.id, $event)" />

                <div>
                  {{ item.name }}
                </div>
              </div>

              <div class="actions">
                <b-icon icon="pen" @click.native="editItem(item)" />

                <b-icon icon="trash" @click.native="deleteItem(item.id)" />
              </div>
            </div>
          </template>

          <template v-if="sorting === 'categories'">
            <div
              v-for="category in sortedCategories"
              :key="category.id"
              class="mb-2"
            >
              <div class="is-size-7 mb-2">
                {{ category.name.toUpperCase() }}
              </div>

              <div
                v-for="item in category.items"
                :key="item.id"
                class="list-item"
              >
                <div class="is-flex is-align-items-center">
                  <b-checkbox v-model="item.checked" @input="check(item.id, $event)" />

                  <div>
                    {{ item.name }}
                  </div>
                </div>

                <div class="actions">
                  <b-icon icon="pen" @click.native="editItem(item)" />

                  <b-icon icon="trash" @click.native="deleteItem(item.id)" />
                </div>
              </div>
            </div>
          </template>
        </div>

        <b-modal v-model="isModalActive">
          <div v-if="itemEditing !== null" class="box">
            <b-field>
              <b-input
                v-model="itemEditing.name"
                @blur="updateItem(itemEditing.id, { name: itemEditing.name })"
              />
            </b-field>

            <b-field>
              <v-select
                v-model="itemEditing.categoryId"
                :options="categories"
                :reduce="category => category.id"
                label="name"
                placeholder="Category"
                @input="updateItem(itemEditing.id, { categoryId: itemEditing.categoryId })"
              />
            </b-field>

            <div class="is-flex is-justify-content-flex-end">
              <b-button type="is-light" @click="isModalActive = false">
                Done
              </b-button>
            </div>
          </div>
        </b-modal>

        <div v-if="checked.length > 0">
          <div class="toggle-checked" @click="showChecked = !showChecked">
            <template v-if="!showChecked">
              {{ checked.length }} checked <b-icon icon="angle-down" />
            </template>

            <template v-else>
              {{ checked.length }} checked <b-icon icon="angle-up" />
            </template>
          </div>

          <template v-if="showChecked">
            <div v-for="item in checked" :key="item.id" class="list-item" :class="{ 'checked': item.checked }">
              <div class="is-flex">
                <b-checkbox v-model="item.checked" @input="check(item.id, $event)" />

                <div>
                  {{ item.name }}
                </div>
              </div>

              <div class="actions">
                <b-icon icon="pen" @click.native="editItem(item)" />

                <b-icon icon="trash" @click.native="deleteItem(item.id)" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// import debounce from 'debounce'

export default {
  data () {
    return {
      list: null,
      items: [],
      categories: [],
      options: [],
      sorting: 'createdAt',
      selected: null,
      showChecked: false,
      editingList: false,
      itemEditing: null,
      isModalActive: false
    }
  },
  computed: {
    checked () {
      return this.items.filter(item => item.checked === true)
    },
    unchecked () {
      return this.items.filter(item => item.checked === false)
    },
    sortedCreatedAt () {
      const items = [...this.unchecked].sort((a, b) => {
        const createdAtA = a.createdAt
        const createdAtB = b.createdAt
        return (createdAtA > createdAtB) ? -1 : (createdAtA < createdAtB) ? 1 : 0
      })
      return items
    },
    sortedAlphabetical () {
      const items = [...this.unchecked].sort((a, b) => {
        const nameA = a.name.toLowerCase()
        const nameB = b.name.toLowerCase()
        return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0
      })
      return items
    },
    sortedCategories () {
      const categories = this.categories.map(category => ({
        id: category.id,
        name: category.name,
        items: this.unchecked.filter(item => item.categoryId === category.id)
      })).filter(category => category.items.length > 0)

      const uncategorized = this.unchecked.filter(item => item.categoryId === null)

      if (uncategorized.length > 0) {
        categories.push({
          id: '_id',
          name: 'No category',
          items: uncategorized
        })
      }

      return categories
    }
  },
  async mounted () {
    const list = await this.$api.get(`/lists/${this.$route.params.id}`)
    this.list = list
    this.items = list.items

    const categories = await this.$api.get('/categories')
    this.categories = categories

    const options = await this.$api.get('/options')
    this.options = options
  },
  methods: {
    onSearch (search, loading) {
      // debounce(function (newValue) {
      //   console.log(newValue)
      // }, 250)
    },
    editList () {
      this.editingList = true
      this.$nextTick(() => {
        this.$refs.listNameInput.focus()
      })
    },
    async updateList () {
      await this.$api.patch(`/lists/${this.list.id}`, {
        name: this.list.name
      })
    },
    async deleteList () {
      await this.$api.delete(`/lists/${this.list.id}`)
      this.$router.push({ path: '/' })
    },
    async addItem (data) {
      const item = await this.$api.post('/items', {
        name: data.name,
        listId: this.list.id
      })
      this.items.push(item)
      this.selected = null
    },
    editItem (item) {
      this.itemEditing = item
      this.isModalActive = true
    },
    async updateItem (itemId, data) {
      await this.$api.patch(`/items/${itemId}`, data)
    },
    check (itemId, state) {
      this.updateItem(itemId, { checked: state })
    },
    async deleteItem (itemId) {
      const index = this.items.findIndex(item => item.id === itemId)
      const item = this.items.splice(index, 1)

      try {
        await this.$api.delete(`/items/${itemId}`)
      } catch (error) {
        this.items.splice(index, 0, item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.shopping-list {
  max-width: 500px;
  margin: 0 auto;

  .field {
    margin-bottom: 1.25rem;
  }
}

.h3.editable {
  cursor: text;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  cursor: pointer;

  &:hover {
    background-color: #eee;

    .actions {
      display: flex;
    }
  }

  &.checked {
    text-decoration: line-through;
  }

  .actions {
    display: none;
    align-items: center;

    .icon {
      width: 20px;
      height: 20px;
      margin-left: 0.75rem;
      color: #7a7a7a;

      &:hover {
        color: #363636;
      }
    }
  }
}

.box {
  .list-item {
    margin: 0 -1.25rem;
  }
}

.modal {
  .box {
    max-width: 500px;
    margin: 0 auto;
  }
}

.toggle-checked {
  display: flex;
  justify-content: center;
  padding-bottom: 0.75rem;
  cursor: pointer;

  &:hover {
    color: #363636;
  }
}
</style>

<style lang="scss">
.modal-content {
  overflow: visible;
}
</style>
