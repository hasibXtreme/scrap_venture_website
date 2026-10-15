import bcrypt from 'bcrypt';
import db from '../db.js';

async function seed() {
    console.log('--- SEEDING INITIAL DATABASE ---');

    try {
        // 1. Seed Admin
        const existingAdmin = await db('admin').where({ email: 'admin@scrapventure.com' }).first();
        if (!existingAdmin) {
            const hashedAdminPass = await bcrypt.hash('admin123', 10);
            await db('admin').insert({
                name: 'Chief Administrator',
                email: 'admin@scrapventure.com',
                password: hashedAdminPass,
                role: 'admin'
            });
            console.log('Default super admin created: admin@scrapventure.com / admin123');
        }

        // 2. Seed Customer
        const existingCustomer = await db('customer').where({ email: 'customer@scrapventure.com' }).first();
        if (!existingCustomer) {
            const hashedCustPass = await bcrypt.hash('customer123', 10);
            await db('customer').insert({
                name: 'Rahim Ahmed',
                email: 'customer@scrapventure.com',
                phone_number: '01711000001',
                password: hashedCustPass,
                role: 'customer'
            });
            console.log('Default customer created: customer@scrapventure.com / customer123');
        }

        // 3. Seed Collector
        const existingCollector = await db('scrap_collector').where({ email: 'collector@scrapventure.com' }).first();
        if (!existingCollector) {
            const hashedColPass = await bcrypt.hash('collector123', 10);
            await db('scrap_collector').insert({
                name: 'Karim Ullah',
                email: 'collector@scrapventure.com',
                phone_number: '01811000001',
                password: hashedColPass,
                nid: '19901234567890',
                division: 'Dhaka',
                district: 'Dhaka',
                thana: 'Mirpur',
                address: 'Section 10, Block C, Mirpur, Dhaka',
                vehicle_type: 'Cargo Van',
                role: 'scrap_collector',
                is_verified: true
            });
            console.log('Default collector created: collector@scrapventure.com / collector123');
        }

        // 4. Seed Scrap Materials
        const scrapCount = await db('scrap').count('* as count').first();
        if (Number(scrapCount?.count ?? 0) === 0) {
            await db('scrap').insert([
                { name: 'Corrugated Cardboard', price: 16.50, description: 'Clean, dry packaging cartons and boxes' },
                { name: 'Newspaper & Mixed Paper', price: 14.00, description: 'Daily newspapers, office paper, and old books' },
                { name: 'PET Bottles (Grade A)', price: 32.00, description: 'Clear soft drink, mineral water, and juice bottles' },
                { name: 'HDPE Rigid Plastic', price: 38.00, description: 'Detergent bottles, milk jugs, shampoo containers' },
                { name: 'Aluminium Cans', price: 120.00, description: 'Beverage cans, foil food trays, clean scrap aluminium' },
                { name: 'Scrap Iron & Steel', price: 42.00, description: 'Structural iron, household appliances, rods and plates' },
                { name: 'E-Waste (Motherboards & PCBs)', price: 180.00, description: 'Computers, laptops, mobile phones, printed circuit boards' },
            ]);
            console.log('Default scrap materials seeded');
        }

        // 5. Seed Eco Products
        const prodCount = await db('eco_product').count('* as count').first();
        if (Number(prodCount?.count ?? 0) === 0) {
            await db('eco_product').insert([
                {
                    name: 'EcoWeave Upcycled Denim Tote Bag',
                    price: 850.00,
                    description: 'Handcrafted durable everyday tote spun from discarded post-industrial denim & cotton.',
                    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: 'Circular HDPE Architectural Plastic Board',
                    price: 2400.00,
                    description: 'Termite-proof, water-resistant decorative board made from 100% compressed HDPE bottle caps.',
                    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: 'Solid Recycled Plastic Park Bench',
                    price: 6800.00,
                    description: 'All-weather, heavy-duty park bench molded from 45kg of post-consumer plastic waste.',
                    image_url: 'https://images.unsplash.com/photo-1596263576925-df1b997ee485?auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: 'Minimalist Recycled Terrazzo Coffee Table',
                    price: 4950.00,
                    description: 'Sleek geometric coffee table featuring polished recycled glass aggregates and composite plastic.',
                    image_url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: 'TerraCycle Self-Watering Planter Tub',
                    price: 950.00,
                    description: 'UV-stabilized planter molded from discarded ocean-bound nylon fishing nets and bottle caps.',
                    image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80'
                }
            ]);
            console.log('Default eco products seeded');
        }

        // 6. Seed Awards
        const awardCount = await db('award').count('* as count').first();
        if (Number(awardCount?.count ?? 0) === 0) {
            await db('award').insert([
                {
                    title: 'Official Recycling Partner — University Activation Programme 2025',
                    description: 'Served as the Official Recycling Partner at the University Activation Programme 2025 (Dhaka Division), hosted by the iDEA Project, ICT Division, at UITS University.',
                    image_url: 'assets/awards/1.jpg',
                    date_won: '2025-08-15'
                },
                {
                    title: 'Exhibitor — Innoverse Bangladesh 2025',
                    description: 'Showcased the smart waste management solution to students, industry experts, and innovation leaders at the two-day Innoverse Bangladesh 2025 exhibition.',
                    image_url: 'assets/awards/2.jpg',
                    date_won: '2025-11-20'
                },
                {
                    title: 'Project Showcase — Broadband Expo 2026',
                    description: 'Selected for the Project Showcase Category at Broadband Expo 2026, inaugurated by the Hon\'ble State Minister for Posts, Telecommunications and IT.',
                    image_url: 'assets/awards/3.jpg',
                    date_won: '2026-04-10'
                },
                {
                    title: 'National Innovation Challenge — ICT Division',
                    description: 'Recognized at the National Innovation Challenge, powered by the DEIED Project, BHTPA, held at Dhaka University.',
                    image_url: 'assets/awards/4.jpg',
                    date_won: '2026-06-05'
                },
                {
                    title: 'International Award — CIRDAP Innovation Challenge 2026',
                    description: 'Won the International Award at the CIRDAP International Rural Development Innovation Challenge 2026, presented by Mirza Fakhrul Islam Alamgir.',
                    image_url: 'assets/awards/5.jpg',
                    date_won: '2026-07-22'
                },
                {
                    title: '2nd Runner-up — Hult Prize UITS 2026',
                    description: 'Placed 2nd Runner-up at Hult Prize UITS 2026, hosted by the University of Information Technology & Sciences (UITS).',
                    image_url: 'assets/awards/6.jpg',
                    date_won: '2026-03-18'
                }
            ]);
            console.log('Default awards seeded');
        }

        // 7. Seed Campaigns
        const campCount = await db('campaign').count('* as count').first();
        if (Number(campCount?.count ?? 0) === 0) {
            await db('campaign').insert([
                {
                    title: 'Zero Waste Campus Drive 2026',
                    description: 'Join ScrapVenture in mobilizing 50+ university and college campuses across Bangladesh to divert paper and e-waste into circular upcycling.',
                    registration_link: 'https://forms.gle/scrapventure-campus-2026'
                },
                {
                    title: 'Dhaka Green Doorstep Blitz',
                    description: 'Apartment complexes and residential societies can schedule bulk neighborhood scrap collection days with instant bKash cashback bonuses.',
                    registration_link: 'https://forms.gle/scrapventure-neighborhood-blitz'
                }
            ]);
            console.log('Default campaigns seeded');
        }

        // 8. Seed Campaign Effects
        const effectCount = await db('campaign_effect').count('* as count').first();
        if (Number(effectCount?.count ?? 0) === 0) {
            await db('campaign_effect').insert([
                {
                    campaign_title: 'Zero Waste Campus Drive 2026',
                    effect: '4,850 kg scrap diverted from landfills; 3,200+ students actively participated across 14 university departments, averting 7.8 tons of CO₂ lifecycle emissions.'
                },
                {
                    campaign_title: 'Dhaka Green Doorstep Blitz',
                    effect: '14,200 kg total volume collected with 99.4% on-time pickups; formal collector earnings surged by +35% with calibrated digital weighing.'
                },
                {
                    campaign_title: 'E-Waste Zero-Hazard Initiative',
                    effect: 'Reclaimed 2,650 kg obsolete tech (1,920 devices) with certified non-toxic dismantling, saving 480 kg of toxic lead/mercury from urban groundwater.'
                }
            ]);
            console.log('Default campaign effects seeded');
        }

        // 9. Seed some transactions and orders for realistic dashboard charts
        const cust = await db('customer').where({ email: 'customer@scrapventure.com' }).first();
        const col = await db('scrap_collector').where({ email: 'collector@scrapventure.com' }).first();
        const scCardboard = await db('scrap').where({ name: 'Corrugated Cardboard' }).first();
        const scIron = await db('scrap').where({ name: 'Scrap Iron & Steel' }).first();
        const scPET = await db('scrap').where({ name: 'PET Bottles (Grade A)' }).first();

        const txCount = await db('scrap_transaction').count('* as count').first();
        if (Number(txCount?.count ?? 0) === 0 && cust && col && scCardboard) {
            await db('scrap_transaction').insert([
                {
                    actual_weight: 45.5,
                    actual_price: 750.75,
                    customer_id: cust.id,
                    collector_id: col.id,
                    scrap_id: scCardboard.id
                },
                {
                    actual_weight: 30.0,
                    actual_price: 1260.00,
                    customer_id: cust.id,
                    collector_id: col.id,
                    scrap_id: scIron?.id || scCardboard.id
                },
                {
                    actual_weight: 18.2,
                    actual_price: 582.40,
                    customer_id: cust.id,
                    collector_id: col.id,
                    scrap_id: scPET?.id || scCardboard.id
                }
            ]);
            console.log('Default scrap transactions seeded');
        }

        const mktReqCount = await db('market_req').count('* as count').first();
        const p1 = await db('eco_product').first();
        if (Number(mktReqCount?.count ?? 0) === 0 && cust && p1) {
            const [mr] = await db('market_req').insert({
                name: cust.name,
                phone_number: cust.phone_number,
                email: cust.email,
                division: 'Dhaka',
                district: 'Dhaka',
                thana: 'Mirpur',
                address: 'House 14, Road 5, Mirpur DOHS',
                payment_method: 'Cash On Delivery',
                customer_id: cust.id,
                status: 'order_placed',
                total_price: p1.price
            }).returning('id');
            const mrId = typeof mr === 'object' ? mr.id : mr;
            await db('market_req_items').insert({
                market_req_id: mrId,
                product_id: p1.id
            });
            console.log('Default market request seeded');
        }

        const scrapReqCount = await db('scrap_req').count('* as count').first();
        if (Number(scrapReqCount?.count ?? 0) === 0 && cust && scCardboard) {
            const [sr] = await db('scrap_req').insert({
                name: cust.name,
                phone_number: cust.phone_number,
                email: cust.email,
                alternate_number: '01911000001',
                pickup_schedule: new Date(),
                division: 'Dhaka',
                district: 'Dhaka',
                thana: 'Mirpur',
                address: 'House 14, Road 5, Mirpur DOHS',
                instruction: 'Call 10 minutes before arrival at gate',
                customer_id: cust.id,
                status: 'confirmed'
            }).returning('id');
            const srId = typeof sr === 'object' ? sr.id : sr;
            await db('scrap_req_items').insert({
                scrap_req_id: srId,
                scrap_id: scCardboard.id,
                weight: 25,
                price: 412.50
            });
            console.log('Default scrap pickup request seeded');
        }

        console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
    } catch (err) {
        console.error('Error during seeding:', err);
    } finally {
        await db.destroy();
        process.exit(0);
    }
}

seed();
