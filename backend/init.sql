-- This file runs on first MySQL container startup
-- The database and user are already created via Docker environment variables
-- This just ensures charset is correct

ALTER DATABASE studentdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
