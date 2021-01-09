export default async function ({ $axios, $config }, inject) {
  let user = null

  try {
    const response = await $axios.get(`${$config.apiUrl}/auth/me`)

    if (response.data) {
      user = response.data.data
    }
  } catch (e) {
    // Ignore
  }

  const auth = {
    user,
    login () {
      window.location.href = `${$config.apiUrl}/auth/login`
    },
    logout () {
      window.location.href = `${$config.apiUrl}/auth/logout`
    }
  }

  inject('auth', auth)
}
