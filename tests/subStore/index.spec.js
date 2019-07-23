import { expect } from "chai";
import VuexTester from '../../src/vuex-tester';
import store from '../store';
const {commit, dispatch, rootState, state, getters, rootGetters} = new VuexTester(store.modules.sub, 'sub').update();

describe("test state", async () => {
  it("state cbd", async function() {
    expect(state.cbd).eql(100);
  });
});
describe("test rootState", async () => {
  it("rootState cbd", async function() {
    expect(rootState.sub.cbd).eql(100);
  });
});
describe("test mutations", async () => {
  it("mutations SET", async function() {
    commit('SET', 10000);
    expect(state.cbd).eql(10000);
  });
  it("mutations MINUS", async function() {
    commit('SET', 10000);
    commit('MINUS', 20);
    expect(state.cbd).eql(9980);
  });
});
describe("test actions", async () => {
  it("actions _minus", async function() {
    commit('SET', 10000);
    dispatch('_minus', 3);
    expect(state.cbd).eql(9997);
  });
});
describe("test getters", async () => {
  it("getters getStateMinus", async function() {
    commit('SET', 10000);
    expect(getters.getStateMinus).eql(9999);
  });
});
describe("test rootGetters", async () => {
  it("rootGetters getStateMinus", async function() {
    commit('SET', 10000);
    expect(rootGetters["sub/getStateMinus"]).eql(9999);
  });
});