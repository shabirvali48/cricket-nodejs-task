

const express=require("express");
const path=require("path");
const {open}=require("sqlite");
const sqlite3=require("sqlite3");


const app=express();

const port=4446;
const dbPath=path.join(__dirname,"cricketTeam1.db");
let db=null;

const initializeDBAndServer= async()=>{
    try {
        db= await open({
            filename:dbPath,
            driver:sqlite3.Database,
        });
        app.listen(port,()=>{
            console.log(`DB Conected \n Server running on ${port}`)
        })
    } catch (e) {
        console.log(`DB Error:${e.message}`);
        process.exit(1)
    }
}
initializeDBAndServer();

// GET METHOD
app.get("/players",async(req,res)=>{
    const getTeamsQuery=`SELECT * FROM cricket_team `;
    const team=await db.all(getTeamsQuery);
    res.send(team);
});

//  POST METHOD
    app.use(express.json())
app.post("/players",async(req,res)=>{
  const {player_id,player_name,jersey_number,role}=req.body;
  console.log(req.body)
  try {
    const addUserQuery=`INSERT INTO cricket_team(player_id,player_name,jersey_number,role)
    VALUES(
   ${player_id},
    '${player_name}',
    ${jersey_number},
   ' ${role}');`;
        const team=await db.run(addUserQuery);
        res.status(200).json({message:`player added successfully with ${team.lastID}`});
  } catch (e) {
    console.log("/players",e.message);
    res.status(500).send("internal server error");
  }
});

// GET METHOD USING ID

app.get("/players/:id", async (req, res) => {
     const { id } = req.params;
     const getplayersQuery = `
      SELECT
      *
     FROM
    cricket_team
     WHERE
     player_id = ${id};`;
     const teamsArray = await db.all(getplayersQuery);
     res.send(teamsArray);
    });
    
    // PUT METHOD

    app.use(express.json())
    app.put("/players/:id",async(req,res)=>{
        const { id } = req.params;
      const {player_id,player_name,jersey_number,role}=req.body;
      console.log(req.body)
      try {
        const addUserQuery=`UPDATE cricket_team
         SET
         role= '${role}'
         WHERE 
         player_id=${id};`;
            const team=await db.run(addUserQuery);
            res.status(200).json({message:`player updated successfully with ${team.lastID}`});
      } catch (e) {
        console.log("/signup",e.message);
        res.status(500).send("internal server error");
      }
    });

    // DELETE METHOD

    
app.delete("/players/:id", async (req, res) => {
    const { id } = req.params;
     const deleteplayerQuery = `
     DELETE FROM
     cricket_team
    WHERE
     player_id = ${id};`;
     await db.run(deleteplayerQuery);
     res.send("player Deleted Successfully");
    });
    
 