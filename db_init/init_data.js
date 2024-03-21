const pool = require('./controller/database')
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

const initActivator = async () => {
    const hash = await bcrypt.hash('test', 10)
    await pool.query(
        "INSERT INTO login(username, hash, role, active, register_date, email, name, assigned_area) VALUES($1, $2, 'sales_assistant', true, CURRENT_DATE, $3, $4, 'ilkadim') RETURNING email",
        ['mervemutlu', hash, 'merve@test.com', 'Merve Mutlu']
    )
}

;(async function () {
    await initServices()
    await initOffers()
    await initActivator()
    console.log('Services and offers initiated')
    process.exit(0)
})()
