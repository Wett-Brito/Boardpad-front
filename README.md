# Boardpad - Frontend

An `Angular 13` application that consists in a fast and non bureaucratic task management using a `Kanban` view.

**Boardpad works like a draft when you need a Kanban board punctually.**

With Boardpad you are capable to create public boards and do your drafts before you start using (when it's necessary) 
some really serious Kanban board application like Trello, Github Projects, Azure Devops or any other Kanban task manager.

## Security

**Boadpad is not focused at the security.** All routes present in Boardpad is PUBLIC and don't have ANY access control. 

**What it means?** Any person can edit your things (tasks, columns, ...) just using the same URL that you were using.

**Boardpad Philosophy is:** "_Do you want safety? Call cops._ [2023, Boardpad]"



## Features

- Create boards with custom URL
- Creating, listing, updating, and deleting Kanban status columns.
- Creating, listing, updating, and deleting of tasks.

## Development server

You'll need to setup the backend. If you want to see more details and how to set the backend, visit the backend ["How to Setup"](https://github.com/GustavoReinaldi/BoardPad-Back#how-to-setup) tutorial section.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Or you can run command ng serve --o and the terminal will start your browser in the correct url automatically.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.
