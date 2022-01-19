# Devo Application Builder Client

This is a client tool for building and testing applications for Devo
platform.

## Features

- Create apps based on templates.
- Test the applications on the Devo platform.
- Verify the requirements for a suitable enviroment.

## Requirements

- Git
- Node >= 8.0.0
- npm >= 6.0.0
- Devo account
- [Devo Runner](https://chrome.google.com/webstore/detail/devo-runner/apjjdfhcegcemhdhaeadkddbjhgfplmo) extension for Chrome

## Installation

```
sudo npm install -global
```

## Usages

Run the client with the `dab-cli` command.

#### Check

Check the system for a suitable environment.

```
dab-cli check
```

### Help

To see all the params use --help.

```
dab-cli [command] --help
```

#### Create

Create a new folder with the application content in the current directory.

```
dab-cli create <name> [--template <template>]
```

Params:

- `app_name`: Name of the application to generate. You can include the path
  where you want to generate it, otherwise it will be generated in the current
  directory.
- `template`: Zip file or git repository URL to use as template.

By default, the template used is the one from the 
[git@github.com:DevoInc/applications-builder-template.git](https://github.com/DevoInc/applications-builder-template) 
repository. 
You can use another template specifying a zip file path or a git repository.
#### Build

Build the application for a specific mode. Execute this command from the root directory of the application.

```
dab-cli build <mode> [--release]
```

Params:

- `mode`: The build mode used. It can be: `dev`, `pre` or `pro`.
- `release`: Prepend the timestamp to the name file and save it in the `releases` folder.

Modes:

- `dev`: Development mode. Watches for changes in the code and lets us use
  [Devo Runner](https://chrome.google.com/webstore/detail/devo-runner/apjjdfhcegcemhdhaeadkddbjhgfplmo). The code is not minified.
- `pre`: Pre-production mode. Builds minified code but lets us use the
  [Devo Runner](https://chrome.google.com/webstore/detail/devo-runner/apjjdfhcegcemhdhaeadkddbjhgfplmo).
- `pro`: Production mode. Builds minified code ready for upload to Devo.


Remember its important you make `npm install` in the project folder before you
can make one build of the project.

#### Translations

Check the translations included in the application.
Execute this command from the root directory of the application.

```
dab-cli trans
```
