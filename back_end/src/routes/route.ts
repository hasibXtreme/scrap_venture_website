import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { verifytoken, requireadmin, requireadminonly } from '../middleware/auth.js';
import { adminlogin, adminlogout, handlerefreshtokenadmin } from '../controller/admincontroller.js';
import { collectorlogin, collectorlogout, handlerefreshtokencollector } from '../controller/collectorcontroller.js';
import { customerlogin, customerlogout, handlerefreshtokencustomer } from '../controller/customercontroller.js';
import { doubleCsrfProtection } from '../server.js';
import bcrypt from 'bcrypt';
import knex from 'knex';

const router = Router()
const jwt_secret = process.env.JWT_SECRET

function dirtyfunction(currentrecord: any, incomingpayload: any) {
    const dirty: any = {}

    for (const [key, val] of Object.entries(incomingpayload)) {
        if (val !== undefined && currentrecord[key] !== val) {
            dirty[key] = val
        }
    }

    return dirty
}


router.post('/admin-login', adminlogin)
router.post('/admin-logout', adminlogout)
router.post('/admin-refresh', handlerefreshtokenadmin)

router.post('/collector-login', collectorlogin)
router.post('/collector-logout', collectorlogout)
router.post('/collector-refresh', handlerefreshtokencollector)

router.post('/customer-login', customerlogin)
router.post('/customer-logout', customerlogout)
router.post('/customer-refresh', handlerefreshtokencustomer)

router.get(
    '/admindashboard/user_stats',
    verifytoken,
    requireadmin,
    async (req: Request, res: Response) => {
        try {

            const [totalcollector, totalcustomer] = await Promise.all([
                db('scrap_collector').count('* as count').first(),
                db('customer').count('* as count').first(),
            ]);


            const collectorCount = Number(totalcollector?.count ?? 0);
            const customerCount = Number(totalcustomer?.count ?? 0);

            return res.json({
                stats: {
                    collectorcount: collectorCount,
                    customercount: customerCount,
                },
                message: `Welcome admin ${req.user?.email ?? ''}`,
            });
        } catch (err) {
            console.error('Error fetching admin user stats:', err);
            return res.status(500).json({
                message: 'Internal server error while fetching user statistics',
            });
        }
    }
);


router.get('/admin/business_stats/:id', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const scrap_stats = await db('scrap_transaction')
                .join('scrap', 'scrap_transaction.scrap_id', 'scrap.id')
                .select('scrap.id as scrap_id', 'scrap.name as scrap_name')
                .sum('scrap_transaction.actual_weight as scrap_weight')
                .sum('scrap_transaction.actual_price as scrap_price')
                .groupBy('scrap.id', 'scrap.name')

            const market_stats = await db('market_req_items')
                .join('eco_product', 'market_req_items.product_id', 'eco_product.id')
                .select('eco_product.id as product_id', 'eco_product.name as product_name')
                .count('market_req_items.id as total_orders')
                .groupBy('eco_product.id', 'eco_product.name')

            res.json({ scrap_stats: scrap_stats, market_stats: market_stats })

        }
        catch (err) {
            res.status(500).json({ message: 'server error occured' })
        }

    })

router.get('/admindashboard/order-stats', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const [totalMarketOrders, totalScrapOrders] = await Promise.all([
                db('market_req').count('* as count').first(),
                db('scrap_req').count('* as count').first(),
            ]);

            res.json({
                market_orders_count: Number(totalMarketOrders?.count ?? 0),
                scrap_orders_count: Number(totalScrapOrders?.count ?? 0)
            });
        } catch (err) {
            res.status(500).json({ message: 'Error fetching order statistics', error: err });
        }
    }
);

router.get('/admindashboard/market-orders', verifytoken, requireadmin,
    async (req: Request, res: Response) => {

        try {
            const orders = await db('market_req').select('*')

            const orderids = orders.map(order => order.id)

            const items_perorder = await db('market_req_items')
                .join('eco_product', 'market_req_items.product_id', 'eco_product.id')
                .whereIn('market_req_items.market_req_id', orderids)
                .select(
                    'market_req_items.market_req_id',
                    'eco_product.name as product_name',
                    'eco_product.image_url as product_image',
                    'eco_product.price as product_price'
                )

            const market_orders = orders.map(order => ({
                ...order,
                items: items_perorder.filter(item => item.market_req_id === order.id)
            }))
            res.json({ market_orders: market_orders })

        }
        catch (err) {
            res.status(500).json({ message: 'error occured' })
        }
    }
)

router.get('/admindashboard/scrap-orders', verifytoken, requireadmin,
    async (req: Request, res: Response) => {

        try {
            const orders = await db('scrap_req').select('*')

            const orderids = orders.map(order => order.id)

            const items_perorder = await db('scrap_req_items')
                .join('scrap', 'scrap_req_items.scrap_id', 'scrap.id')
                .whereIn('scrap_req_items.scrap_req_id', orderids)
                .select(
                    'scrap_req_items.scrap_req_id',
                    'scrap.name as scrap_name',
                    'scrap_req_items.weight as scrap_weight',
                    'scrap_req_items.price as scrap_price'
                )

            const scrap_orders = orders.map(order => ({
                ...order,
                items: items_perorder.filter(item => item.scrap_req_id === order.id)
            }))

            res.json({ scrap_orders: scrap_orders })
        }
        catch (err) {
            res.status(500).json({ message: 'error occured' })
        }
    }
)



router.get('/home/campaigns',
    async (req: Request, res: Response) => {
        const campaigns = await db('campaign').select('*')
        res.json({ campaigns: campaigns })
    }
)


router.get('/admindashboard/campaigns', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        const campaigns = await db('campaign').select('*')
        res.json({ campaigns: campaigns })
    }
)



router.get('/home/campaign-effects',
    async (req: Request, res: Response) => {
        const campaign_effect = await db('campaign_effect').select('*')
        res.json({ campaign_effect: campaign_effect })
    }
)


router.get('/admindashboard/campaign-effects', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        const campaign_effect = await db('campaign_effect').select('*')
        res.json({ campaign_effect: campaign_effect })
    }
)


router.get('/home/awards',
    async (req: Request, res: Response) => {
        try {
            const awards = await db('award').select('*').orderBy('id', 'desc');
            res.json({ awards: awards });
        } catch (err) {
            res.status(500).json({ message: 'Error fetching awards', error: err });
        }
    }
);


router.get('/admindashboard/awards', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const awards = await db('award').select('*').orderBy('id', 'desc');
            res.json({ awards: awards });
        } catch (err) {
            res.status(500).json({ message: 'Error fetching awards', error: err });
        }
    }
);

router.post('/admindashboard/award/post', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const { title, description, image_url, date_won } = req.body;
            if (!title) {
                res.status(400).json({ message: 'Award title is required' });
                return;
            }

            const [newAward] = await db('award').insert({
                title,
                description: description || null,
                image_url: image_url || null,
                date_won: date_won ? new Date(date_won) : new Date(),
            }).returning(['id', 'title', 'description', 'image_url', 'date_won', 'created_at']);

            res.status(201).json({ message: 'Award created successfully', award: newAward });
        } catch (err) {
            console.error('Failed to create award:', err);
            res.status(500).json({ message: 'Failed to create award', error: err });
        }
    }
);

router.put('/admindashboard/award/update/:id', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const currentAward = await db('award').where({ id }).first();
            if (!currentAward) {
                res.status(404).json({ message: 'Award record not found' });
                return;
            }

            const { title, description, image_url, date_won } = req.body;
            const updates: any = {};
            if (title !== undefined) updates.title = title;
            if (description !== undefined) updates.description = description;
            if (image_url !== undefined) updates.image_url = image_url;
            if (date_won !== undefined) updates.date_won = date_won ? new Date(date_won) : null;

            if (Object.keys(updates).length > 0) {
                await db('award').where({ id }).update(updates);
            }

            res.status(200).json({ message: 'Award updated successfully' });
        } catch (err) {
            console.error('Failed to update award:', err);
            res.status(500).json({ message: 'Failed to update award', error: err });
        }
    }
);


router.put('/admindashboard/market-orders/status/:id', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const { status } = req.body

            const updatecount = await db('market_req').where({ id }).update({ status })
            if (!updatecount) {
                res.status(404).json({ message: 'Record not found' })
                return;
            }
            res.status(200).json({ message: 'Updated successfully' })
        }

        catch (err) {
            res.status(500).json({ message: 'Failed to update market order status', error: err })
        }
    }
)


router.put('/admindashboard/scrap-orders/status/:id', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const { status } = req.body

            const updatecount = await db('scrap_req').where({ id }).update({ status })
            if (!updatecount) {
                res.status(404).json({ message: 'Record not found' })
                return;
            }
            res.status(200).json({ message: 'Updated successfully' })
        }

        catch (err) {
            res.status(500).json({ message: 'Failed to update scrap order status', error: err })
        }
    }
)

/* ==========================================================================
   ORDER PLACEMENT ROUTES (Marketplace Orders & Scrap Pickup Requests)
   Saved directly into market_req, market_req_items, scrap_req, scrap_req_items
   ========================================================================== */

// 1. Place Eco Marketplace Order
router.post('/market-order', async (req: Request, res: Response) => {
    try {
        const {
            name,
            phone_number,
            email,
            division,
            district,
            thana,
            address,
            payment_method,
            total_price,
            items
        } = req.body;

        if (!phone_number || !division || !district || !thana || !address) {
            res.status(400).json({ message: 'Missing required delivery details (phone, division, district, thana, address)' });
            return;
        }

        let customer_id = req.user?.id || req.body.customer_id;
        if (!customer_id) {
            let cust = await db('customer').where({ phone_number }).first();
            if (!cust && email) {
                cust = await db('customer').where({ email }).first();
            }
            if (cust) {
                customer_id = cust.id;
            } else {
                const [newCust] = await db('customer')
                    .insert({
                        name: name || 'Customer',
                        email: email || null,
                        phone_number,
                        password: await bcrypt.hash('customer123', 10),
                        role: 'customer'
                    })
                    .returning(['id']);
                customer_id = newCust.id;
            }
        }

        const [order] = await db('market_req')
            .insert({
                name: name || 'Customer',
                phone_number,
                email: email || null,
                division,
                district,
                thana,
                address,
                payment_method: payment_method || 'Cash on Delivery',
                customer_id,
                status: 'order_placed',
                total_price: total_price ? parseFloat(total_price) : 0,
            })
            .returning(['id', 'status', 'total_price', 'created_at']);

        if (Array.isArray(items) && items.length > 0) {
            const itemInserts: any[] = [];
            for (const item of items) {
                const prodId = item.product_id || item.id;
                const qty = item.quantity || 1;
                for (let i = 0; i < qty; i++) {
                    itemInserts.push({
                        market_req_id: order.id,
                        product_id: prodId,
                    });
                }
            }
            if (itemInserts.length > 0) {
                await db('market_req_items').insert(itemInserts);
            }
        }

        res.status(201).json({
            message: 'Marketplace order placed successfully',
            order_id: order.id,
            order,
        });
    } catch (err) {
        console.error('Market order error:', err);
        res.status(500).json({ message: 'Failed to place market order', error: err });
    }
});

router.post('/market-req', async (req: Request, res: Response) => {
    return (router as any).handle(Object.assign(req, { url: '/market-order' }), res);
});

// 2. Place Scrap Pickup Request
router.post('/scrap-order', async (req: Request, res: Response) => {
    try {
        const {
            name,
            phone_number,
            email,
            alternate_number,
            pickup_schedule,
            division,
            district,
            thana,
            address,
            instruction,
            items
        } = req.body;

        if (!phone_number || !division || !district || !thana || !address) {
            res.status(400).json({ message: 'Missing required scrap pickup details (phone, division, district, thana, address)' });
            return;
        }

        let customer_id = req.user?.id || req.body.customer_id;
        if (!customer_id) {
            let cust = await db('customer').where({ phone_number }).first();
            if (!cust && email) {
                cust = await db('customer').where({ email }).first();
            }
            if (cust) {
                customer_id = cust.id;
            } else {
                const [newCust] = await db('customer')
                    .insert({
                        name: name || 'Scrap Customer',
                        email: email || null,
                        phone_number,
                        password: await bcrypt.hash('customer123', 10),
                        role: 'customer'
                    })
                    .returning(['id']);
                customer_id = newCust.id;
            }
        }

        const [order] = await db('scrap_req')
            .insert({
                name: name || 'Scrap Customer',
                phone_number,
                email: email || null,
                alternate_number: alternate_number || null,
                pickup_schedule: pickup_schedule ? new Date(pickup_schedule) : new Date(),
                division,
                district,
                thana,
                address,
                instruction: instruction || null,
                customer_id,
                status: 'requested',
            })
            .returning(['id', 'status', 'created_at']);

        if (Array.isArray(items) && items.length > 0) {
            const itemInserts = items.map((item: any) => ({
                scrap_req_id: order.id,
                scrap_id: item.scrap_id || item.id,
                weight: parseFloat(item.weight) || 0,
                price: parseFloat(item.price) || 0,
            }));
            await db('scrap_req_items').insert(itemInserts);
        }

        res.status(201).json({
            message: 'Scrap pickup request recorded successfully',
            order_id: order.id,
            order,
        });
    } catch (err) {
        console.error('Scrap order error:', err);
        res.status(500).json({ message: 'Failed to record scrap pickup request', error: err });
    }
});

router.post('/scrap-req', async (req: Request, res: Response) => {
    return (router as any).handle(Object.assign(req, { url: '/scrap-order' }), res);
});

router.post('/admindashboard/scrap-transaction/post', verifytoken, requireadmin,
    async (req: Request, res: Response) => {

        try {
            const { collector_phone_number, customer_phone_number, items } = req.body

            if (!collector_phone_number || !customer_phone_number) {
                res.status(400).json({ message: 'Collector and customer phone numbers are required' })
                return;
            }

            if (!Array.isArray(items) || items.length === 0) {
                res.status(400).json({ message: 'An items array containing at least one scrap material is required' });
                return;
            }

            const [collector, customer] = await Promise.all([
                db('scrap_collector').where({ phone_number: String(collector_phone_number).trim() }).select('id').first(),
                db('customer').where({ phone_number: String(customer_phone_number).trim() }).select('id').first(),
            ])

            if (!collector) {
                res.status(404).json({ message: `Scrap collector not found with phone number ${collector_phone_number}` })
                return;
            }

            if (!customer) {
                res.status(404).json({ message: `Customer not found with phone number ${customer_phone_number}` })
                return;
            }

            const insertRecords = items.map((item: any) => ({
                actual_weight: item.weight,
                actual_price: item.price,
                customer_id: customer.id,
                collector_id: collector.id,
                scrap_id: item.scrap_id
            }));

            await db('scrap_transaction').insert(insertRecords);

            res.status(201).json({
                message: `Recorded ${insertRecords.length} scrap material item(s) for this transaction successfully`,
                count: insertRecords.length
            });
        }
        catch (err) {
            res.status(500).json({ message: 'Failed to record scrap transaction', error: err })
        }

    })

// Admin route to view all scrap materials with id, name, price, description
router.get('/admindashboard/scrap/display', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const scraps = await db('scrap').select('*').orderBy('id', 'asc');
            res.json({ scrap_materials: scraps });
        } catch (err) {
            res.status(500).json({ message: 'Failed to retrieve scrap materials', error: err });
        }
    }
);

// Admin CRUD routes for Scrap Materials / Types
router.post('/admindashboard/scrap/post', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const { name, price, description } = req.body;
            if (!name || price === undefined || price === null) {
                res.status(400).json({ message: 'Scrap material name and unit price are required' });
                return;
            }

            const existing = await db('scrap').where({ name: String(name).trim() }).first();
            if (existing) {
                res.status(400).json({ message: `A scrap material named '${name.trim()}' already exists` });
                return;
            }

            await db('scrap').insert({
                name: String(name).trim(),
                price: parseFloat(price),
                description: description ? String(description).trim() : ''
            });

            res.status(201).json({ message: 'New scrap material added to catalog successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Failed to add scrap material', error: err });
        }
    }
);

router.put('/admindashboard/scrap/update/:id', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, price, description } = req.body;

            const existing = await db('scrap').where({ id }).first();
            if (!existing) {
                res.status(404).json({ message: 'Scrap material not found' });
                return;
            }

            const updateData: any = {};
            if (name !== undefined) updateData.name = String(name).trim();
            if (price !== undefined) updateData.price = parseFloat(price);
            if (description !== undefined) updateData.description = String(description).trim();

            await db('scrap').where({ id }).update(updateData);
            res.json({ message: 'Scrap material updated successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Failed to update scrap material', error: err });
        }
    }
);

router.delete('/admindashboard/scrap/delete/:id', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const existing = await db('scrap').where({ id }).first();
            if (!existing) {
                res.status(404).json({ message: 'Scrap material not found' });
                return;
            }

            await db('scrap').where({ id }).delete();
            res.json({ message: 'Scrap material removed from catalog successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Failed to delete scrap material', error: err });
        }
    }
);




router.post('/admindashboard/campaign/post', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const { title, description, registration_link } = req.body
            const insertable = await db('campaign').insert({
                title,
                description,
                registration_link,
            })

            res.status(201).json({ message: 'Campaign created successfully' })
        }

        catch (err) {
            res.status(500).json({ message: 'Failed to create campaign', error: err })
        }

    }
)


router.put('/admindashboard/campaign/update/:id', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params


            const currentuser = await db('campaign').where({ id }).first()
            if (!currentuser) {
                res.status(404).json({ message: 'Campaign record not found' })
                return;
            }
            const updates = dirtyfunction(currentuser, req.body)

            if (Object.keys(updates).length > 0) {
                await db('campaign').where({ id }).update(updates)
            }

            res.status(200).json({ message: 'Campaign updated successfully' })
        }

        catch (err) {
            res.status(500).json({ message: 'Failed to update campaign', error: err })
        }

    }
)


router.post('/admindashboard/campaign-effect/post', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const { campaign_title, effect } = req.body
            const insertable = await db('campaign_effect').insert({
                campaign_title,
                effect,
            })

            res.status(201).json({ message: 'Campaign effect created successfully' })
        }

        catch (err) {
            res.status(500).json({ message: 'Failed to create campaign effect', error: err })
        }
    }
)


router.put('/admindashboard/campaign-effect/update/:id', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params


            const currentuser = await db('campaign_effect').where({ id }).first()
            if (!currentuser) {
                res.status(404).json({ message: 'Campaign effect record not found' })
                return;
            }
            const updates = dirtyfunction(currentuser, req.body)

            if (Object.keys(updates).length > 0) {
                await db('campaign_effect').where({ id }).update(updates)
            }

            res.status(200).json({ message: 'Campaign effect updated successfully' })
        }

        catch (err) {
            res.status(500).json({ message: 'Failed to update campaign effect', error: err })
        }

    }
)


router.get('/admindashboard/collector-display', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const all_collectors = await db('scrap_collector').select(
                'id',
                'name',
                'email',
                'phone_number',
                'nid',
                'division',
                'district',
                'thana',
                'address',
                'vehicle_type',
                'is_verified',
                'created_at'
            );

            // Aggregate scrap transaction stats per collector
            const collectorTotals = await db('scrap_transaction')
                .select('collector_id')
                .count('id as total_transactions')
                .sum('actual_weight as total_weight')
                .sum('actual_price as total_price')
                .groupBy('collector_id');

            const totalsMap = new Map();
            for (const t of collectorTotals) {
                totalsMap.set(t.collector_id, {
                    total_transactions: Number(t.total_transactions || 0),
                    total_weight: parseFloat(t.total_weight) || 0,
                    total_price: parseFloat(t.total_price) || 0
                });
            }

            const enriched = all_collectors.map(c => ({
                ...c,
                ...(totalsMap.get(c.id) || { total_transactions: 0, total_weight: 0, total_price: 0 })
            }));

            // Fetch recent scrap transactions with material, collector and customer info
            const transactions = await db('scrap_transaction')
                .join('scrap', 'scrap_transaction.scrap_id', 'scrap.id')
                .leftJoin('scrap_collector', 'scrap_transaction.collector_id', 'scrap_collector.id')
                .leftJoin('customer', 'scrap_transaction.customer_id', 'customer.id')
                .orderBy('scrap_transaction.id', 'desc')
                .limit(50)
                .select(
                    'scrap_transaction.id',
                    'scrap.name as scrap_name',
                    'scrap_transaction.actual_weight',
                    'scrap_transaction.actual_price',
                    'scrap_collector.name as collector_name',
                    'scrap_collector.phone_number as collector_phone',
                    'customer.name as customer_name',
                    'customer.phone_number as customer_phone',
                    'scrap_transaction.created_at'
                );

            res.json({
                all_collectors: enriched,
                collectors: enriched,
                transactions: transactions
            });
        }
        catch (err) {
            console.error('Error fetching collector display:', err);
            res.status(500).json({ message: 'server breakdown', error: err });
        }
    }
)



router.post('/admindashboard/collector-verify/:id', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params

            const { is_verified } = req.body

            await db('scrap_collector').where({ id }).update(
                {
                    is_verified: is_verified
                }
            )

            res.json({ message: 'collector status updated' })
        }

        catch (err) {
            res.status(500).json({ message: 'server break down' })
        }
    }
)


router.post('/moderator-register', verifytoken, requireadminonly,
    async (req: Request, res: Response) => {
        try {
            const { name, email, password, role } = req.body;
            if (!email || !password) {
                res.status(400).json({ message: 'Email and password are required' });
                return;
            }

            const existing = await db('admin').where({ email }).first();
            if (existing) {
                res.status(409).json({ message: 'Email is already registered' });
                return;
            }

            const hashedpass = await bcrypt.hash(password, 10);
            await db('admin').insert({
                name,
                email,
                password: hashedpass,
                role: role || 'moderator',
            });

            res.status(201).json({ message: 'Moderator registered successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Failed to register moderator', error: err });
        }
    }
);

/* ==========================================================================
   REGISTRATION ROUTES (Customer, Collector, Admin)
   ========================================================================== */

// 1. Customer Registration
router.post('/customer-register', async (req: Request, res: Response) => {
    try {
        const { name, email, phone_number, password } = req.body;

        if (!phone_number || !password) {
            res.status(400).json({ message: 'Phone number and password are required' });
            return;
        }

        const existingCustomer = await db('customer')
            .where({ phone_number })
            .orWhere(function () {
                if (email) this.where({ email });
            })
            .first();

        if (existingCustomer) {
            res.status(409).json({ message: 'Customer with this email or phone number already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [newCustomer] = await db('customer')
            .insert({
                name,
                email,
                phone_number,
                password: hashedPassword,
                role: 'customer',
            })
            .returning(['id', 'name', 'email', 'phone_number', 'role']);

        res.status(201).json({ message: 'Customer registered successfully', customer: newCustomer });
    } catch (err) {
        console.error('Customer registration error:', err);
        res.status(500).json({ message: 'Server error during customer registration', error: err });
    }
});

// 2. Collector Registration
router.post('/collector-register', async (req: Request, res: Response) => {
    try {
        const {
            name,
            email,
            phone_number,
            password,
            nid,
            division,
            district,
            thana,
            address,
            vehicle_type,
        } = req.body;

        if (!phone_number || !password || !nid || !division || !district || !thana || !address) {
            res.status(400).json({ message: 'Missing required registration details' });
            return;
        }

        const existingCollector = await db('scrap_collector')
            .where({ phone_number })
            .orWhere({ nid })
            .orWhere(function () {
                if (email) this.where({ email });
            })
            .first();

        if (existingCollector) {
            res.status(409).json({ message: 'Collector with this phone number, NID, or email already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [newCollector] = await db('scrap_collector')
            .insert({
                name,
                email,
                phone_number,
                password: hashedPassword,
                nid,
                division,
                district,
                thana,
                address,
                vehicle_type,
                role: 'scrap_collector',
                is_verified: false,
            })
            .returning(['id', 'name', 'email', 'phone_number', 'role', 'is_verified']);

        res.status(201).json({ message: 'Collector registered successfully and pending verification', collector: newCollector });
    } catch (err) {
        console.error('Collector registration error:', err);
        res.status(500).json({ message: 'Server error during collector registration', error: err });
    }
});

// 3. Admin Registration (Restricted to Super Admin)
router.post('/admin-register', verifytoken, requireadminonly, async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        const existingAdmin = await db('admin').where({ email }).first();
        if (existingAdmin) {
            res.status(409).json({ message: 'Admin with this email already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [newAdmin] = await db('admin')
            .insert({
                name,
                email,
                password: hashedPassword,
                role,
            })
            .returning(['id', 'name', 'email', 'role']);

        res.status(201).json({ message: 'Admin account created successfully', admin: newAdmin });
    } catch (err) {
        console.error('Admin registration error:', err);
        res.status(500).json({ message: 'Server error during admin registration', error: err });
    }
});

/* ==========================================================================
   DELETE CONTENT ROUTES (Awards, Campaigns, Campaign Effects)
   ========================================================================== */

// 1. Delete Award
router.delete('/admindashboard/award/delete/:id', verifytoken, requireadmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedCount = await db('award').where({ id }).del();

        if (!deletedCount) {
            res.status(404).json({ message: 'Award record not found' });
            return;
        }

        res.status(200).json({ message: 'Award deleted successfully' });
    } catch (err) {
        console.error('Award deletion error:', err);
        res.status(500).json({ message: 'Failed to delete award', error: err });
    }
});

// 2. Delete Campaign
router.delete('/admindashboard/campaign/delete/:id', verifytoken, requireadmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedCount = await db('campaign').where({ id }).del();

        if (!deletedCount) {
            res.status(404).json({ message: 'Campaign record not found' });
            return;
        }

        res.status(200).json({ message: 'Campaign deleted successfully' });
    } catch (err) {
        console.error('Campaign deletion error:', err);
        res.status(500).json({ message: 'Failed to delete campaign', error: err });
    }
});

// 3. Delete Campaign Effect
router.delete('/admindashboard/campaign-effect/delete/:id', verifytoken, requireadmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedCount = await db('campaign_effect').where({ id }).del();

        if (!deletedCount) {
            res.status(404).json({ message: 'Campaign effect record not found' });
            return;
        }

        res.status(200).json({ message: 'Campaign effect deleted successfully' });
    } catch (err) {
        console.error('Campaign effect deletion error:', err);
        res.status(500).json({ message: 'Failed to delete campaign effect', error: err });
    }
});

/* ==========================================================================
   PROFILE UPDATE & DELETE ROUTES (Admin, Customer, Collector)
   ========================================================================== */

// --- ADMIN PROFILE ---
router.put('/admin/profile/update', verifytoken, requireadmin, async (req: Request, res: Response) => {
    try {
        const adminId = req.user?.id;
        const { name, email, password } = req.body;

        const currentAdmin = await db('admin').where({ id: adminId }).first();
        if (!currentAdmin) {
            res.status(404).json({ message: 'Admin account not found' });
            return;
        }

        const updates: any = {};
        if (name && name !== currentAdmin.name) updates.name = name;
        if (email && email !== currentAdmin.email) updates.email = email;
        if (password) updates.password = await bcrypt.hash(password, 10);

        if (Object.keys(updates).length > 0) {
            await db('admin').where({ id: adminId }).update(updates);
        }

        res.status(200).json({ message: 'Admin profile updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update admin profile', error: err });
    }
});

router.delete('/admin/profile/delete', verifytoken, requireadminonly, async (req: Request, res: Response) => {
    try {
        const id = req.user?.id;

        // Invalidate all active refresh tokens for this admin
        await db('refresh_token').where({ user_id: id, role: 'admin' }).del();
        const deletedCount = await db('admin').where({ id }).del();

        if (!deletedCount) {
            res.status(404).json({ message: 'Admin account not found' });
            return;
        }

        res.status(200).json({ message: 'Admin account deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete admin profile', error: err });
    }
});




router.get('/collectordashboard/profile', verifytoken,
    async (req: Request, res: Response) => {
        const id = req.user?.id
        try {
            const collectorinfo = await db('scrap_collector').where({ id }).select('*')
            res.json({ collectorinfo: collectorinfo })
        }

        catch (err) {
            res.status(500).json({ message: 'error retrieving collector profile' })
        }
    }
)


router.get('/customerdashboard/profile', verifytoken,
    async (req: Request, res: Response) => {
        const id = req.user?.id
        try {
            const customerinfo = await db('customer').where({ id }).select('*')
            res.json({ customerinfo: customerinfo })
        }

        catch (err) {
            res.status(500).json({ message: 'error retrieving customer profile' })
        }
    }
)


router.get('/admindashboard/profile', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        const id = req.user?.id
        try {
            const admininfo = await db('admin').where({ id }).select('*')
            res.json({ admininfo: admininfo })
        }

        catch (err) {
            res.status(500).json({ message: 'error retrieving admin profile' })
        }
    }
)

router.get('/scrap-materials/display',
    async (req: Request, res: Response) => {
        try {
            const scrap_materials = await db('scrap').select('*')
            res.json({ scrap_materials: scrap_materials })
        }

        catch (err) {
            res.status(500).json({ message: 'error occured', err })
        }
    }
)


router.get('/eco-products/display',
    async (req: Request, res: Response) => {
        try {
            const eco_products = await db('eco_product').select('*')
            res.json({ eco_products: eco_products })
        }

        catch (err) {
            res.status(500).json({ message: 'error occured', err })
        }
    }
)





router.get('/recent-orders', verifytoken,
    async (req: Request, res: Response) => {
        try {
            const userid = req.user?.id
            const orders = await db('market_req')
                .where({ customer_id: userid })
                .orderBy('created_at', 'desc')
                .limit(5)
                .select('id', 'total_price', 'status', 'created_at')

            if (orders.length === 0) {
                res.status(200).json({ recentorders: [] })
                return;
            }

            const orderids = orders.map(order => order.id)

            const orderitems = await db('market_req_items')
                .join('eco_product', 'market_req_items.product_id', 'eco_product.id')
                .whereIn('market_req_items.market_req_id', orderids)
                .select(
                    'market_req_items.market_req_id',
                    'eco_product.name as product_name',
                    'eco_product.price as product_price',
                    'eco_product.image_url as product_image'
                )

            const recentorders = orders.map(order => ({
                ...order,
                items: orderitems.filter(orderitem => orderitem.market_req_id === order.id)
            }))

            res.status(200).json({ recentorders })
        }
        catch (err) {
            res.status(500).json({ message: 'Failed to retrieve recent orders', error: err })
        }
    }
)


router.get('/customer-stats', verifytoken,
    async (req: Request, res: Response) => {
        try {
            const scrap_stats = await db('scrap_transaction')
                .join('scrap', 'scrap_transaction.scrap_id', 'scrap.id')
                .where('scrap_transaction.customer_id', req.user?.id)
                .select('scrap.id as scrap_id', 'scrap.name as scrap_name')
                .sum('scrap_transaction.actual_weight as scrap_weight')
                .sum('scrap_transaction.actual_price as scrap_price')
                .groupBy('scrap.id', 'scrap.name')

            const formattedstats = scrap_stats.map(stat => ({
                ...stat,
                scrap_weight: parseFloat(stat.scrap_weight) || 0,
                scrap_price: parseFloat(stat.scrap_price) || 0
            }))

            res.status(200).json({ scrap_stats: formattedstats })
        }
        catch (err) {
            res.status(500).json({ message: 'Failed to retrieve customer statistics', error: err })
        }
    }
)

router.get('/collector-stats', verifytoken,
    async (req: Request, res: Response) => {
        try {
            const collector_id = req.user?.id;
            const collector = await db('scrap_collector').where({ id: collector_id }).first();

            const scrap_stats = await db('scrap_transaction')
                .join('scrap', 'scrap_transaction.scrap_id', 'scrap.id')
                .where(function () {
                    this.where('scrap_transaction.collector_id', collector_id);
                    if (collector?.id) {
                        this.orWhere('scrap_transaction.collector_id', collector.id);
                    }
                })
                .select('scrap.id as scrap_id', 'scrap.name as scrap_name')
                .sum('scrap_transaction.actual_weight as scrap_weight')
                .sum('scrap_transaction.actual_price as scrap_price')
                .groupBy('scrap.id', 'scrap.name');

            const formattedstats = scrap_stats.map(stat => ({
                ...stat,
                scrap_weight: parseFloat(stat.scrap_weight) || 0,
                scrap_price: parseFloat(stat.scrap_price) || 0
            }));

            // Also retrieve individual transaction details
            const transactions = await db('scrap_transaction')
                .join('scrap', 'scrap_transaction.scrap_id', 'scrap.id')
                .leftJoin('customer', 'scrap_transaction.customer_id', 'customer.id')
                .where('scrap_transaction.collector_id', collector_id)
                .orderBy('scrap_transaction.id', 'desc')
                .limit(50)
                .select(
                    'scrap_transaction.id',
                    'scrap.name as scrap_name',
                    'scrap_transaction.actual_weight',
                    'scrap_transaction.actual_price',
                    'customer.name as customer_name',
                    'customer.phone_number as customer_phone',
                    'scrap_transaction.created_at'
                );

            res.status(200).json({
                scrap_stats: formattedstats,
                transactions: transactions
            });
        }
        catch (err) {
            console.error('Failed to retrieve collector statistics:', err);
            res.status(500).json({ message: 'Failed to retrieve collector statistics', error: err });
        }
    }
)


router.get('/admindashboard/customer-stats', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const scrap_stats = await db('scrap_transaction')
                .join('scrap', 'scrap_transaction.scrap_id', 'scrap.id')
                .join('customer', 'scrap_transaction.customer_id', 'customer.id')
                .select(
                    'customer.id as customer_id',
                    'customer.name as customer_name',
                    'customer.phone_number as customer_phone',
                    'scrap.id as scrap_id',
                    'scrap.name as scrap_name'
                )
                .sum('scrap_transaction.actual_weight as scrap_weight')
                .sum('scrap_transaction.actual_price as scrap_price')
                .groupBy(
                    'customer.id',
                    'customer.name',
                    'customer.phone_number',
                    'scrap.id',
                    'scrap.name'
                );

            const formattedstats = scrap_stats.map(stat => ({
                ...stat,
                scrap_weight: parseFloat(stat.scrap_weight) || 0,
                scrap_price: parseFloat(stat.scrap_price) || 0
            }));

            res.status(200).json({ scrap_stats: formattedstats });
        }
        catch (err) {
            console.error('Error fetching admin customer scrap stats:', err);
            res.status(500).json({ message: 'Failed to retrieve customer statistics', error: err });
        }
    }
);

router.post('/admindashboard/member/post', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const { name, rank, responsibilities, image_url } = req.body;
            if (!name) {
                res.status(400).json({ message: 'Member name is required' });
                return;
            }

            const [newMember] = await db('member')
                .insert({
                    name,
                    rank: rank || null,
                    responsibilities: responsibilities || null,
                    image_url: image_url || null
                })
                .returning(['id', 'name', 'rank', 'responsibilities', 'image_url']);

            res.status(201).json({ message: 'member adding successful', member: newMember });
        }
        catch (err) {
            console.error('Error adding member:', err);
            res.status(500).json({ message: 'error occurred', error: err });
        }
    }
);

router.get('/admindashboard/member/display', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const members = await db('member').select('*').orderBy('id', 'asc');
            res.json({ members: members });
        }
        catch (err) {
            console.error('Error displaying members:', err);
            res.status(500).json({ message: 'error occurred', error: err });
        }
    }
);

router.get('/home/members',
    async (req: Request, res: Response) => {
        try {
            const members = await db('member').select('*').orderBy('id', 'asc');
            res.json({ members: members });
        }
        catch (err) {
            res.status(500).json({ message: 'error occurred', error: err });
        }
    }
);

router.put('/admindashboard/member/update/:id', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, rank, responsibilities, image_url } = req.body;

            const currentmember = await db('member').where({ id }).first();
            if (!currentmember) {
                res.status(404).json({ message: 'member not found' });
                return;
            }

            const updates: any = {};
            if (name !== undefined && name !== currentmember.name) updates.name = name;
            if (rank !== undefined && rank !== currentmember.rank) updates.rank = rank;
            if (responsibilities !== undefined && responsibilities !== currentmember.responsibilities) updates.responsibilities = responsibilities;
            if (image_url !== undefined && image_url !== currentmember.image_url) updates.image_url = image_url;

            if (Object.keys(updates).length > 0) {
                await db('member').where({ id }).update(updates);
            }
            res.json({ message: 'member updating successful' });
        }
        catch (err) {
            console.error('Error updating member:', err);
            res.status(500).json({ message: 'error occurred', error: err });
        }
    }
);

router.delete('/admindashboard/member/delete/:id', verifytoken, requireadmin,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const countmember = await db('member').where({ id }).del();
            if (countmember === 0) {
                res.status(404).json({ message: 'member not found' });
                return;
            }

            res.json({ message: 'member deleting successful' });
        }
        catch (err) {
            console.error('Error deleting member:', err);
            res.status(500).json({ message: 'error occurred', error: err });
        }
    }
);



export default router;