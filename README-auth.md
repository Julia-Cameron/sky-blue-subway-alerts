# API tests: authentication and authorization (SB-29, SB-30)

Tested by Julia Cameron with Postman against the local server (`node server.js`) on branch `julia-moderator`.
Test accounts: Rider, Rider B and a Moderator. Test reports were created for these tests and deleted afterwards.

## Authentication (SB-29)

|#|Request|Expected|Result|Screenshot|
|-|-|-|-|-|
|1|POST /api/auth/signup (new user)|201, token, role commuter|Pass|01-signup-ok.png|
|2|POST /api/auth/signup (same user)|400, user already exists|Pass|02-signup-duplicate.png|
|3|POST /api/auth/signup (short password)|400, at least 8 characters|Pass|03-signup-short-password.png|
|4|POST /api/auth/signin (correct password)|200, token|Pass|04-signin-ok.png|
|5|POST /api/auth/signin (wrong password)|401, invalid email or password|Pass|05-signin-wrong-password.png|

## Authorization (SB-30)

|#|Request|Token|Expected|Result|Screenshot|
|-|-|-|-|-|-|
|6|GET /api/moderator/reports|none|401, no token|Pass|06-get-moderator-reports-no-token.png|
|7|GET /api/moderator/reports|Rider|403, access denied|Pass|07-get-moderator- reports-rider-denied.png|
|8|GET /api/moderator/reports|invalid token|401, token failed|Pass|08-get-moderator-reports-invalid-token|
|9|GET /api/moderator/reports|Moderator|200, list of reports|Pass|09-get-moderator-reports-success.png|
|10|GET /api/moderator/reports?status=Resolved and ?status=Foo|Moderator|200 (Resolved only), then 400|Pass|10-status-filter-200OK.png<br />10-status-filter-400-Bad-Request.png|
|11|PATCH /api/moderator/reports/:id/resolve|Rider|403|Pass|11-resolve-as-rider.png|
|12|DELETE /api/moderator/reports/:id|Rider|403|Pass|12-delete-as-rider.png|
|13|PATCH /api/moderator/reports/:id/resolve|Moderator|200, marked as resolved|Pass|13-resolve-as-moderator.png|
|14|DELETE /api/moderator/reports/:id|Moderator|200, report deleted|Pass|14-delete-as-moderator.png|
|15|DELETE the same report again, then /reports/abc|Moderator|404, then 400 invalid id|Pass|15-delete-errors-400.png<br />15-delete-errors-404.png<br />|



