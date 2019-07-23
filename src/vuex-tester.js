export default class VuexTester {
  constructor(rootStore, namespace = "") {
    this.namespace = namespace;
    this.store = rootStore.default || rootStore;
    this.rootStateMap = {};
    this.rootMutationsMap = {};
    this.rootActionsMap = {};
    this.gettersMap = {};
    this.rootGettersMap = {};
    this.storeContext = {}; // 'this' in vuex
    this.context = {};
    this.rootStateMiddlewares = [];
    this.init();
  }
  init() {
    this.initState();
    this.updateState();
  }

  get prefix() {
    return this.namespace ? `${this.namespace}/` : "";
  }

  initState() {
    const init = (store, rootStateMap, prefix) => {
      const {
        state = {},
        actions = {},
        mutations = {},
        getters = {},
        modules = {}
      } = store;
      Object.keys(state).forEach(
        stateName => (rootStateMap[stateName] = state[stateName])
      );
      const collector = this.collect(prefix);
      collector(this.rootActionsMap, actions);
      collector(this.rootMutationsMap, mutations);
      this.initRootGetters(prefix, getters, state);

      Object.keys(modules).forEach(moduleName => {
        init(
          modules[moduleName],
          (rootStateMap[moduleName] = {}),
          prefix + moduleName + "/"
        );
      });
    };

    init(this.store, this.rootStateMap, this.prefix);
  }

  updateState() {
    this.storeContext.state = this.next();
  }

  initGetter(prefix, getters, state) {
    Object.keys(getters).forEach(getter => {
      const getterFn = getters[getter];
      this.defineGetter(this.gettersMap, getter, getterFn, state, getters);
      // put getter into rootGettersMap，no asking. the getters in current using module are not in this rootGettersMap unexpectedly

      const rootGetter = prefix ? `${prefix}/${getter}` : getter;
      if (!(rootGetter in this.rootGettersMap)) {
        this.defineGetter(
          this.rootGettersMap,
          rootGetter,
          getterFn,
          state,
          getters
        );
      }
    });
  }

  defineGetter(target, key, val, state, getters) {
    Object.defineProperty(target, key, {
      get: () => {
        try {
          return val.call(
            this.storeContext,
            state,
            getters,
            this.storeContext.state,
            this.rootGettersMap
          );
        } catch (e) {
          return void 0;
        }
      }
    });
  }

  initRootGetters(moduleName, getters, state) {
    Object.keys(getters).forEach(getter => {
      const getterFn = getters[getter];
      const rootGetter = `${moduleName}${getter}`;
      this.defineGetter(
        this.rootGettersMap,
        rootGetter,
        getterFn,
        state,
        getters
      );
    });
  }

  update(storeContext, namespace) {
    storeContext = storeContext || this.store;
    namespace = namespace || this.namespace;
    const fn = this.getFn(namespace);
    const {
      state = {},
      actions = {},
      mutations = {},
      getters = {}
    } = storeContext;
    const boundCommit = (type, payload) => {
      console.log("[commit  ]: ", type, payload);
      // mutation in vuex return noting, but we return state
      return (
        fn(type, this.rootMutationsMap, mutations).call(
          this.storeContext,
          state,
          payload
        ) || state
      );
    };

    const boundDispatch = (type, payload) => {
      console.log("[dispatch]: ", type, payload);
      return fn(type, this.rootActionsMap, actions).call(
        this.storeContext,
        this.context,
        payload
      );
    };
    this.storeContext.commit = boundCommit;
    this.storeContext.dispatch = boundDispatch;

    this.initGetter(namespace, getters, state);
    // core state and function in vuex context
    this.context = {
      rootState: this.storeContext.state,
      state: state,
      commit: boundCommit,
      dispatch: boundDispatch,
      getters: this.gettersMap,
      rootGetters: this.rootGettersMap
    };
    return this.context;
  }

  getFn(namespace) {
    const prefix = namespace ? `${namespace}/` : "";
    // the actions/mutations in current using module are not in this masterSource unexpectedly, so use the slaveSource
    return function(type, masterSource, slaveSource) {
      let fnName;
      if (type in masterSource) {
        fnName = masterSource[type];
      } else if (`${prefix}${type}` in masterSource) {
        fnName = masterSource[`${prefix}${type}`];
      } else if (type in slaveSource) {
        fnName = slaveSource[type];
      } else if (`${prefix}${type}` in slaveSource) {
        fnName = slaveSource[`${prefix}${type}`];
      } else {
        throw new Error(
          `function name ${type} with namespace '${namespace}' not found`
        );
      }
      return fnName;
    };
  }

  collect(moduleName) {
    return (target, source) => {
      Object.keys(source).forEach(name => {
        target[`${moduleName}${name}`] = source[name];
      });
    };
  }

  next() {
    const namespaces = this.namespace ? this.namespace.split("/") : [];
    const rootStateMap = {};
    const target = namespaces.reduce(
      (total, curr) => (total[curr] = {}),
      rootStateMap
    );
    Object.assign(target, this.rootStateMap);
    return this.rootStateMiddlewares.reduce(
      (rootState, middleware) => middleware(rootState),
      rootStateMap
    );
  }

  use(middleWare) {
    this.rootStateMiddlewares.push(middleWare);
    this.updateState();
    return this;
  }
}
