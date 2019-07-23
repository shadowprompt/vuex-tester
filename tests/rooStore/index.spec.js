import { expect } from "chai";
import VuexTester from '../../src/vuex-tester';
import store from '../store';
const {commit, dispatch, rootState, state, getters, rootGetters} = new VuexTester(store).update();

describe("test state", async () => {
  it("state abc", async function() {
    expect(state.abc).eql(1);
  });
});
describe("test rootState", async () => {
  it("rootState abc", async function() {
    expect(rootState.abc).eql(1);
  });
});
describe("test mutations", async () => {
  it("mutations SET", async function() {
    commit('SET', 100);
    expect(state.abc).eql(100);
  });
  it("mutations PLUS", async function() {
    commit('SET', 100);
    commit('PLUS', 10);
    expect(state.abc).eql(110);
  });
});
describe("test actions", async () => {
  it("actions _plus", async function() {
    commit('SET', 100);
    dispatch('_plus', 9);
    expect(state.abc).eql(109);
  });
});
describe("test getters", async () => {
  it("getters getStatePlus", async function() {
    commit('SET', 100);
    expect(getters.getStatePlus).eql(101);
  });
});
describe("test rootGetters", async () => {
  it("rootGetters getStatePlus", async function() {
    commit('SET', 100);
    expect(rootGetters.getStatePlus).eql(101);
  });
});