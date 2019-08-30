import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    base: {
      movie: { collect: 0, wish: 0 },
      book: { collect: 0, wish: 0 },
      game: { collect: 0, wish: 0 },
      music: { collect: 0, wish: 0 },
      photo: 0,
      friend: { star: 0, follower: 0 }
    },
    backups: []
  },
  mutations: {
    setBase(state, data) {
      state.base = data
    },
    setBackups(state, data) {
      state.backups = data
      console.log(data)
    }
  },
  actions: {
    //
  }
})
