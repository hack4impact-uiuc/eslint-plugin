workflow "CI" {
  on = "push"
  resolves = ["Build"]
}

action "Install" {
  uses = "actions/npm@master"
  args = "install"
}

action "Audit" {
  uses = "actions/npm@master"
  args = "audit"
}

action "Format" {
  needs = "Install"
  uses = "actions/npm@master"
  args = "run format:check"
}

action "Lint" {
  needs = "Install"
  uses = "actions/npm@master"
  args = "run lint"
}

action "Build" {
  needs = "Install"
  uses = "actions/npm@master"
  args = "run build"
}
