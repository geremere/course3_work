CREATE TABLE users
(
    id         SERIAL,
    name       varchar(40)  NOT NULL,
    username   varchar(15)  NOT NULL unique ,
    email      varchar(40)  NOT NULL unique ,
    password   varchar(100) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE roles
(
    id         SERIAL4,
    name varchar(60) NOT NULL unique ,
    PRIMARY KEY (id)
) ;

CREATE TABLE regtypes
(
    id         SERIAL4,
    name varchar(60) NOT NULL unique ,
    PRIMARY KEY (id)
) ;

CREATE TABLE user_regtypes
(
    user_id bigint NOT NULL,
    regtype_id bigint NOT NULL,
    PRIMARY KEY (user_id, regtype_id),
    CONSTRAINT fk_user_regtypes_type_id FOREIGN KEY (regtype_id) REFERENCES regtypes (id),
    CONSTRAINT fk_user_regtypes_user_id FOREIGN KEY (user_id) REFERENCES users (id)
) ;

CREATE TABLE user_roles
(
    user_id bigint NOT NULL,
    role_id bigint NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_role_id FOREIGN KEY (role_id) REFERENCES roles (id),
    CONSTRAINT fk_user_roles_user_id FOREIGN KEY (user_id) REFERENCES users (id)
);

-- CREATE TABLE messageStatus
-- (
--     id         SERIAL4,
--     name varchar(60) NOT NULL unique ,
--     PRIMARY KEY (id)
-- ) ;
CREATE TABLE chatMessage
(
    id SERIAL,
    chatId bigint  NOT NULL,
    senderId bigint NOT NULL,
    recipientId bigint NOT NULL,
    senderName varchar(15)  NOT NULL unique ,
    recipientName varchar(15)  NOT NULL unique ,
    content varchar(1000) NOT NULL,
    content varchar() NOT NULL,
    timestamp timestamp DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
-- status
    PRIMARY KEY (id)
);

CREATE TABLE chatNotification
(
    id SERIAL,
    recipientId bigint NOT NULL,
    senderName varchar(15)  NOT NULL unique ,
    PRIMARY KEY (id)
);

CREATE TABLE chatRoom
(
    id SERIAL,
    chatId bigint  NOT NULL,
    senderId bigint NOT NULL,
    recipientId bigint NOT NULL,
    PRIMARY KEY (id)
);
