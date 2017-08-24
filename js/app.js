// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
  baseUrl: 'js/lib',
  shim : {
    'Popper': {
          exports: "Popper.default"
        },
    "Bootstrap" : { "deps" :['jquery', 'Popper'] },
    },

    paths: {
      app: '../app',
      "jquery" : "https://code.jquery.com/jquery-3.2.1.slim.min",
      "Popper"  :   "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min",
      "Bootstrap" :  "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min",

    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['Popper','app/main'],function(Popper){
  window.Popper = Popper;
});
