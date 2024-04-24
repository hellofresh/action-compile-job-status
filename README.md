# action-compile-job-status

You can use branch protection rules in GitHub pull requests to require specific status checks to pass before merging a pull request. In more complex workflows, especially if you have different workflow files to perform different jobs, you might want to require a specific status check that might not run for every PR, making it impossible to define a required status check.

With this action, you can consolidate workflow results in a single PR status check, making it possible to define a required check.

# Usage

```yaml
jobs:
  compile:
    name: compile-status

    # Explicit permissions required for the action
    # Can be omitted if default permission for GITHUB_TOKEN in the organization/repository level are set in permissive mode
    #
    # https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token

    permissions:
      checks: write
      actions: read

    steps:
      - uses: hellofresh/action-compile-job-status@v2
        with:
          check-run-name: ci-checks
          check-run-title: Required check
          ignore-jobs: ".*Best-practice|Report|compile*"
```
