/**
 * a model that bridge between python and js via Pyodide
 * APIs: 
 *  init_py(),install pyodide model and related python wheels
 *  runPython(pyScript), run specific API in python model
 *  passPara(nameSpace), pass parameter to python
 */

const { loadPyodide } = require("pyodide");

var pyodide = null;

async function init_py() {

    pyodide = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/" });//`${window.location.origin}/pyodide`
    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    await micropip.install('assets/pyModel-0.1-py3-none-any.whl');
    //await micropip.install('assets/sentence_transformers-2.5.0.dev0-py3-none-any.whl');
}

function passPara(my_js_namespace) {
    pyodide.registerJsModule("my_js_namespace", my_js_namespace);
}

// example of pyScript: `
//from pyModel import nlpModel
//        nlpModel.testAPI()
//        `
async function runPython(pyScript) {
    return pyodide.runPythonAsync(pyScript);

}

export {
    init_py,
    passPara,
    runPython
}