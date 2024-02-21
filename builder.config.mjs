import DefineEnvsPlugin from "webpack-define-envs-plugin";

/** @param {import("webpack").Configuration} config */

export function webpack(config) {
    //console.log(config.plugins);
      config.plugins.push(
        new DefineEnvsPlugin(["OPENAI_API_KEY"], "GLOBAL"),
      );
	  return config;
}