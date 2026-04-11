import {app} from './server';
import {db} from './db';


const PORT = process.env.PORT || 4000;

db.connect()
.then(() => {
    console.log('Database connected to PostgresSQL');
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`)
    })
})
.catch(err => {
    console.error('PostgresSQL connection failed:', err)
    process.exit(1);
})