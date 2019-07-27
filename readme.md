# vuex-tester

mock the vuex environment to run your commit and dispatch without any extra adjustment, test as closer as possible to your product environment.

**NO NEED** to split your actions and mutations

full flow test is best test.

```javascript
import VuexTester from 'vuex-tester';

const store = {
    namespace: true,
    state: {
      abc: 1
    },
    mutations: {
      SET(state, payload) {
        state.abc = payload;
      },
      PLUS(state, payload) {
        state.abc = state.abc + payload;
      },
    },
    actions: {
      _plus(context, params) {
        console.log("context -> ", context);
        context.commit("PLUS", params);
      }
    },
    getters: {
      getStatePlus(state, getters, rootState, rootGetters) {
        console.log(
          "getters getStatePlus-> ",
          state,
          rootState,
          Object.getOwnPropertyNames(getters),
          Object.getOwnPropertyNames(rootGetters)
        );
        return state.abc + 1;
      }
    },
    modules: {
      sub: {
        namespace: true,
        state: {
          cbd: 100
        },
        mutations: {
          SET(state, payload) {
            state.cbd = payload;
          },
          MINUS(state, payload) {
            console.log(" MINUS arg-> ", arguments);
            state.cbd = state.cbd - payload;
            console.log(" MINUS result-> ", state.cbd);
          }
        },
        actions: {
          _minus(context, params) {
            console.log("context -> ", context);
            context.commit("MINUS", params);
          }
        },
        getters: {
          getStateMinus(state, getters, rootState, rootGetters) {
            console.log(
              "getters getStateMinus-> ",
              state,
              rootState,
              Object.getOwnPropertyNames(getters),
              Object.getOwnPropertyNames(rootGetters)
            );
            return state.cbd - 1;
          }
        },
        modules: {
          subTie: {
            namespace: true,
            state: {
              xyz: 55
            },
            mutations: {
              SET(state, payload) {
                state.xyz = payload;
              },
              MULTIPLY(state, payload) {
                state.xyz = state.xyz * payload;
              }
            },
            actions: {
              _multiply(context, params) {
                console.log("context -> ", context);
                context.commit("MULTIPLY", params);
              }
            },
            getters: {
              getStateMultiplyDouble(state) {
                console.log("getters getStateMultiplyDouble-> ", arguments);
                return state.xyz * 2;
              }
            }
          }
        }
      }
    }
};

const { state, commit, dispatch } = new VuexTester(store).update();
// if you just want to test the part of subTie, just like this;
// const { state, commit, dispatch } = new VuexTester(store.modules.sub.modules.subTie, 'sub/subTie').update();

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
