# OpenFemaNgClient

<img align="right" src="./src/assets/icons/opoenFemaNgClient_logo.ico">

FEMA has released a wide variety of data for public use over the last decade. Their OpenFEMA project provides extensive, historic disaster-related data. It is well documented at: <https://www.fema.gov/about/reports-and-data/openfema>. However there are not many samples illustrating ways to display and analyze the data without advanced programming skills.

OpenFemaNgClient is an Angular (i.e., 'Ng') and Typescript application that provides one such sample approach for accessing a few of these data sets with ubiqitious JavaScript. Initially this is a proof of concept, with encouragement it could be fortified into an enterprise ready tool!

## Features

- Displays dataset using List, Card, Ag-Grid Grid and Google Map views
- Provides coding sample using latest versions of Angular & Typescript
- Open Source, freely available using the permisive MIT license

## Known/Planned Issues

- Only displays the Disaster Declarations dataset
- Only brings in the top 1000 rows for now
- Doesn't have practical analysis

## Roadmap

With encouragement/funding:

- Select any of the datasets for display
- Support access to key API parameters
- Move 'View' component code to an 'abstract' class where possible for consistency and streamlined sharing of code
- More analysis & filtering options to aid analysis/investigation
- Trend displays

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.6.

## Building this web page

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. (Or do the previous more succinctly with just 'ng s -o'.) The application will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Public Feedback & Contribution

We encourage your feedback and contributions to this repository. Content suggestions and discussions (specific to OpenFemaNgClient) can be communicated in the following ways:

- GitHub “issues.” Each issue is a conversation about specific project work initiated by a member of the public.
- GitHub "discussions". Each discussion is a project communication forum. Discussions are not specific to elements of work like a pull request. We encourage you to browse and join in on discussions or start a new conversation by creating a new discussion.
- Direct changes and line edits to the content may be submitted through a "pull request" by clicking "Edit this page" on any site page in the repository. You do not need to install any software to suggest a change. You can use GitHub's in-browser editor to edit files and submit a pull request for your changes to be merged into the document. Directions on how to submit a pull request can be found on GitHub.
- Send your content suggestions or proposed revisions to the OpenFemaNgClient team via email to OpenFemaNgClient@eoc.online.

## eoc.online

<img align="right" src="./src/assets/imgs/MIT_License.png">

<http://eoc.online> provides free tools for Emergency Operations Centers and local CERT/VOAD/Citizen Corps groups. For more information check out <http://eoc.online>. We'd LOVE to get your reports of use and suggestions for enhancement.

To report issues please visit <https://github.com/EOCOnline/OpenFemaNgClient/issues>.

©2022 eoc.online, under the MIT License
