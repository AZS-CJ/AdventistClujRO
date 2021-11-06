## Folders
1. `frontend` - react app 
1. `backend` - API for serving the frontend
1. `cms` - Strapi CMS setup files (no database)
1. `infra` - Terraform and script files for infrastructure

## Develop
### Things you need to install:

1. [Visual Studio Code](code.visualstudio.com/)
1. [Node](nodejs.org), latest 16.* version

### Install, run and test locally

1. Open any terminal and install `yarn` package manager: `npm install -g yarn`
1. In two Visual Studio Code open `frontend` and `backend` folders
1. Open a terminal from Terminal menu in each Code instance
1. Run `yarn install` to install all the node dependencies for both folders
1. Run `yarn run` to start the development server, first for backend and then for frontend
1. Your default browser should automatically open `localhost:3000` with this application
1. The API is available at `localhost:3001`

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
