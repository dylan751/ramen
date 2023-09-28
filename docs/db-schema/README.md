# Database

## Tables

| Name             | Columns | Comment | Type       |
| ---------------- | ------- | ------- | ---------- |
| organizations    | 5       |         | BASE TABLE |
| roles            | 6       |         | BASE TABLE |
| users            | 8       |         | BASE TABLE |
| permissions      | 5       |         | BASE TABLE |
| role_permissions | 5       |         | BASE TABLE |

## Relations

```mermaid
erDiagram
    organizations {
        id int pk
        name varchar
        uniqueName varchar
        createdAt timestamp
        updatedAt timestamp
    }

    roles {
        id int pk
        name varchar
        slug varchar
        organizationId int
        createdAt timestamp
        updatedAt timestamp
    }

    users {
        id int pk
        name varchar
        email varchar
        password varchar
        createdAt timestamp
        updatedAt timestamp
    }

    user_organizations {
        id int pk
        userId int
        organizationId int
        roleId int
        createdAt timestamp
        updatedAt timestamp
    }

    permissions {
        id int pk
        action enum
        object varchar
        createdAt timestamp
        updatedAt timestamp
    }

    role_permissions {
        id int pk
        roleId int
        permissionId int
        createdAt timestamp
        updatedAt timestamp
    }

    roles }|--|| organizations : "belongs to"
    user_organizations }|--|| users : "belongs to"
    user_organizations }|--|| organizations : "belongs to"
    user_organizations }|--|| roles : "belongs to"
    role_permissions }|--|| roles : "belongs to"
    role_permissions }|--|| permissions : "belongs to"
```
