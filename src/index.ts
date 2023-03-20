import express from "express";
import QueryString from "qs";
import { PrismaClient, Prisma, User } from '@prisma/client'
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient()

const app = express()
const port = process.env["PORT"] ?? "3000"

function toString(qs:  undefined | string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[]) {
    if (typeof qs === "string") {
        return qs;
    }
    return undefined;
}

app.get('/', (req, res) => {
  res.send('Use POST')
})

app.post("/create/:count/:batchSize", async (req, res) => {
    const count = parseInt(req.params.count)
    const batchSize = parseInt(req.params.batchSize)

    const promises: Array<Prisma.PrismaPromise<User>> = []
    for (let i = 0; i < count; ++i) {
        promises.push(prisma.user.create({
            data: {
                name: faker.name.fullName(),
                dob: faker.date.past(),
                weight: faker.datatype.number({min: 50, max: 300}),
                height: faker.datatype.number({min: 100, max: 250})
            }
        }))

        if (promises.length === batchSize) {
            res.write(`Creating ${promises.length} users...\n`)
            await Promise.all(promises);
            promises.length = 0
        }
    }

    res.write(`Finalizing ${promises.length} users...\n`)
    await Promise.all(promises);
    res.end()
})

app.post("/reproduce", async (req, res) => {
    const concurrency = parseInt(toString(req.query.concurrency) ?? "20")
    const rounds = parseInt(toString(req.query.rounds) ?? "30")

    for (let i = 1; i <= rounds; ++i) {
        console.log("Running round %d of %d", i, rounds);

        const promises: Array<Prisma.PrismaPromise<User[]>> = [];
        for (let j = 0; j < concurrency; ++j) {

            promises.push(prisma.user.findMany({
                where: {
                    weight: { gt: 50, lt: 300 },
                }
            }))
        }

        await Promise.all(promises)
    }

    res.send("Finished")
})

app.listen(port, () => {
  console.log(`Reproducer app listening on port ${port}`)
})