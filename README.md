# backend for my e-commerce website 

# USER APIS

## 1. Register User

    API URL : "/api/user/register"  
    body : {  
        "userName": must contain only en-US chars and numbers,  
        "fullName": must contain only (en-US or ar-EG) and spaces is allowed ,  
        "password": any password,  
        "email": valid email,  
        "phone": must be a valid number with the key of country  
    }  
    response :  
    1. status (200): {
    "user": {
        "isActive": ,
        "_id": ,
        "userName": ,
        "fullName": ,
        "email": ,
        "phone": 
    }}
    1. status (400) : {"error": {},"type": "database or shema"}
    2. status (500) : { "error": {}}
    
