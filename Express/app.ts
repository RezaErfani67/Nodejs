// npm install --save -D typescript @types/express @types/node ts-node nodemon
// npx tsc --init
//uncomment "outDir": "../dist" in tsconfig.json,
//add to package.json
// "dev": "nodemon --watch src/**/*.ts --exec ts-node src/app.ts", 
//"builsts": "tsc",
//"start": "node dist/app.js" 


import express , {Request , Response} from "express"
const app = express();

app.get("/" , (req, res) =>{

})

app.listen(3400 , ()=>{
  console.log("server is up")
})
