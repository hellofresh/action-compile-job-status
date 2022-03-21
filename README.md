# action-compile-job-status
GitHub Action compiling all job status of a workflow run

# Usage

Example workflow with dynamic jobs
```yaml
name: Clusters 

on:
  pull_request:
    branches:
      - master

jobs:
  changed-directories:
    name: Generate job matrix
    runs-on: [ self-hosted, default ]
    outputs:
      matrix-eks: ${{ steps.set-matrix-eks.outputs.matrix }}
  eks-terraform:
    name: EKS Terraform
    needs: [ changed-directories ]
    runs-on: [ self-hosted, default ]
    strategy:
      fail-fast: false
      matrix: ${{ fromJson(needs.changed-directories.outputs.matrix-eks) }}
    if: ${{ fromJson(needs.changed-directories.outputs.matrix-eks).include[0] }}
    steps:
      - name: Run terraform
        uses: ./.github/actions/terraform
        with:
          dir: eks/${{ matrix.environment }}
          command: plan

  # Example use
  # Job to compile status from all jobs and set context 
  compile:
    name: compile-status
    needs: [ namespace ]
    runs-on: [ self-hosted, default ]
    steps:

      - uses: hellofresh/action-compile-job-status@v0.1.0
        with:
          check-run-name: ci-checks
          ignore-jobs: ".*Best-practice|Report|compile*"
          check-run-title: Title
```

## Reference

|   	|   	|   	|   	|   	|
|---	|---	|---	|---	|---	|
|   	|   	|   	|   	|   	|
|   	|   	|   	|   	|   	|
|   	|   	|   	|   	|   	|