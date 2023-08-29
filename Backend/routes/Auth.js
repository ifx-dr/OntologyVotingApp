//handle the authentication routes
const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const yaml = require('js-yaml');
const config = require('../../config');

// Access the secret key from the config
const secretKey = config.secretKey;


//Access user info in YAML file
const userDataPath = 'ledger_DR.yaml';
const userData = fs.readFileSync(userDataPath, 'utf8');
const usersData = yaml.load(userData);
const usersInfoData=usersData['UserInfo'];


let lastUserId = 4; //there are 4 members in the actual yaml file

const router = express.Router();

// Route to handle user login
router.post('/login', async (req, res) => {

  //hash passwords if their are not
  /* for (const user of usersInfoData) {
    if (!user.Password.startsWith('$2a$')) {
      user.Password = await bcrypt.hash(user.Password, 10);
    }
  }
  const updatedUserData = yaml.dump(usersInfoData);
  fs.writeFileSync(userDataPath, updatedUserData, 'utf8'); */ 

  const { useremail, password } = req.body;
  let result;
  let data={};
  // Check if the user exists
  const user = usersInfoData.find(u => u.Email === useremail);
  console.log(user);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Check the password
  const passwordMatch = await bcrypt.compare(password, user.Password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  data={
    ID:user.ID,
    Name:user.Name,
  }
  // Generate a JWT token and send it in the response
  const token = jwt.sign({ data },'secretKey');
  
  result={"success":data, "Token":token}
  console.log("successfully loggedin");
  console.log("result= "+JSON.stringify(result));
  res.status(200).json(result);
});

// Route to handle user registration
//could be needed in internal use
router.post('/register', async (req, res) => {
  const { username, userEmail, password } = req.body;

  // Check if the username is already taken
  const existingUser = usersInfoData.find(u => u.Email === useremail);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  // Hash the password before saving it to the database
  const hashedPassword = await bcrypt.hash(password, 10);
  lastUserId++;
  // Create a new user and save it to the database
  const newUser = {
    ID: lastUserId,
    Name: username,
    Password: hashedPassword,
    Email: userEmail,
    Tokens: 1000,
    Total_Proposal: 0,
    Total_Accepted_Proposal: 0,
    LastParticipation: null,
    LastParticipation_Internal: null,
    LobeOwner: [],
    Expert: []
  };

  usersInfoData.push(newUser);

  // Save the updated users array back to the YAML file
  const updatedUserData = yaml.dump(usersInfoData);
  fs.writeFileSync(userDataPath, updatedUserData, 'utf8');

  res.status(201).json({ message: 'User registered successfully' });
});

module.exports = router;