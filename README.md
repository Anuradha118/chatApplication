# chatApplication
 A simple one-to-one chat application using socket.io.

# Features
1. This chat application capture the events like “other user is typing”.
2. It has login and logout feature, with proper notification to other user who is in the chat.
3. The application uses MongoDB for storing the chat history between two people.
4. The user can retrieve old chats by scrolling up.

# EC2 Hosted URL-

http://ec2-13-127-168-127.ap-south-1.compute.amazonaws.com

# App Installation:
1. Setting up local server
      First run the local mongodb server, then add config.json inside server->configs with all the environment variables like 
      PORT, JWT_SECRET,MONGODB_URI.

2. Download the code from github.
3. Unzip the folder
4. Open command prompt from the unzipped folder
5. Run command: npm install to install all the packages
6. Run command: node server/server.js
7. The local server will start with the mentioned port

# How to Use the ChatApplication:

1. Visit http://localhost:{{PORT}} on your browser.
2. Enter the user Name and Room Name to start chatting.
3. When you are at bottom of the screen you can scrolltop to load the old messages,if any
4. Once you logout of the chat application you will be redirected to index.html

# Developed with:
  - MongoDB
  - ExpressJS
  - NodeJS
  
# Developed By:
  Anuradha Sahoo
