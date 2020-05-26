import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
// axios.defaults.baseURL = "http://localhost:5000/api";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    canLogin: false,
    isLoggedin: false,
    level: null,
    wordDetails: [],
    exactWordsDetails: [],
    words: [],
    userToken: null,
    memory: null,
    userResult: [],
    taskOneWordList: [],
    randomWordList: { eng: [], ru: [], img: [] },
    wordTransList: [],
    wordTransListOptions: [],
    wordsPicUrls: [],
  },
  mutations: {
    authUser(state, userData) {
      (state.user = userData.userID), (state.canLogin = userData.canLogin);
      state.isLoggedin = state.canLogin ? true : false;
      // console.log("set islogged in to :" + state.isLoggedin);
      localStorage.setItem("user", state.user);
      localStorage.setItem("canLogin", state.canLogin);
      localStorage.setItem("isLoggedin", state.isLoggedin);
    },
    setCanLogin(state, userCanLogin) {
      state.canLogin = userCanLogin;
      localStorage.setItem("canLogin", state.canLogin);
      localStorage.setItem("user", state.user);
    },
    setIsLoggedin(state, userisLoggedin) {
      state.isLoggedin = userisLoggedin;
    },
    setUser(state, user) {
      state.User = user;
    },
    setLevel(state, userLevel) {
      state.level = userLevel;
    },
    setMemory(state, userMemory) {
      state.memory = userMemory;
    },
    setWords(state, userWords) {
      state.words = userWords;
      localStorage.setItem("words", JSON.stringify(state.words));
    },
    setWordDetails(state, inputDetails) {
      state.wordDetails = inputDetails;
      localStorage.setItem("wordDetails", JSON.stringify(state.wordDetails));
    },
    setExactWordsDetails(state, userWords) {
      state.exactWordsDetails = userWords;
      localStorage.setItem(
        "exactWordsDetails",
        JSON.stringify(state.exactWordsDetails)
      );
    },
    setWordPicsUrls(state, picUrls) {
      state.wordsPicUrls = picUrls;
      localStorage.setItem("wordsPicUrls", JSON.stringify(state.wordsPicUrls));
    },
    setRandomWords(state, randomWords) {
      state.randomWordList = randomWords;
      localStorage.setItem(
        "randomWordList",
        JSON.stringify(state.randomWordList)
      );
    },
    setUserResult(state, userResult) {
      state.userResult = userResult;
      localStorage.setItem("userResult", JSON.stringify(state.userResult));
    },
  },
  actions: {
    setUserResult({commit, getters}, userResult) {
      let result = [];
      if (userResult.part > 1) {
        result = getters.getUserResult;
      }
      result[userResult.part - 1] = JSON.parse(JSON.stringify(userResult));
      commit("setUserResult", result);
    },
  },
  modules: {},
  getters: {
    getUser(state) {
      return state.user;
    },
    getCanLogin(state) {
      return state.canLogin;
    },
    getIsLoggedin(state) {
      return state.isLoggedin;
    },
    getUserLeve(state) {
      return state.level;
    },
    getWordDetails(state) {
      return state.wordDetails.length
        ? state.wordDetails
        : JSON.parse(localStorage.getItem("wordDetails"));
    },
    getWords(state) {
      const words = state.words.length
        ? state.words
        : JSON.parse(localStorage.getItem("words"));
      return words;
    },
    getExactWordsDetails(state) {
      return state.exactWordsDetails.length
        ? state.exactWordsDetails
        : JSON.parse(localStorage.getItem("exactWordsDetails"));
    },
    getRandomWords(state) {
      return state.randomWordList.length
        ? state.randomWordList
        : JSON.parse(localStorage.getItem("randomWordList"));
    },
    getWordsPicUrls(state) {
      return state.wordsPicUrls.length
        ? state.wordsPicUrls
        : JSON.parse(localStorage.getItem("wordsPicUrls"));
    },
    getUserResult(state) {
      return state.userResult.length
        ? state.userResult
        : JSON.parse(localStorage.getItem("userResult"));
    },
  },
});
