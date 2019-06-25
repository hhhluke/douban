import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    base: {
      movie: { saw: 0, want: 0 },
      book: { read: 0, want: 0 },
      photo: 0,
      friend: { star: 0, follower: 0 }
    },
    movie: {
      saw: 0,
      want: 0
    },
    book: {
      saw: 0,
      want: 0
    },
    user: {
      star: 0,
      follower: 0
    },
    broadcast: 0,
    photo: 0
  },
  mutations: {
    setBase(state, data) {
      state.base = data
    },
    setMovie(state, data) {
      state.movie = data
    },
    setBook(state, data) {
      state.book = data
    },
    setUser(state, data) {
      state.user = data
    },
    setBroadcast(state, data) {
      state.broadcast = data
    },
    setPhoto(state, data) {
      state.photo = data
    }
  },
  actions: {
    //
  }
})
