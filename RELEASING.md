# Releasing Thesis

#### Preflight sanity checks

1. make sure you're in the project root directory
1. switch to the `master` branch: `git checkout master`
1. you have all latest updates: `git pull`
1. you have no changes to push and no staged changes.
1. run `./bin/ci` and ensure all tests pass

#### Pushing a new release

1. run `mix hex.user whoami`
1. check if your hex user is in the [owner's list](https://hex.pm/packages/thesis) of the package (if not, you will need to get added as an owner)
1. update the version number in:
  - `./mix.exs`
  - `./package.json`
  - `./README_INSTALL.md`
  - `./README.md` (also update the changelog)


1. shipit: `npm run shipit` (yes, npm here)
1. push the np version changes up: `git push`
1. you win.

#### Verify

`yarn info gluegun dist-tags` shows you what everyone sees.

```sh
yarn info gluegun dist-tags
```

shows:

```
yarn info v1.1.0
{ latest: '1.0.0',
 next: '2.0.0-alpha.2' }
✨  Done in 0.71s.
```

#### To Use 2.0 Alphas

In your project:

`yarn add gluegun@next`

Every time run you update, it'll grab the latest published version.

For the CLI:

`yarn global add gluegun@next`