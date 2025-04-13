# Overview

The authentication exercise will have a look on OIDC an related mechanisms in OCM/PCM to login a user by SSI Technologies.

# Exercise Goal

The goal of this exercise is, to understand how a login flow can work, what are the challenges, and how it looks like. 

# Exercise

At first a simple example of AAS is tried out by using the example from this [repository](https://gitlab.com/gaia-x/data-infrastructure-federation-services/gxfs-workshop-examples/-/tree/main/idm-aas-example). The project can be started by using: 

```
yarn
yarn start

```
<b>Note:</b> Don't use "localhost", please use 127.0.0.1:3000 for starting the project. An icognito windows is also recommended to avoid side effects of other cookies. 

When the QR Code is popping up, scan it with your PCM and confirm the presentation in the app. You should see in the debug console a token for the user.

![](media/AnonCredUserLogin.mp4 "Anon Cred Login")

After this, let's try it from mobile.

![](media/LoginOnSmartPhone.mp4 "Smartphone Login")
