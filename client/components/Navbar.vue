<template>
  <b-navbar>
    <template #brand>
      <b-navbar-item tag="nuxt-link" :to="{ path: '/' }">
        Shopping List
      </b-navbar-item>
    </template>

    <template #end>
      <b-navbar-item tag="div">
        <div class="buttons">
          <a v-if="!$auth.user" class="button is-light" @click="$auth.login()">
            Log in
          </a>

          <a v-else class="button is-light" @click="$auth.logout()">
            Logout
          </a>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
export default {

}
</script>
