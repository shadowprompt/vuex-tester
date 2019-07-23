export default {
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
