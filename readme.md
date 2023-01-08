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
1. In Visual Studio Code open the repository
1. Open a terminal from Terminal menu
1. Run `yarn install` to install all the node dependencies in `backend` and `frontend` folders
1. From Debug pane of Code start the backend and the frontend debugging sessions
1. Your default browser should automatically open `localhost:3000` with this application
1. The API is available at `localhost:3001`

### Workflow
1. Create `feature` branch from `main`
2. When you finished implementing, or you need to test it on Staging, push the branch
3. Merge the branch to `staging` branch, and push `staging`
4. Run `WebApp - Test` Action on Github, using `staging` branch to deploy your changes to [https://test.adventistcluj.ro/](https://test.adventistcluj.ro/)
5. If you also did some changes on cms then run `Strapi Image Build` Action, then `Strapi - Deploy Test` Action, using `staging` branch
6. If you need some more changes to the feature, then work again on the feature branch and merge again to staging, then run the corresponding Actions again
6. When you finished the feature and is tested by you and by someone else, create a PR from `feature` branch to `main`
7. After Code Review merge the PR
8. Run `WebApp - Prod` Action on Github, using `main` branch to deploy to [https://adventistcluj.ro/](https://adventistcluj.ro/)
9. If you also did some changes on cms then run `Strapi Image Build` Action, then `Strapi - Desploy Prod` Action, using `main` branch

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
