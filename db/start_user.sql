/*
This startup script creates a database user and seeds one login account.
Replace the placeholder passwords before using it outside local development.
*/

CREATE USER IF NOT EXISTS 'customerUser'@'localhost'
IDENTIFIED BY 'password1';

GRANT ALL PRIVILEGES ON dbPersons.*
TO 'customerUser'@'localhost';

SET @starter_account_email = 'new.user@example.com';
SET @starter_account_password = 'ChangeMe123!';

INSERT INTO dbPersons.users (email, password_hash)
VALUES (@starter_account_email, SHA2(@starter_account_password, 256));

