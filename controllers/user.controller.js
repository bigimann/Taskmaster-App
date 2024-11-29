const User = require('../model/User');
const jwt = require('jsonwebtoken');

// module.exports.create = async (req, res) => {
//     const { username, password, email } = req.body;
    
//     if (!username || !password || !email) {
//         return res.status(400).json({ error: 'All fields are required.' });
//     }

//     try {
//         const user = await User.create({ username, password, email });
//         res.status(201).json({ message: "User created successfully", user });
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//         console.log(err);
//     }
// };


module.exports.create = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const user = await User.create({ username, email, password });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    console.error('Error creating user:', err);

    // Handle duplicate email error
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    // Handle validation errors
    if (err.errors) {
      const validationErrors = Object.values(err.errors)
        .map((e) => e.message)
        .join(', ');
      return res.status(400).json({ error: validationErrors });
    }

    res.status(500).json({ error: 'Something went wrong.' });
  }
};


// module.exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.login(email, password);

//     // Generate a JWT token
//     const token = jwt.sign(
//       {
//         data: { id: user._id, email: user.email },
//       },
//       process.env.JWT_SECRET || 'poiuytrewqasdfghjklmnbvcxz',
//       { expiresIn: '24h' }
//     );

//     res.status(200).json({ user, token });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Call the User.login method
    const user = await User.login(email, password);

    // Generate a JWT token
    const token = jwt.sign(
      {
        data: { id: user._id, email: user.email },
      },
      process.env.JWT_SECRET || "poiuytrewqasdfghjklmnbvcxz",
      { expiresIn: "24h" }
    );

    res.status(200).json({ message: "Login successful", user, token });
  } catch (err) {
    // Return a friendly error message
    res.status(400).json({ error: "Invalid email or password" });
  }
};

module.exports.getAll = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
