<template>
  <section class="section">
    <b-menu class="mb-3">
      <b-menu-list label="Lists">
        <b-menu-item
          v-for="list in lists"
          :key="list.id"
          :label="list.name"
          tag="nuxt-link"
          :to="{ name: 'lists-id', params: { id: list.id } }"
        />
      </b-menu-list>
    </b-menu>

    <b-button type="is-primary is-light" @click="createList">
      New list
    </b-button>
  </section>
</template>

<script>
export default {
  data () {
    return {
      lists: []
    }
  },
  async mounted () {
    const lists = await this.$api.get('/lists')
    this.lists = lists
  },
  methods: {
    async createList () {
      const list = await this.$api.post('/lists', {
        name: 'New list'
      })
      this.$router.push({ path: `/lists/${list.id}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.section {
  max-width: 500px;
  margin: 0 auto;
}
</style>
