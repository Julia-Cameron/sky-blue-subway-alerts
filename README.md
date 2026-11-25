# sky-blue-subway-alerts
COMP229Group 4 - Sky Blue - Crowdsourced Subway Alerts

## Database setup (B-01, B-02)

The app uses MongoDB Atlas. The connection string goes in a `.env` file in the project folder, never in GitHub. Copy `.env.example` to `.env` and fill in your values.

### Load the TTC data and test data

```
npm install
npm run seed
```

The seed script (`scripts/seed.js`) loads:

- The 5 TTC lines (1, 2, 4, 5 and 6) with route names, such as Line 2 Bloor–Danforth. Line 3 closed in 2023.
- All 117 stations, in route order along each line (`scripts/data/ttc-stations.js`). A station on two lines, such as Bloor-Yonge, has one entry per line.
- 4 test accounts: `maya@skyblue.test`, `omar@skyblue.test` and `priya@skyblue.test` (commuters) and `moderator@skyblue.test` (moderator). All use the password `SkyBlue2026!`.
- 10 sample reports at real stations: 7 Active and 3 Resolved.

It is safe to run again. Lines and stations are updated, never duplicated. Only the `@skyblue.test` accounts and their reports are removed and re-created. Real users and reports are never touched.

### Production

Production only needs the lines and stations, without test accounts:

```
npm run seed:lines
```

Run it once, with `MONGO_URI` pointing at the production database.
