export default class VuexTester{
  constructor(parentModule, storeModules){
    this.parentModule = parentModule;
    this.modules = storeModules.default || storeModules;
    this.rootStateMap = parentModule ? {
      [parentModule]: {},
    } : {};
    this.prefix = parentModule ? `${parentModule}/` : '';
    this.rootMutationsMap = {};
    this.rootActionsMap = {};
    this.gettersMap = {};
    this.rootGettersMap = {};
    this.store = {}; // 'this' in vuex
    this.context = {};
    this.rootStateMiddlewares = [];
    this.init();
  }
  init() {
    this.initState();
    this.updateState();
  }

  initState() {
    Object.keys(this.modules).forEach((moduleName) => {
      const { state = {}, actions = {}, mutations = {}, getters = {} } = this.modules[moduleName];
      const rootStateMap = this.parentModule ? this.rootStateMap[this.parentModule] : this.rootStateMap;
      rootStateMap[moduleName] = state;

      const collector = this.collect(moduleName);
      collector(this.rootActionsMap, actions);
      collector(this.rootMutationsMap, mutations);
      this.initRootGetters(moduleName, getters, state);
    });
  }

  updateState() {
    this.store.state = this.next();
  }

  initAllGetter(prefix, getters, state) {
    Object.keys(getters).forEach(getter => {
      const getterFn = getters[getter];
      const rootGetter = prefix ?  `${prefix}/${getter}` : getter;
      this.initGetters(this.gettersMap, getter, getterFn, state, getters);
      // put getter into rootGettersMap，no asking
      this.initGetters(this.rootGettersMap, rootGetter, getterFn, state, getters);
    });
  }

  initGetters(target, key, val, state, getters) {
    Object.defineProperty(target, key, {
      get: () => {
        try {
          return val.call(this.store, state, getters, this.store.state, this.rootGettersMap);
        }catch (e) {
          return void 0;
        }
      }
    })
  }

  initRootGetters(moduleName, getters, state) {
    Object.keys(getters).forEach(getter => {
      const getterFn = getters[getter];
      const rootGetter = `${this.prefix}${moduleName}/${getter}`;
      this.initGetters(this.rootGettersMap, rootGetter, getterFn, state, getters);
    });
  }

  update(prefix, store) {
    const fn = this.getFn(prefix);
    const { state = {}, actions = {}, mutations = {}, getters = {} } = store;
    const boundCommit = (type, payload) => {
      console.log('[commit  ]: ', type, payload);
      // mutation in vuex return noting, but we return state
      return fn(type, this.rootMutationsMap, mutations).call(this.store, state, payload) || state;
    };

    const boundDispatch = (type, payload) => {
      console.log('[dispatch]: ', type, payload);
      return fn(type, this.rootActionsMap, actions).call(this.store, this.context, payload)
    };
    this.store.commit =  boundCommit;
    this.store.dispatch = boundDispatch;

    this.initAllGetter(prefix, getters, state);
    // core state and function in vuex context
    this.context = {
      rootState: this.store.state,
      state: state,
      commit: boundCommit,
      dispatch: boundDispatch,
      getters: this.gettersMap,
      rootGetters: this.rootGettersMap,
    };
    return this.context;
  }

  getFn(prefix) {
    return function (type, masterSource, slaveSource) {
      let fnName;
      if(type in masterSource){
        fnName = masterSource[type];
      }else if(`${prefix}/${type}` in masterSource) {
        fnName = masterSource[`${prefix}/${type}`];
      }else if(type in slaveSource){
        fnName = slaveSource[type];
      }else if(`${prefix}/${type}` in slaveSource){
        fnName = slaveSource[`${prefix}/${type}`];
      }else {
        throw new Error(`function name ${type} with prefix '${prefix}' not found`)
      }
      return fnName;
    };
  }

  collect(moduleName) {
    return (target, source) => {
      Object.keys(source).forEach(name => {
        target[`${this.prefix}${moduleName}/${name}`] = source[name];
      });
    };
  }

  next() {
    return this.rootStateMiddlewares.reduce((rootState, middleware) => middleware(rootState), this.rootStateMap);
  }

  use(middleWare) {
    this.rootStateMiddlewares.push(middleWare);
    this.updateState();
    return this;
  }
}