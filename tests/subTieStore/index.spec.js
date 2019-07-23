import { expect } from "chai";
import VuexTester from '../../src/vuex-tester';
import store from '../store';
const {commit, dispatch, rootState, state, getters, rootGetters} = new VuexTester(store.modules.sub.modules.subTie, 'sub/subTie').update();

describe("test state", async () => {
  it("state xyz", async function() {
    expect(state.xyz).eql(55);
  });
});
describe("test rootState", async () => {
  it("rootState xyz", async function() {
    expect(rootState.sub.subTie.xyz).eql(55);
  });
});
describe("test mutations", async () => {
  it("mutations SET", async function() {
    commit('SET', 5500);
    expect(state.xyz).eql(5500);
  });
  it("mutations MULTIPLY", async function() {
    commit('SET', 5500);
    commit('MULTIPLY', 2);
    expect(state.xyz).eql(11000);
  });
});
describe("test actions", async () => {
  it("actions _multiply", async function() {
    commit('SET', 5500);
    dispatch('_multiply', 3);
    expect(state.xyz).eql(16500);
  });
});
describe("test getters", async () => {
  it("getters getStateMultiplyDouble", async function() {
    commit('SET', 100);
    expect(getters.getStateMultiplyDouble).eql(200);
  });
});
describe("test rootGetters", async () => {
  it("rootGetters getStateMultiplyDouble", async function() {
    commit('SET', 200);
    expect(rootGetters["sub/subTie/getStateMultiplyDouble"]).eql(400);
  });
});