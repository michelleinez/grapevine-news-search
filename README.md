Grapevine is a web app that simulates news searches from other countries.

It works by using tor to change the ip address, Google Translate to translate into and out of the local language, and the Google news search to make the search. It is published under the GPL3 license, but if you want a commercial license, talk to us.









To install:

brew install nodejs
or
apt-get install nodejs

How to run:
nodejs grapevine_app.js


To stop tor instances:
killall tor


For debugging:

in one terminal, run

tor


in another run

nodejs grapevine_app.js

in browser goto

localhost:8081



