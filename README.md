# BIL-Admin-App

Before you begin, you need:
grunt cli (`npm install -g grunt-cli`)
sass (`gem install sass`)

once cloned, from the BIL-Admin-App directory:

`npm install` and then `grunt initialize` (first time only)

Then, while developing, you can use:
`grunt` to compile the app and 
`grunt watch` to watch while you develop which compiles the JS and the SCSS.

Serve the the app page using a web server (MAMP or whathaveyou), not just opening the file in a browser (index.html)

The app is organized into components that are meant to be modular and reusable. They are React components (https://facebook.github.io/react/docs/getting-started.html) so would be useful to be familiar with React module lifecycles and how `state` and `props` work.

You can trace through how the app works by starting with `App.js` in the `components` directory and following the logic of how each component calls/passes properties to another.

`Utils` is the namespace where our non-React custom components are. There are currently two:
- Utils.Store is the global state where we put things like the user's token and info, user's current happenings from the server, etc.
- Utils.Dispatcher is our custom event pubsub system where components that don't have a parent/child relationship can subscribe to and publish events to each other. This is primarily how the Store is updated, Errors and surfaced and Alerts are done.

Ticket/bug tracking is done through Zoho Bugtracker (https://projects.zoho.com/portal/jessicachan#dashboard/792235000000014021)

No set release cycles yet, we're just doing them when we get done with a chunk of things. Pull the latest from develop and checkout a branch tracking it to work on your new feature. Then do a pull request when you're done back against develop.
