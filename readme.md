## Folders
1. `frontend` - react app 
1. `backend` - API for serving the frontend
1. `cms` - Strapi CMS setup files (no database)
1. `infra` - Terraform and script files for infrastructure

## Develop
### Things you need to install:

1. [Visual Studio Code](code.visualstudio.com/), latest version
1. [Node](nodejs.org), latest 16.* version
1. [MySQL](https://dev.mysql.com/downloads/installer), version 8.0

### Install, run and test locally

1. Open any terminal and install `yarn` package manager: `npm install -g yarn`
1. In Visual Studio Code open the repository
1. Install MySQL Developer Default setup type. During setup create a new user (with db admin role) and password and put them in the .env file for CMSSTRAPI. Use Legacy Authentication when asked. More details on [Strapi blog.](https://strapi.io/blog/configuring-strapi-mysql-database). Open MySQL Workbench and add a new schema called `cms-db-test`.
1. Open a terminal from Terminal menu
1. Run `yarn install` to install all the node dependencies in `cmsstrapi`, `backend` and `frontend` folders
1. From Debug pane of Code start the CMS, the backend and the frontend debugging sessions
1. Your default browser should automatically open `localhost:3000` with this application
1. The API is available at `localhost:3001`
1. The CMS Strapi instance will be started at `localhost:3002`

### Workflow
1. Create `feature` branch from `main`
2. When you finished implementing, or you need to test it on Staging, push the branch
3. Merge the branch to `staging` branch, and push `staging`
4. To deploy your changes to [https://azsplatform.ro/](https://azsplatform.ro/) run below actions using your `branch-name` or `staging`:
   - Run `Web - Image Build` to build a new image.
   - Run `Web - Deploy AZSPlatform` to deploy the newly built image.
5. If you also did some changes to [https://cms.azsplatform.ro/](https://cms.azsplatform.ro/) then run:
   - Run `Strapi - Image Build` to build a new image.
   - Run `Strapi - Deploy AZSPlatform` to deploy the newly built image.
6. If you need some more changes to the feature, then work again on the feature branch and merge again to staging, then run the corresponding Actions again.
6. When you finished the feature and is tested by you and by someone else, create a PR from `feature` branch to `main`.
7. After Code Review merge the PR.
8. To deploy the web app to production instances: run `Web - Deploy Prods` Action, using `main` branch.
9. To deploy to CMS to production instances: run `Strapi - Deploy Prods` Action, using `main` branch.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
