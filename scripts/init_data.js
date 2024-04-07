const pool = require('../controller/database')
const bcrypt = require('bcrypt')

// Initiate the services table with 5 services

const services = [
    { name: 'service1', active: true, profitable: true },
    { name: 'service2', active: true, profitable: true },
    { name: 'service3', active: true, profitable: false },
    { name: 'service4', active: true, profitable: false },
    { name: 'service5', active: true, profitable: true },
]

const insertService = async (service) => {
    try {
        await pool.query(
            'INSERT INTO services(name, active, profitable) VALUES($1, $2, $3)',
            [service.name, service.active, service.profitable]
        )
    } catch (err) {
        console.error(err)
    }
}

const initServices = async () => {
    for (let i = 0; i < services.length; i++) {
        await insertService(services[i])
    }
}

// Initiatlize the offers table with 5 offers for each service

const offers = [
    { service_id: 1, name: 'offer1', active: true, value: 100 },
    { service_id: 1, name: 'offer2', active: true, value: 200 },
    { service_id: 1, name: 'offer3', active: true, value: 300 },
    { service_id: 1, name: 'offer4', active: true, value: 400 },
    { service_id: 1, name: 'offer5', active: true, value: 500 },
    { service_id: 2, name: 'offer1', active: true, value: 100 },
    { service_id: 2, name: 'offer2', active: true, value: 200 },
    { service_id: 2, name: 'offer3', active: true, value: 300 },
    { service_id: 2, name: 'offer4', active: true, value: 400 },
    { service_id: 2, name: 'offer5', active: true, value: 500 },
    { service_id: 3, name: 'offer1', active: true, value: 100 },
    { service_id: 3, name: 'offer2', active: true, value: 200 },
    { service_id: 3, name: 'offer3', active: true, value: 300 },
    { service_id: 3, name: 'offer4', active: true, value: 400 },
    { service_id: 3, name: 'offer5', active: true, value: 500 },
    { service_id: 4, name: 'offer1', active: true, value: 100 },
    { service_id: 4, name: 'offer2', active: true, value: 200 },
    { service_id: 4, name: 'offer3', active: true, value: 300 },
    { service_id: 4, name: 'offer4', active: true, value: 400 },
    { service_id: 4, name: 'offer5', active: true, value: 500 },
    { service_id: 5, name: 'offer1', active: true, value: 100 },
]

const insertOffer = async (offer) => {
    try {
        await pool.query(
            'INSERT INTO offers(service_id, name, active, value) VALUES($1, $2, $3, $4)',
            [offer.service_id, offer.name, offer.active, offer.value]
        )
    } catch (err) {
        console.error(err)
    }
}

const initOffers = async () => {
    for (let i = 0; i < offers.length; i++) {
        await insertOffer(offers[i])
    }
}

const initUsers = async () => {
    const users = [
        {
            name: 'Test Bayi',
            email: 'test@test.com',
            password: 'test',
            role: 'dealer',
        },
        {
            name: 'Merve Mutlu',
            email: 'sd@test.com',
            password: 'test',
            role: 'sales_assistant',
        },
        {
            name: 'Remzi Muratoğlu',
            email: 'sdc@test.com',
            password: 'test',
            role: 'sales_assistant_chef',
        },
    ]

    for (let I = 0; I < users.length; I++) {
        const user = users[I]

        const hash = await bcrypt.hash(user.password, 10)
        await pool.query(
            "INSERT INTO login(username, hash, role, active, register_date, email, name, assigned_area) VALUES($1, $2, $3, true, CURRENT_DATE, $4, $5, 'ilkadim') RETURNING email",
            [user.name, hash, user.role, user.email, user.name]
        )
    }
}

;(async function () {
    await initServices()
    await initOffers()
    await initUsers()
    console.log('Services and offers initiated')
    process.exit(0)
})()
