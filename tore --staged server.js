[1mdiff --git a/server.js b/server.js[m
[1mindex 86be476..c5373d5 100644[m
[1m--- a/server.js[m
[1m+++ b/server.js[m
[36m@@ -18,7 +18,7 @@[m [mconst pool = new Pool({[m
     user: "postgres", // PostgreSQL username[m
     host: "localhost", // Hostname[m
     database: "ssh",  // Database name[m
[31m-    password: "'vbkm2005", // PostgreSQL password[m
[32m+[m[32m    password: "your password", // PostgreSQL password[m
     port: 5432,       // Default port[m
 });[m
 [m
