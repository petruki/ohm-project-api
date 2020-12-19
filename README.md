# Configuration
1) npm install
2) Add .env-cmdrc file into the project directory.

```
{
    "dev": {
        "PORT": "3000",
        "MONGODB_URI": "mongodb://ohmapi:ohmapi@127.0.0.1:27017/ohmapi-db"
    }
}
```

# Resouces

**FindAll** - GET https://ohm-project-api.herokuapp.com/api/project

**Paramters**
> ?perpage=20 - Limit 20 entries per page
> ?page=1 - Set page 1

**Find** - GET https://ohm-project-api.herokuapp.com/api/project/find

**Paramters**
> ?q=procrasti - Find projects containing 'procasrti' on its name
> ?mood=aggressive - Find aggressive projects
> ?perpage=20 - Limit 20 entries per page
> ?page=1 - Set to page 1