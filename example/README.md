# napster.js Sample App

### Getting Started

First add the following callback url to the application setting on [developer.napster.com](https://developer.napster.com)

```
http://localhost:2000/authorize
```

In `server.js` replace the `apiKey` and `apiSecret` variable placeholder values with your application's credentials. In `client.html` replace the `API_KEY` variable placeholder value with your application's credentials.

This application requires node.js. If you have not previously installed it please follow the instructions at [nodejs.org](https://nodejs.org). Run the following commands in the example app directory.

```
npm install
```

### Running the application

Now you should be ready to run the app. From inside the example app directory run:

```
node server.js
```

That's it! Once the server application is running you can navigate in the browser to [localhost:2000](http://localhost:2000).

NOTE: Make sure Flash is supported in your browser.
