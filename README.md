Grapevine is a web app that simulates news searches from other countries by using tor to change the ip address, Google Translate to translate into and out of the local language, and the Google news search to make the search.

To install:

brew install nodejs
apt-get install nodejs

How to run:
nodejs blah.js


To stop tor instances:
killall tor


For debugging:

in one terminal, run

tor


in another run 

nodejs grapevine_app.js

in browser goto

localhost:8081



