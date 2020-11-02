import auth from "./modules/auth";
import config from "./modules/config";

export default {
  namespaced: true,
  modules: {
    auth,
    config
  }
};
