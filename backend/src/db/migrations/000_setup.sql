-- Run as postgres superuser once to set up the journals database and user.
-- Replace <PASSWORD> with a strong password and store it in DATABASE_URL.

CREATE DATABASE journals;
CREATE USER journals_user WITH ENCRYPTED PASSWORD '<PASSWORD>';
GRANT ALL PRIVILEGES ON DATABASE journals TO journals_user;

-- After connecting to the journals database:
-- \c journals
GRANT ALL ON SCHEMA public TO journals_user;
