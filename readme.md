# Upstatement Gadget Lab
This is a small meteor app designed for tracking the devices in our testing suite. It's supposed to be useful and fun.

### Dependencies:
1. You need a dev workspace with [NPM](https://npmjs.org/), Some kind of [Compass](http://compass-style.org/) compiler, and [Bower](http://bower.io/).

2. You'll need [Meteor](https://www.meteor.com/) to be installed if you haven't already:
`curl https://install.meteor.com | /bin/sh`

3. Install [Meteorite](https://github.com/oortcloud/meteorite) with NPM if you don't have it already:
`npm install -g meteorite`


### To run locally:
1. Clone the repo wherever you want to run it:   
`git clone git@github.com:mswartz/device-library.git`   

2. cd into the directory that was created:
`cd device-library`

3. run `bower install` to grab the Upbase framework

4. run `compass compile` or `compass watch` to build the css (or fire up LiveReload or somesuch to look at it)

5. now you're ready to run the app with `meteor` or `mrt`

6. The app should be running at `localhost:3000`!


# Todo:
#### Design
- [ ] Make device art

#### Functionality
- [ ] Security around adding devices (how to make this public but prevent abuse)
