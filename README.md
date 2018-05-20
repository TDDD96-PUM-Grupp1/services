# IoT Party Services 
This project was carried out by eight students at Linköping University as a part of our Bachelor project and is licensed under MIT.

The purpose of the service is to keep track of all the UIs that are running on the deepstream server. This service then updates the controller when new instances are being created or some parts of it changes. 

# Dependencies 
In order to run the game for this project the user need four different repositories which are listed below:
* [Server](https://github.com/TDDD96-PUM-Grupp1/server) - This runs the deepstream server that handles the network connections.
* [UI](https://github.com/TDDD96-PUM-Grupp1/ui) - This hosts the Javascript files for the UI.
* [Controller](https://github.com/TDDD96-PUM-Grupp1/controller) - This hosts the Javascript files for the Controller.
* [Services](https://github.com/TDDD96-PUM-Grupp1/services) - This hosts services that handles all instances that are currently running, this makes it possible to run multiple instances of the UI.

The corresponing setup is described in their respective GitHub repositories.

# Installation
The instructions will be using yarn as package manager. See [npm vs yarn cheat sheet](https://shift.infinite.red/npm-vs-yarn-cheat-sheet-8755b092e5cc) for npm equivalents.

To download and install all the Javascript packages run these commands in your prefered terminal:

```
git clone git@github.com:TDDD96-PUM-Grupp1/services.git
yarn
```

If you cannot use ssh to clone the repository you can use the https command instead:
```
git clone https://github.com/TDDD96-PUM-Grupp1/services.git
yarn
```

Now that you have the Service and all the needed packages you can host it in a few ways depending on your use-case:

## Server using Windows Docker
This will host the services and connect to a deepstream server at deepstream:6020 with the authentication tokens taken from http://authenticator:3000/getAuthToken. This part of the setup was not made by the bachelor students, as such no clear information to set the authenticator up can be described.
```
yarn start-pc
```

## Locally using Windows
This will host the services and connect to a deepstream server that is running locally within the network.

**NOTE:** This will only work if the deepstream server is in the same network as the services.
```
yarn start-pc-local
```

## Server using Linux Docker
This will host the services and connect to a deepstream server at deepstream:6020 with the authentication tokens taken from http://authenticator:3000/getAuthToken. This part of the setup was not made by the bachelor students, as such no clear information to set these up can be described.
```
yarn start
```

## Locally using Linux
This will host the services and connect to a deepstream server that is running locally within the network.

**NOTE:** This will only work if the deepstream server is on the same network as the services.
```
yarn start-local
```
