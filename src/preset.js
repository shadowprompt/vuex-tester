import storeModules from './modules';
import VuexTester from './vuex-tester';
const project = process.env.project;


let response = [];

export const setResponse = res => response.push(res);

const languageList = [
  {
    languageCode: "en_US",
    language: "English",
    remark: "英文"
  },
  {
    languageCode: "zh_CN",
    language: "简体中文",
    remark: "简体中文"
  }
];

const instance = new VuexTester(project, storeModules);
instance.use(function (stateMap) {
  stateMap.pim.root.langResult = Promise.resolve({
    status: 200,
    data: { code: "success", data: { languageList } }
  });
  stateMap.pim.root.languageList = [
    {
      languageCode: "zh_CN",
      language: "简体中文",
      remark: "简体中文"
    }
  ];
  stateMap.pim.root.defaultLang = "zh_CN";
  stateMap.pim.root.currentLang = "zh_CN";
  return {
    Axios: {
      post: () => Promise.resolve(response.pop()),
      get: () => Promise.resolve(response.pop()),
    },
    Api: {
      pim: {},
    },
    ...stateMap,
  };
});

export const testerInstance = instance;
