import knex from 'knex';
import dotenv from 'dotenv';
import pg from 'pg';
import { table } from 'console';

dotenv.config()

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    },
    pool: {
        min: 2,
        max: 10,
        acquireTimeoutMillis: 3000,
        idleTimeoutMillis: 3000,

    }

})

export async function initdb() {
    try {
        const hastable_admin = await db.schema.hasTable('admin')
        if (!hastable_admin) {
            await db.schema.createTable('admin', (table) => {
                table.increments('id').primary()
                table.string('name')
                table.string('email').notNullable()
                table.string('password').notNullable()
                table.string('role').notNullable()
                table.timestamps(true, true)
            })

            console.log('admin table created')
        }

        const hastable_customer = await db.schema.hasTable('customer')
        if (!hastable_customer) {
            await db.schema.createTable('customer', (table) => {
                table.increments('id').primary()
                table.string('name')
                table.string('email')
                table.string('password')
                table.string('phone_number').notNullable()
                table.string('role').notNullable()
                table.timestamps(true, true)
            })

            console.log('customer table created')
        }

        const hastable_scrap_collector = await db.schema.hasTable('scrap_collector')
        if (!hastable_scrap_collector) {
            await db.schema.createTable('scrap_collector', (table) => {
                table.increments('id').primary()
                table.string('name')
                table.string('email')
                table.string('phone_number').notNullable()
                table.string('password').notNullable()
                table.string('nid').notNullable()
                table.string('division').notNullable()
                table.string('district').notNullable()
                table.string('thana').notNullable()
                table.string('address').notNullable()
                table.string('vehicle_type')
                table.string('role').notNullable()
                table.boolean('is_verified').defaultTo(false)
                table.timestamps(true, true)
            })

            console.log('collector table created')
        }

        const hastable_member = await db.schema.hasTable('member')

        if (!hastable_member) {
            await db.schema.createTable('member', (table) => {
                table.increments('id').primary()
                table.string('name')
                table.string('rank')
                table.string('responsibilities')
                table.string('image_url')
            })
        }

        const hastable_eco_product = await db.schema.hasTable('eco_product')

        if (!hastable_eco_product) {
            await db.schema.createTable('eco_product', (table) => {
                table.increments('id').primary()
                table.string('name').notNullable()
                table.decimal('price', 14, 2).notNullable()
                table.text('description')
                table.text('image_url').notNullable()
                table.timestamps(true, true)
            })

            console.log('eco_product table created')
        }

        const hastable_market_req = await db.schema.hasTable('market_req')
        if (!hastable_market_req) {
            await db.schema.createTable('market_req', (table) => {
                table.increments('id').primary()
                table.string('name')
                table.string('phone_number')
                table.string('email')
                table.string('division').notNullable()
                table.string('district').notNullable()
                table.string('thana').notNullable()
                table.string('address').notNullable()
                table.string('payment_method')
                table.integer('customer_id').unsigned().notNullable().references('id').inTable('customer').onDelete('CASCADE')
                table.string('status').defaultTo('order_placed')
                table.decimal('total_price', 10, 2)
                table.timestamps(true, true)
            })

            console.log('market request table created')
        }


        const hastable_market_req_items = await db.schema.hasTable('market_req_items')
        if (!hastable_market_req_items) {
            await db.schema.createTable('market_req_items', (table) => {
                table.increments('id').primary()
                table.integer('market_req_id').unsigned().notNullable().references('id').inTable('market_req').onDelete('CASCADE')
                table.integer('product_id').unsigned().notNullable().references('id').inTable('eco_product').onDelete('CASCADE')
                table.timestamps(true, true)
            })

            console.log('market request table created')
        }


        const hastable_scraps = await db.schema.hasTable('scrap')
        if (!hastable_scraps) {
            await db.schema.createTable('scrap', (table) => {
                table.increments('id').primary()
                table.string('name').notNullable()
                table.decimal('price', 14, 2).notNullable()
                table.text('description')
                table.timestamps(true, true)
            })

            console.log('scraps table created')
        }

        const hastable_scrap_req = await db.schema.hasTable('scrap_req')
        if (!hastable_scrap_req) {
            await db.schema.createTable('scrap_req', (table) => {
                table.increments('id').primary()
                table.string('name')
                table.string('phone_number')
                table.string('email')
                table.string('alternate_number')
                table.dateTime('pickup_schedule')
                table.string('division').notNullable()
                table.string('district').notNullable()
                table.string('thana').notNullable()
                table.string('address').notNullable()
                table.string('instruction')
                table.integer('customer_id').unsigned().notNullable().references('id').inTable('customer').onDelete('CASCADE')
                table.string('status').defaultTo('requested')

                table.timestamps(true, true)
            })
            console.log('scrap request table created')
        }


        const hastable_scrap_req_itmes = await db.schema.hasTable('scrap_req_items')
        if (!hastable_scrap_req_itmes) {
            await db.schema.createTable('scrap_req_items', (table) => {
                table.increments('id').primary()
                table.decimal('weight', 10, 2)
                table.decimal('price', 10, 2)
                table.integer('scrap_id').unsigned().notNullable().references('id').inTable('scrap').onDelete('CASCADE')
                table.integer('scrap_req_id').unsigned().notNullable().references('id').inTable('scrap_req').onDelete('CASCADE')
                table.timestamps(true, true)
            })
            console.log('scrap request items table created')
        }


        const hastable_scrap_transaction = await db.schema.hasTable('scrap_transaction')
        if (!hastable_scrap_transaction) {
            await db.schema.createTable('scrap_transaction', (table) => {
                table.increments('id').primary()
                table.decimal('actual_weight', 14, 2).notNullable()
                table.decimal('actual_price', 14, 2).notNullable()
                table.integer('customer_id').unsigned().references('id').inTable('customer').onDelete('SET NULL')
                table.integer('collector_id').unsigned().references('id').inTable('scrap_collector').onDelete('SET NULL')
                table.integer('scrap_id').unsigned().references('id').inTable('scrap').onDelete('SET NULL')

                table.timestamps(true, true)
            })
            console.log('scrap transaction table created')
        }


        const hastable_camapign = await db.schema.hasTable('campaign')
        if (!hastable_camapign) {
            await db.schema.createTable('campaign', (table) => {
                table.increments('id').primary()
                table.string('title')
                table.text('description')
                table.text('registration_link')
                table.timestamps(true, true)
            })
            console.log('campaign table created')
        }

        const hastable_campaign_effect = await db.schema.hasTable('campaign_effect')
        if (!hastable_campaign_effect) {
            await db.schema.createTable('campaign_effect', (table) => {
                table.increments('id').primary()
                table.string('campaign_title')
                table.text('effect')
                table.timestamps(true, true)
            })
        }

        const awardtable = await db.schema.hasTable('award')
        if (!awardtable) {
            await db.schema.createTable('award', (table) => {
                table.increments('id').primary()
                table.string('title')
                table.text('description')
                table.text('image_url')
                table.date('date_won')
                table.timestamps(true, true)
            })
        }

        const hastable_refresh_token = await db.schema.hasTable('refresh_token')
        if (!hastable_refresh_token) {
            await db.schema.createTable('refresh_token', (table) => {
                table.increments('id').primary()
                table.string('token').notNullable()
                table.integer('user_id').notNullable()
                table.string('role').notNullable()
                table.timestamp('expires_at').notNullable()
                table.timestamps(true, true)
            })
        }
    }
    catch (err) {
        console.log('failed initialise database', err)
    }
}

initdb()

export default db