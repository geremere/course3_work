--roles
INSERT INTO roles(name) VALUES('ROLE_USER') on conflict do nothing ;
INSERT INTO roles(name) VALUES('ROLE_ADMIN') on conflict  do nothing ;

--regTypes
INSERT INTO regtypes(name) VALUES('DEFAULT') on conflict  do nothing ;
INSERT INTO regtypes(name) VALUES('VK') on conflict do nothing ;
INSERT INTO regtypes(name) VALUES('GOOGLE') on conflict  do nothing ;

--messageStatus
INSERT INTO messageStatus(name) VALUES('RECEIVED') on conflict do nothing ;
INSERT INTO messageStatus(name) VALUES('DELIVERED') on conflict  do nothing ;