# Card Apply
Automatically apply for a Japanese credit card. This app will apply for you automatically, check your application status, and re-apply again if you are rejected. Enjoy!

# Requirements
You will need:
1. A Mongo instance for storing the settings and application status
2. Google Cloud Storage for storing page dumps (optional)
3. An environment that can run Docker containers

# How To

## CLI Options
 * **--help** displays help
 * **--version** displays application version
 * **--cards** displays supported cards
 * **--mongo=<mongo connection string>** set the Mongo connection string
 * **--storage=<storage connection string>** set the Google Cloud Storage connection string
 * **--mail-to=<email for notifications>** set an email address where notifications will be sent

## CLI Commands
 * **start** start the web application that listens to callbacks
 * **apply <card> < <profile.json>** apply for card <card>, loading your profile from profile.json
 * **resume <application number>** resume application process for the <application number>

## Configure & Initialize
You need to initialize
```
./bin/card-bot --init
```
# Contributing
The following features are welcomed:
 * AWS support
 * More cards