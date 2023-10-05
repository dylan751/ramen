# Login sequence

```mermaid
sequenceDiagram
    actor user
    participant Login page
    participant Backend
    participant Database
    user->>Login page: Enter email/password
    Login page->>Backend: login()
    Backend->>Database: retrieve(user)

    alt user exists
        Database->>Backend: user information
    else user not found
        Backend->>Login page: user not found error
    end

    Backend->>Backend: validate(user)
    alt login success
        Backend->>Login page: access token
        Login page ->> Login page: Redirect to target page
    else validate fail
        Backend->>Login page: user validate error
    end
```

# Signup sequence

```mermaid
sequenceDiagram
    actor user
    participant Signup page
    participant Backend
    participant Database
    user->>Signup page: Enter email, name, password
    Signup page->>Backend: signup()
    Backend->>Database: retrieve(user)

    alt user exists
        Backend->>Signup page: duplicate user error
    else user not found
        Backend->>Database: create(user)
    end

    Backend->>Signup page: signup success
    Signup page ->> Signup page: Redirect to login page
```
