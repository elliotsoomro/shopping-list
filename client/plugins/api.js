/**
 * @file Adds `this.$api` to the Vue instance. Works like
 * `this.$axios`, but instead of returning a response object all request methods
 * return `response.data.data`. The original Axios methods are available as
 * `methodNameRaw`. For example, `get` is available as `getRaw`.
 *
 * The following methods are modified: get, delete, head, options, post, put, patch
 */

// let lastVersion = null

export default ({ app, $config, store }, inject) => {
  function run (action, raw) {
    return async function (url, ...args) {
      const result = await action(url, ...args)

      // if (result.request.responseURL.startsWith($config.apiUrl)) {
      //   if (!lastVersion) {
      //     lastVersion = result.headers.version
      //   } else if (lastVersion !== result.headers.version) {
      //     store.commit('setShowVersionNotice', true)
      //   }
      // }

      if (result && result.data) {
        if (raw) {
          return result.data
        } else if (result.data.data) {
          return result.data.data
        } else {
          return null
        }
      } else {
        throw new Error('Invalid Axios response. Expected response to contain data key.')
      }
    }
  }

  inject('api', {
    ...app.$axios,

    get: run(app.$axios.get),
    getRaw: run(app.$axios.get, true),

    delete: run(app.$axios.delete),
    deleteRaw: run(app.$axios.delete, true),

    head: run(app.$axios.head),
    headRaw: run(app.$axios.head, true),

    options: run(app.$axios.options),
    optionsRaw: run(app.$axios.options, true),

    post: run(app.$axios.post),
    postRaw: run(app.$axios.post, true),

    putRaw: run(app.$axios.put, true),
    put: run(app.$axios.put),

    patch: run(app.$axios.patch),
    patchRaw: run(app.$axios.patch, true)
  })
}
