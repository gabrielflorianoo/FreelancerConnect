import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const router = Router();
const prisma = new PrismaClient();

router.post("/populate", async (req, res) => {
    const {
        users = 0,
        jobs = 0,
        messages = 0,
        reviews = 0,
        payments = 0,
    } = req.body;

    try {
        // Usuários (CLIENT e FREELANCER)
        const createdUsers = [];
        for (let i = 0; i < users; i++) {
            const role = i % 2 === 0 ? "CLIENT" : "FREELANCER";
            const user = await prisma.user.create({
                data: {
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                    role,
                    balance:
                        role === "CLIENT"
                            ? faker.number.int({ min: 500, max: 5000 })
                            : undefined,
                },
            });
            createdUsers.push(user);
        }

        // Jobs
        const createdJobs = [];
        const clients = createdUsers.filter((u) => u.role === "CLIENT");
        const freelancers = createdUsers.filter((u) => u.role === "FREELANCER");
        for (let i = 0; i < jobs; i++) {
            const client = faker.helpers.arrayElement(clients);
            const freelancer = freelancers.length
                ? faker.helpers.arrayElement(freelancers)
                : null;
            const job = await prisma.job.create({
                data: {
                    title: faker.commerce.productName(),
                    description: faker.lorem.paragraph(),
                    category: faker.commerce.department(),
                    location: faker.location.city(),
                    budget: faker.number.int({ min: 500, max: 5000 }),
                    status: faker.helpers.arrayElement([
                        "PENDING",
                        "ACCEPTED",
                        "COMPLETED",
                    ]),
                    deadline: faker.date.future(),
                    clientId: client?.id,
                    freelancerId: freelancer?.id,
                },
            });
            createdJobs.push(job);
        }

        // Messages
        const createdMessages = [];
        for (let i = 0; i < messages; i++) {
            const job = createdJobs.length
                ? faker.helpers.arrayElement(createdJobs)
                : null;
            const sender = createdUsers.length
                ? faker.helpers.arrayElement(createdUsers)
                : null;
            if (job && sender) {
                const msg = await prisma.message.create({
                    data: {
                        content: faker.lorem.sentence(),
                        senderId: sender.id,
                        jobId: job.id,
                    },
                });
                createdMessages.push(msg);
            }
        }

        // Reviews
        const createdReviews = [];
        for (let i = 0; i < reviews; i++) {
            const job = createdJobs.length
                ? faker.helpers.arrayElement(createdJobs)
                : null;
            const freelancer = freelancers.length
                ? faker.helpers.arrayElement(freelancers)
                : null;
            if (job && freelancer) {
                // Só cria review se o job for COMPLETED e tiver freelancer
                if (job.status === "COMPLETED" && job.freelancerId) {
                    const review = await prisma.review.create({
                        data: {
                            rating: faker.number.int({ min: 1, max: 5 }),
                            comment: faker.lorem.sentence(),
                            jobId: job.id,
                            freelancerId: freelancer.id,
                        },
                    });
                    createdReviews.push(review);
                }
            }
        }

        // Payments
        const createdPayments = [];
        for (let i = 0; i < payments; i++) {
            const job = createdJobs.find((j) => j.status === "COMPLETED");
            if (job) {
                const payment = await prisma.payment.create({
                    data: {
                        jobId: job.id,
                        amount: job.price,
                        status: faker.helpers.arrayElement([
                            "COMPLETED",
                            "PENDING",
                        ]),
                        method: faker.helpers.arrayElement([
                            "simulado",
                            "pix",
                            "cartao",
                        ]),
                    },
                });
                createdPayments.push(payment);
            }
        }

        res.json({
            message: "Dados populados com sucesso.",
            users: createdUsers.length,
            jobs: createdJobs.length,
            messages: createdMessages.length,
            reviews: createdReviews.length,
            payments: createdPayments.length,
        });
    } catch (err) {
        res.status(500).json({
            error: "Erro ao popular o banco de dados.",
            details: err.message,
        });
    }
});

export default router;
