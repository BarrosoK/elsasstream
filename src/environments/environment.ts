// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  name: 'Elsasstream',
  desc: 'blabla',
  api: 'http://92.92.192.178:4242/',
  firebase: {
    apiKey: 'AIzaSyAy8eN2Jkttd4W3ByZMhgvwkmnQwRnl7zA',
    authDomain: 'elsasstream.firebaseapp.com',
    databaseURL: 'https://elsasstream.firebaseio.com',
    projectId: 'elsasstream',
    storageBucket: 'elsasstream.appspot.com',
    messagingSenderId: '911011388198'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
