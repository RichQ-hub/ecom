# COMP3900 Capstone Project - EcoM Platform

[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=15178218&assignment_repo_type=AssignmentRepo)

## Contributors

| Name               | Role                    |
| ------------------ | ----------------------- |
| Yasiru Jayasooriya | Product Owner / Backend |
| Jason Meas         | Scrum Master / Frontend |
| Ishita Prasad      | Frontend                |
| Rumman Rauf        | Backend                 |
| Richard Quisumbing | Frontend                |
| Ge Liao            | Frontend                |

## About EcoM

The EcoM project aims to develop a comprehensive web application with a robust API and a user-friendly front-end interface. The application will enable users to manage and analyze ESG data, select ESG frameworks, adjust metrics' weights, and generate detailed reports.

The EcoM project aims to develop a comprehensive web application with a robust API and a user-friendly front-end interface. The application will enable users to manage and analyze ESG data, select ESG frameworks, adjust metrics' weights, and generate detailed reports.

## Docker Setup

### Environment Variables

#### Frontend

- To prevent accidentally leaking env variables to the client, only variables prefixed with `VITE_` in `docker-compose.yml` are exposed to your Vite-processed code.
- Loaded env variables are also exposed to your client source code via `import.meta.env.VITE_VARIABLE` as strings.

#### Backend

Same as above, but without prefixing variables with `VITE_`.

### Execution

1. Clone this repository.
2. Run Docker Desktop ([Installation](https://www.docker.com/products/docker-desktop/))
3. From the project directory, run `docker-compose up` to start all the services defined in docker-compose.yml
4. Visit `localhost:3333` on a web browser to see the app running.

### Making changes in the code

To see changes you've made in the repository, run the following commands to rebuild and run the images created by `docker-compose up`.

```bash
docker-compose down
docker-compose build
docker-compose up --watch
```

> Note: Frontend has docker watch enable to allow automatic updates as you edit and save your files.
>
> More details here: https://docs.docker.com/compose/file-watch/

## Frontend Testing

### Unit Tests

#### Local Testing

Our primary testing library for unit testing is the **React Testing Library (RTL)**.

To run your test suite locally simply run in the ./frontend folder:

```bash
yarn test
```

OR generate a coverage report by running:

```bash
yarn coverage
```

#### In docker

To run the test suite and generate a coverage report for the frontend while integrated with the backend and database containers, simply run the following while Docker Desktop is active:

```bash
docker-compose --profile test up
```

**Reference**: https://www.barrydobson.com/post/react-docker/

### End-to-End Testing

Our chosen testing framework for end-to-end testing is **cypress**. To ensure that it works correctly, ensure the docker container is running via `docker-compose up`.

Then in a separate terminal, simply run the cypress tests inside the frontend folder via:

```bash
cd frontend
yarn cy:open
```

**Next Steps**

1. On the newly opened Cypress Launchpad, select `E2E Testing`.
2. Select your favourite browser.
3. Click on any E2E spec and see it in action!

## Backend Testing

To run the backend tests, first run the application on Docker in one terminal. Then, in another terminal go into the directory `backend_tests`. Install the following Python modules (e.g. using a virtual environment)

- `requests`
- `pytest`
- `mysql-connector-python`

Then run the command `pytest` in the second terminal to run the backend tests.
