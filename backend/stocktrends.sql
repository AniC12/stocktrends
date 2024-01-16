\echo 'Delete and recreate stocktrends db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE stocktrends;
CREATE DATABASE stocktrends;
\connect stocktrends

\i stocktrends-schema.sql

\echo 'Delete and recreate stocktrends_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE stocktrends_test;
CREATE DATABASE stocktrends_test;
\connect stocktrends_test

\i stocktrends-schema.sql