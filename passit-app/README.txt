====================================
PASSIT — BECE PRACTICE APP
Setup Guide for Ubuntu Server
====================================

WHAT YOU NEED
- A laptop or computer running Ubuntu Server
- A network switch or Wi-Fi router
- All student devices connected to the same network

STEP 1 — INSTALL NODE.JS ON UBUNTU SERVER
Run these commands on the Ubuntu Server:

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

Check it worked:
node --version

STEP 2 — COPY PASSIT FILES TO THE SERVER
Copy the passit-app folder to the Ubuntu Server using a USB stick or SCP.
Place it in the home folder: /home/ubuntu/passit-app

STEP 3 — INSTALL BACKEND DEPENDENCIES
cd /home/ubuntu/passit-app/backend
npm install

STEP 4 — START THE APP
cd /home/ubuntu/passit-app/backend
node server.js

The app will start on port 5001.

STEP 5 — FIND THE SERVER IP ADDRESS
Run this on the Ubuntu Server:
hostname -I

You will see something like: 192.168.1.100
This is the address students will use.

STEP 6 — STUDENTS ACCESS THE APP
Students connect their phones or laptops to the same network (switch or Wi-Fi router).
They open a browser and go to:
http://[SERVER IP ADDRESS]:5001

Example: http://192.168.1.100:5001

STEP 7 — START AUTOMATICALLY ON BOOT (OPTIONAL)
To make PassIt start automatically when the server is turned on, run:

sudo npm install -g pm2
pm2 start /home/ubuntu/passit-app/backend/server.js --name passit
pm2 startup
pm2 save

UPDATING QUESTIONS
To add new questions, replace the JSON files in:
/home/ubuntu/passit-app/backend/data/

Then restart the app:
pm2 restart passit

====================================
Built with love for Ghanaian students
====================================
