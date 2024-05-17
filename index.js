import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"

const app = express()
app.use(express.json()); 
dotenv.config()

const PORT = process.env.PORT || 7000
const MONGOURL = process.env.MONGO_URL

mongoose.connect(MONGOURL,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log("Mongodb connected successfully!")
    app.listen(PORT, ()=>{
        console.log(`Server is running on port http://localhost:${PORT}`)
    })
})
.catch((error) => {
    console.log(error)
})

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
})



const UserModel = mongoose.model("users", userSchema)

// GET API READ ONLY

app.get("/getUsers/", async (req, res) => {
    const userData = await UserModel.find()
    res.json(userData)
})

// CREATE API 

app.post("/getUsers/", async (req, res) => {
    try {
        const { name, age } = req.body;
        const newUser = new UserModel({ name, age });
        const savedUser = await newUser.save();
        console.log("User added successfully");
        res.status(201).json(savedUser);
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// UPDATE API 

app.put("/updateUser/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age } = req.body;

        const updatedUser = await UserModel.findByIdAndUpdate(id, { name, age }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        console.log("User updated successfully");
        res.json(updatedUser);
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE API 

app.delete("/deleteUser/:id", async (req, res) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: "User not found" });
        console.log("User deleted successfully");
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



