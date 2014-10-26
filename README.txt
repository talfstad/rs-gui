To get started with FULL SERVER development:

1. Install Sublime Text Editor, set tab size to 2 and convert tab to spacing

{
  "tab_size": 2,
  "translate_tabs_to_spaces": true
}


Installing Bower and Node dependencies:

1: `bower install`
2: `sudo npm install`

NOTE: These commands will install the appropriate libraries to run the code.


#### Running the app

Make sure you are using `localhost` as the compressed-landercode-local.js and compressed-initial.js require it.
If you are using some other domain you will need to regenerate these files.


Run Distribution version:
  `sudo grunt build`
  `sudo grunt serve`

  you will now have a server running on port 9000 that is connected to our db 
  if it launches as a 404 just refresh the page



###DEPLOYMENT####

Whenever you deploy to a non localhost server you will need to:

1. update all client files to reflect the server domain name
2. regenerate the compressed version of the client files
