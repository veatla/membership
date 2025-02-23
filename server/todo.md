CREATE EXTENSION pgcrypto;

INSERT INTO messages (content)
VALUES (pgp_sym_encrypt('Hello world', 'SECRET KEY'));

SELECT pgp_sym_decrypt(content::bytea, 'SECRET KEY') 
FROM messages;
