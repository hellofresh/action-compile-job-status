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
      const ignore_regex = core.getInput('IGNORE_JOBS', { required: true });
  
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

  
      /**
       * Loop over all the jobs that were executed in the run and store them in a variable.
       **/
      var integral_jobs = []
      var all_jobs = []
       for (const job of jobs_list.jobs) {
        /** 
         * copy status, name, and conclusion to a new object
         * 
         *  
         * check if the job.name matches the regex provided by the user(ignore_regex)
         * if it does not match, then we will add it to the integral_jobs array
         * if it does match, then we will skip it
          **/
        all_jobs.push({name: job.name, status: job.status, conclusion: job.conclusion})

        if(!job.name.match(ignore_regex)){
          integral_jobs.push({name: job.name, status: job.status, conclusion: job.conclusion})
        }
           
       }
       /**
        * check if the conclusion of all the jobs is success
        * if it is not success, then we set status to failure
        * else we set status to success
        * 
        **/
        var status = 'success'
        for (const job of integral_jobs) {
          if(job.conclusion != 'success'){
            status = 'failure'
          }
        }

        /**
         * Now we export the variable to the environment.
         * also set and export the `status` variable.
         * Reference: https://octokit.github.io/rest.js/v18#actions-create-status
        **/

         core.exportVariable(output_env, status);
         core.setOutput('status', status);

        /**
         * Output the variables to the console.
         * This will be displayed in the GitHub Actions UI.
         * 
         * Reference: https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions
        **/
        core.startGroup('All Job Details');
        core.notice(JSON.stringify(all_jobs, null, 2));
        core.endGroup('All Job Details');

        core.startGroup('Integral Job Details');
        core.notice(JSON.stringify(integral_jobs, null, 2));
        core.endGroup('Integral Job Details');

        /** create check_run with status variable for this pull_request
         * 
         * Reference: https://octokit.github.io/rest.js/v18#checks-create-check-run
        **/ 
        const { data: check_run } = await octokit.rest.checks.createCheckRun({
          owner,
          repo,
          name: 'Status Check',
          head_sha: github.context.sha,
          status: status,
          output: {
            title: 'Job Status Compilation',
            summary: 'Integration',
            text: JSON.stringify(all_jobs, null, 2),
          }
        });
        

    } catch (error) {
      core.setFailed(error.message);
    }
  }
  
  // Call the main function to run the action
  main();
