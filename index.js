const core = require('@actions/core');
const github = require('@actions/github');
import tablemark from 'tablemark';

const main = async () => {
  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;
  const runId = core.getInput('target-run-id', {
    required: true,
  });
  const token = core.getInput('github-token', {
    required: true,
  });
  const ignoreJobsRegex = core.getInput('ignore-jobs', {
    required: true,
  });
  const checkRunTitle = core.getInput('set-context', {
    required: true,
  });
  const checkRunName = core.getInput('check-run-name');

  // see: https://octokit.github.io/rest.js/v18
  // eslint-disable-next-line new-cap
  const octokit = new github.getOctokit(token);

  // see: https://octokit.github.io/rest.js/v18#actions-list-jobs-for-workflow-run
  const {
    data: jobsList,
  } = await octokit.rest.actions.listJobsForWorkflowRun({
    owner,
    repo,
    runId,
  });


  /**
   * set ignoreJobsRegex value to github context job name if not set
   * else concat ignoreJobsRegex with github context job name
   */
  if (!ignoreJobsRegex) {
    ignoreRegex = github.context.job;
  } else {
    ignoreRegex = `${ignoreJobsRegex}|${github.context.job}`;
  }

  const filteredJobs = jobsList.jobs.filter(
      (job) => !job.name.match(ignoreJobsRegex),
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
      summary: tablemark(filteredJobs),
      text: tablemark(filteredJobs),
    },
  });
};

main();
