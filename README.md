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

To ensure that the reproducer works as expected, you will need to ensure that the networking for the service is setup to use a private VPC
network. This doesn't reproduce if you're not using private VPC networking. If you reproduce, you should see:

```
Cloud SQL connection failed. Please see https://cloud.google.com/sql/docs/mysql/connect-run for additional details: connection to Cloud SQL instance at 34.170.24.96:3307 failed: timed out after 10s
```

And basically the service will die.

To seed initial data:

```
curl -X POST https://CLOUDRUN_APP_NAME/create/30000/30
```

Then to bench, you can use apachebench (installed by default on most Macbooks):

```
ab -n 50000 -c 100 -v 3 -p README.md -T 'application/json' -s 60000 https://CLOUDRUN_APP_NAME/reproduce
```
