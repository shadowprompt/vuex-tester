# vuex-tester

mock the vuex environment to run your commit and dispatch without any extra adjustment, test as closer as possible to your product environment.

**NO NEED** to split your actions and mutations

full flow test is best test.

```javascript
import VuexTester from 'vuex-tester';

import store from './tests/store';

const { state, commit, dispatch } = new VuexTester(store).update(); // current subModules path

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
```
