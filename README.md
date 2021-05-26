# nodejs-mongodb-question-answer-api
 
api url = https://question-answers-app.herokuapp.com/
 
 
 | METHODS | REQUEST | DESCRIPTION |
| :---         |     :---:      |          ---: |
| POST  | /api/auth/register     | request body : name,email,password     |
| POST     | api/auth/login      | login email : admin@gmail.com password : 123456      |
| GET     | api/auth/logout      | HEADERS : AUTHORIZATION : BEARER:{{ACCESS_TOKEN}}      |
| GET     | api/auth/users/{id}      | params.id   get single user    |
| GET     | api/auth/users      | Get All User     |
| POST     | api/auth/upload      |   HEADERS : AUTHORIZATION : BEARER:{{ACCESS_TOKEN}}  BODY : profile_image = "image name"   |
 
