const mysql = require("mysql2")

const pool = mysql.createPool({
    host: "localhost",
    port: 8811,
    user: "root",
    password: "tipjs",
    database: "test"
})

const batchSize = 100000
const totalSize = 1000000

let currentId = 1
console.time()
const insertBatch = async () => {
    const values = []
    for (let i = 0; i < batchSize && currentId <= totalSize; i++){
        const name = `name-${currentId}`
        const age = currentId
        const address = `address-${currentId}`
        values.push([currentId, name, age, address])
        currentId++
    }

    if(!values.length){
        console.timeEnd()
        pool.end( err=> {
            if(err){
                console.log('error occured when runing batch')
            }else{
                console.log('Connection pool close successfully')
            }
        })
        return
    }

    const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`

    pool.query(sql, [values], async function(err, result){
        if(err) throw err
        console.log(`inserted ${result.affectedRows} records`)
        await insertBatch()
    })
}

insertBatch().catch(console.error);


