# database

## Tables

| Name                                    | Columns | Comment | Type       |
| --------------------------------------- | ------- | ------- | ---------- |
| [organizations](organizations.md)       | 5       |         | BASE TABLE |
| [roles](roles.md)                       | 6       |         | BASE TABLE |
| [users](users.md)                       | 8       |         | BASE TABLE |
| [permissions](permissions.md)           | 5       |         | BASE TABLE |
| [role_permissions](role_permissions.md) | 5       |         | BASE TABLE |

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
        roleId int
        organizationId int
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

    users }|--|| organizations : "belongs to"
    roles }|--|| organizations : "belongs to"
    users }|--|| roles : has
    role_permissions }|--|| roles : "belongs to"
    role_permissions }|--|| permissions : "belongs to"
```
