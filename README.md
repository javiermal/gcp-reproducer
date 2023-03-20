# Steps to Reproduce

```
gcloud builds submit --tag us-central1-docker.pkg.dev/PROJECT_NAME/REPO_NAME/gcp-reproducer
```

Then create a Cloud Run Job which runs:

```
npm run db:migrate:apply
```

And has a DATABASE_URL set to the CloudSQL database URL:

```
postgres://USERNAME:PASSWORD@localhost/gcp_reproducer?connection_limit=40&host=/cloudsql/PROJECT_NAME:us-central1:SQL_DB_INSTANCE
```

Run a single execution of the job, and then create a CloudRun service based off the same image, with a volume mount to the CloudSQL
instance.

