import DefineEnvsPlugin from "webpack-define-envs-plugin";
import PyodidePlugin from "@pyodide/webpack-plugin";
//import HtmlWebpackPlugin from "html-webpack-plugin";
//import pkg from 'webpack-subresource-integrity';
//const { SubresourceIntegrityPlugin } = pkg;

/** @param {import("webpack").Configuration} config */

export function webpack(config) {
      
      config.output.crossOriginLoading="anonymous";

      const pyP=new PyodidePlugin({
            packageIndexUrl:"https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
            globalLoadPyodide:true
        });
      config.plugins.push(
        new DefineEnvsPlugin(["OPENAI_API_KEY"], "GLOBAL"),
        pyP,
        //new SubresourceIntegrityPlugin(),
      );
      //console.log(config);

	  return config;
}