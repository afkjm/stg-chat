

## Prerequisites
 - https://www.docker.com/ 


## Setup
 - ```git@github.com:afkjm/stg-chat.git```
 - ```cd ./stg-chat```
 - ```docker compose build```
 - ```docker compose up```
 - ```Access http://localhost:8080/front```

## Implementation Choices
 - Postgres, TypeScript, Node, NestJS, Socket.io
   - These specifically were chosen for learning keeping with the assignment description
 - KeyDB (A Redis drop-in replacement)
   - This is used for its realtime and liveness qualities
   - It basically just sits on top of Postgres for liveness
 - Nginx is used as a reverse proxy to avoid CORS issues
 - The code quality overall is hacky and minimalistic
   - This was intentional to get through the bulk of the assignment

## Regarding the assignment description
1. "User must choose a nickname (no password required - the nickname acts as login)"
  - ```This is achieved using the /nick command```
    
2. "User can see a list of chat rooms, and can:"
    - "create a new one"  --  ```Use /join #channel for this```
    - "join an existing one"  -- ```Also use /join #channel for this```
    - "delete the ones they created"  -- ```Use /delete_channel for this```
3. "When joining a room, the user can:"
    - "see a list of participants and whether they are connected or not"
      - ```It is possible to see the number of users connected to a #channel```
    - "send messages to the room"  -- ```Sending messages is possible after joining a #channel```
    - "edit the last message they sent, as long as no one else has sent a message since"

 - "The data must be persisted to a database shared by all users. The server should be Dockerized."
   - ```Data is persisted in Postgres tables with 'author' and 'message' columns```
   - ```All services are dockerized with docker compose```

### Thanks
 - Feel free to reach out if you have any questions or comments
