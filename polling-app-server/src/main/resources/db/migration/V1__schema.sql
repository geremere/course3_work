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


--
-- CREATE TABLE polls
-- (
--
--     id                   SERIAL,
--
--     question             varchar(140) NOT NULL,
--
--     expiration_date_time date     NOT NULL,
--
--     created_at           timestamp DEFAULT CURRENT_TIMESTAMP,
--
--     updated_at           timestamp DEFAULT CURRENT_TIMESTAMP,
--
--     created_by           bigint DEFAULT NULL,
--
--     updated_by           bigint DEFAULT NULL,
--
--     PRIMARY KEY (id)
--
-- );
--
--
--
-- CREATE TABLE choices
-- (
--
--     id         SERIAL,
--
--     text    varchar(40) NOT NULL,
--
--     poll_id bigint NOT NULL,
--
--     PRIMARY KEY (id),
--
--     CONSTRAINT fk_choices_poll_id FOREIGN KEY (poll_id) REFERENCES polls (id)
--
-- );



-- CREATE TABLE votes
-- (
--
--     id         SERIAL,
--
--     user_id    bigint NOT NULL,
--
--     poll_id    bigint NOT NULL,
--
--     choice_id  bigint NOT NULL,
--
--     created_at timestamp DEFAULT CURRENT_TIMESTAMP,
--
--     updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
--
--     PRIMARY KEY (id),
--
--     CONSTRAINT fk_votes_user_id FOREIGN KEY (user_id) REFERENCES users (id),
--
--     CONSTRAINT fk_votes_poll_id FOREIGN KEY (poll_id) REFERENCES polls (id),
--
--     CONSTRAINT fk_votes_choice_id FOREIGN KEY (choice_id) REFERENCES choices (id)
--
-- );

