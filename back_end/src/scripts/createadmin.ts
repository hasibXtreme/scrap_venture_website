import bcrypt from 'bcrypt';
import readline from 'readline';
import db from '../db';

const rl = readline.createInterface({
    input: process.stdin,
    output:process.stdout
})

const askQuestion = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function createadmin()
{
    console.log('------ADMIN REGISTER------')

    try{
        const name = await askQuestion('Enter Admin name: ')
        const email = await askQuestion('Enter Admin Name: ')
        const password = await askQuestion('Enter password: ')

        if(!email || !password)
        {
            console.log('email and password is compulsory')
        }
        
        const existing_user = await db('admin').where({email}).first()

        if(existing_user)
        {
            console.log('The user already exists')
        }

        else 
        {
            const hashedpass = await bcrypt.hash(password,10)
            await db('admin').insert({
                name:name,
                email,
                password:hashedpass,
                role: 'admin'
            })
        }
    }
    catch(err){
            console.log('error occured in creating admin')
    }

    finally{
        rl.close()
        await db.destroy()
        process.exit(0)
    }
}

createadmin()