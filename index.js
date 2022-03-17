const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {
    try {
      /**
       * We need to fetch all the inputs that were provided to our action
       * and store them in variables for us to use.
       **/
      const owner = github.context.repo.owner;
      const repo = github.context.repo.repo;
      const run_id = core.getInput('TARGET_RUN_ID', { required: true });
      const output_env = core.getInput('OUTPUT_ENV_NAME', { required: true });
      const token = core.getInput('GITHUB_TOKEN', { required: true });
  
      /**
       * Now we need to create an instance of Octokit which will use to call
       * GitHub's REST API endpoints.
       * We will pass the token as an argument to the constructor. This token
       * will be used to authenticate our requests.
       * You can find all the information about how to use Octokit here:
       * https://octokit.github.io/rest.js/v18
       **/
      const octokit = new github.getOctokit(token);
  
      /**
       * We need to fetch the list of jobs that were executed in the  in the run
       * and store them in a variable.
       * We will use the `listJobsForRun` method of the Octokit API.
       * Reference: https://octokit.github.io/rest.js/v18#actions-list-jobs-for-workflow-run
       */
      const { data: jobs_list } = await octokit.rest.actions.listJobsForWorkflowRun({
        owner,
        repo,
        run_id,
      });
      
  
      console.log(`${jobs_list}`);
      
      core.info(`${jobs_list}`);
  
      /**
       * Loop over all the jobs that were executed in the run and store them in a variable.
       **/
      for (const job of jobs_list) {
          pass
      }

        /**
         * Now we export the variable to the environment.
         * also set and export the `status` variable.
         * Reference: https://octokit.github.io/rest.js/v18#actions-create-status
        **/

        /**
         * Output the variables to the console.
         * This will be displayed in the GitHub Actions UI.
         * 
         * Reference: https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions
        **/
        core.startGroup('Job Details');
        core.notice(jobs_list);
        core.endGroup('Job Details');

        core.exportVariable(output_env, status);
        core.setOutput('status', status);

        /** create check_run with status
         * 
         * Reference: https://octokit.github.io/rest.js/v18#checks-create-check-run
         */ 
        

    } catch (error) {
      core.setFailed(error.message);
    }
  }
  
  // Call the main function to run the action
  main();