<template>
  <section class="section">
    <div class="shopping-list">
      <div class="box">
        <b-field>
          <v-select
            ref="select"
            :value="selected"
            :options="options"
            taggable
            placeholder="Add item"
            @input="add"
          />
        </b-field>

        <div>
          <div
            v-for="item in unchecked"
            :key="item.id"
            class="list-item"
          >
            <div class="is-flex is-align-items-center">
              <b-checkbox v-model="item.checked" />

              <div>
                {{ item.title }}
              </div>
            </div>

            <div class="actions">
              <b-icon icon="pen" @click.native="edit(item)" />

              <b-icon icon="trash" @click.native="remove(item.id)" />
            </div>
          </div>
        </div>
      </div>

      <b-modal v-model="isModalActive">
        <div v-if="editItem !== null" class="box">
          <b-field>
            <b-input v-model="editItem.title" />
          </b-field>

          <b-field>
            <v-select
              v-model="editItem.categoryId"
              :options="categories"
              :reduce="category => category.id"
              label="name"
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
              <b-checkbox v-model="item.checked" />

              <div>
                {{ item.title }}
              </div>
            </div>

            <div class="actions">
              <b-icon icon="pen" @click.native="edit(item)" />

              <b-icon icon="trash" @click.native="remove(item.id)" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script>
import cuid from 'cuid'

export default {
  data () {
    return {
      selected: null,
      editItem: null,
      items: [
        {
          id: 1,
          title: 'A-fil',
          categoryId: 7,
          checked: false
        },
        {
          id: 2,
          title: 'flingor',
          categoryId: 8,
          checked: false
        },
        {
          id: 3,
          title: 'ägg',
          categoryId: 7,
          checked: true
        },
        {
          id: 4,
          title: 'fryst kycklingfilé',
          categoryId: 4,
          checked: true
        },
        {
          id: 5,
          title: 'rasker',
          categoryId: 1,
          checked: false
        }
      ],
      categories: [
        {
          id: 1,
          name: 'Bröd & kakor'
        },
        {
          id: 2,
          name: 'Fisk & skaldjur'
        },
        {
          id: 3,
          name: 'Frukt & grönt'
        },
        {
          id: 4,
          name: 'Fryst'
        },
        {
          id: 5,
          name: 'Glass, godis & snacks'
        },
        {
          id: 6,
          name: 'Kött, chark & fågel'
        },
        {
          id: 7,
          name: 'Mejeri, ost & ägg'
        },
        {
          id: 8,
          name: 'Skafferi'
        }
      ],
      showChecked: false,
      isModalActive: false
    }
  },
  computed: {
    unchecked () {
      return this.items.filter(item => item.checked === false)
    },
    checked () {
      return this.items.filter(item => item.checked === true)
    },
    options () {
      return [...new Set(this.items.map(item => item.title))]
    }
  },
  methods: {
    add (title) {
      this.items.push({
        id: cuid(),
        title,
        checked: false
      })

      this.selected = null
      this.$refs.select.$el.focus()
    },
    edit (item) {
      this.editItem = item
      this.isModalActive = true
    },
    remove (id) {
      const index = this.items.findIndex(item => item.id === id)
      this.items.splice(index, 1)
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
