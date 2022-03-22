const core = require('@actions/core');
const github = require('@actions/github');
import tablemark from 'tablemark';

const main = async () => {
  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;
  const token = core.getInput('github-token', {
    required: true,
  });
  const ignoreJobsRegex = core.getInput('ignore-jobs', {
    required: false,
  });
  const checkRunTitle = core.getInput('check-run-title', {
    required: true,
  });
  const checkRunName = core.getInput('check-run-name');

  // see: https://octokit.github.io/rest.js/v18
  // eslint-disable-next-line new-cap
  const octokit = new github.getOctokit(token);

  // see: https://octokit.github.io/rest.js/v18#actions-list-jobs-for-workflow-run
  const response = await octokit.rest.actions.listJobsForWorkflowRun({
    owner,
    repo,
    run_id: github.context.runId,
  });

  // FIXME: the current context doesn't have the numerical job ID, which makes
  // it impossible to properly match to jobs returned from the API.
  // Since we later match to only failed jobs, it's not a problem for now.
  const filteredJobs = response.data.jobs.filter(
      (job) => (job.status == 'completed' && (!ignoreJobsRegex ||
        !job.name.match(ignoreJobsRegex))),
  );
  const failure = filteredJobs.some((job) => job.conclusion == 'failure');

  // see: https://octokit.github.io/rest.js/v18#checks-create-check-run
  await octokit.rest.checks.create({
    owner,
    repo,
    name: checkRunName,
    head_sha: github.context.payload.pull_request.head.sha,
    status: 'completed',
    conclusion: failure ? 'failure' : 'success',
    output: {
      title: checkRunTitle,
      summary: tablemark(filteredJobs.map((job) =>
        ({name: job.name, conclusion: job.conclusion}))),
    },
  });
};

main();
