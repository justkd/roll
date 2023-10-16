# [template-ts-npm-package](https://github.com/justkd/template-ts-npm-package)

![CircleCI](https://img.shields.io/circleci/build/gh/justkd/template-ts-npm-package/master?token=5d76eb51f1f5547eb2c610645c07272cbb149f58&style=for-the-badge&logo=circleci)

![npm](https://img.shields.io/npm/dw/%40justkd/template-ts-npm-package?style=for-the-badge&logo=npm&label=NPM)

GitHub template repo for building an NPM package.

## Use

- Clone the template to create a new GitHub repo.
- Configure your project. Instructions are below.
- `cd` into the project directory and run `nvm use` to switch to the configured `node` version found in `.nvmrc`.
- `yarn` or `npm i` to install node modules.
- Start building your module in `src`.
- `yarn build` to generate `lib` and `docs`.
- `yarn publish` or `yarn publish-public` to publish to `npm`.

> NPM may ask you to login/adduser to publish. In codesandbox, when you run `npm adduser` you will need to copy 
> the link it provides and log in in a separate browser window. Do not click to open the link from the terminal. 
> Leave the prompt open and it will progress after login in the other window.

## Setup your package config

### Fields you may need to update in `package.json`

```
{
  "name",
  "author",
  "version",
  "license",
  "description",
  "keywords",
  "repository: {
    "url"
  }
}
```

### Other files that may need attention

- `.nvmrc`
  - Set to the target `node` version your project will use.
- `CONTRIBUTING.md`
- `LICENSE`
  - Name and date for copyright notice.
  - Or replace with new license matching type you put in `package.json`.
- `README.md`
  - Replace this sucker with your own project readme.
  - Update the header link.
  - Update the NPM badge link.
    - Replace or remove the scope `%40justkd`.
    - Replace the package name `template-ts-npm-package`.
  - Update CLCI badge link:  
    `https://img.shields.io/circleci/build/gh/GH_USERNAME/REPO_NAME/BRANCH_NAME?token=API_TOKEN&style=for-the-badge&logo=circleci`
    | Script        | Example                           | Description
    | :------------ | :-------------------------------- | :----------
    | _GH_USERNAME_ | eg. justkd                        | Your GitHub username.
    | _REPO_NAME_   | eg. template--ts-npm-package      | The name you gave your repo on GitHub.
    | _BRANCH_NAME_ | eg. master                        | The name of the branch being targeted.
    | _API_TOKEN_   | eg. blahBlah91blah12081238951Blah | The individual project `Status` level API token from CLCI.

## Included package scripts

| Script                   | Description
| :----------------------- | :----------
| `npm run test`           | Run tests on demand.
| `npm run watch`          | Run tests on change.
| `npm run build`          | Shortcut to run, `build:lib`, `build:docs`, and `minify`.
| `npm run build:lib`      | Build module (replaces files in `./lib`).
| `npm run build:docs`     | Build the documentation using [TypeDoc](http://typedoc.org) and [TypeDoc Markdown](https://github.com/tgreyuk/typedoc-plugin-markdown/tree/master/packages/typedoc-plugin-markdown) (replaces files in `./docs`).
| `npm run minify`.        | Minify `.js` files found in `./lib` and `./docs`.
| `npm run publish`        | Publish the contents of the `./lib` folder and `./README.md` to NPM as a private package.
| `npm run publish-public` | I know. Just let me be thorough ok? Publish the contents of the `./lib` folder and `./README.md` to NPM as a public pacakage.

## (optional) Setting up GitHub Pages and CircleCI

### GitHub Pages

Set up a GitHub Pages site for your package as a _project site_ with the following steps:

1. Follow the instructions in the [GitHub Pages Docs](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) to set up Pages on your GitHub account or organisation if not already configured.
2. Go to your repository for this package on GitHub and click `Settings`
3. Click `Pages`
4. Configure the branch as `main` (or `master`) and the directory to `./docs`
5. Configure the remaining settings as per your own preferences

### CircleCI

A basic [CircleCI](https://circleci.com) config is included in this template.

1. Login to [CircleCI](https://circleci.com) with GitHub
2. Click "Projects"
3. Click "Set up project" for this repository and follow the instructions
4. Go to project settings and select "status badges"
5. Add an API key to your project
6. Copy the new API key and replace the token and project name in the status badge placeholder at the top of this readme

Also consider setting up branch protection and requiring passing checks from CircleCI for pull requests.
