/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 806:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 946:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 161:
/***/ ((module) => {

module.exports = eval("require")("tablemark");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__nccwpck_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__nccwpck_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__nccwpck_require__.r(__webpack_exports__);
/* harmony import */ var tablemark__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(161);
/* harmony import */ var tablemark__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nccwpck_require__.n(tablemark__WEBPACK_IMPORTED_MODULE_0__);
const core = __nccwpck_require__(806);
const github = __nccwpck_require__(946);


const main = async () => {
  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;
  const runId = core.getInput('target-run-id');
  const token = core.getInput('github-token');
  const ignoreJobsRegex = core.getInput('ignore-jobs');
  const checkRunTitle = core.getInput('check-run-title');
  const checkRunName = core.getInput('check-run-name');
  
  console.log(github.context);

  // see: https://octokit.github.io/rest.js/v18
  const octokit = new github.getOctokit(token);

  // see: https://octokit.github.io/rest.js/v18#actions-list-jobs-for-workflow-run
  const response = await octokit.rest.actions.listJobsForWorkflowRun({
    owner,
    repo,
    runId,
  });

  const filteredJobs = response.data.jobs.filter(job => !ignoreRegex || !job.name.match(ignoreJobsRegex));
  const failure = filteredJobs.some(job => job.conclusion == 'failure');

  // see: https://octokit.github.io/rest.js/v18#checks-create-check-run
  await octokit.rest.checks.create({
    owner,
    repo,
    name: checkRunName,
    head_sha: github.context.payload.pull_request.head.sha,
    status: "completed",
    conclusion: failure ? "failure" : "success",
    output: {
      title: checkRunTitle,
      summary: tablemark__WEBPACK_IMPORTED_MODULE_0___default()(filteredJobs),
      text: tablemark__WEBPACK_IMPORTED_MODULE_0___default()(filteredJobs),
    }
  });
}

main();
})();

module.exports = __webpack_exports__;
/******/ })()
;