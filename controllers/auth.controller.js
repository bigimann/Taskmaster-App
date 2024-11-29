const User = require('../model/User')
const jwt = require('jsonwebtoken')


const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    // return jwt.sign({ id }, 'poiuytrewqasdfghjklmnbvcxz', {
    return jwt.sign({ id }, 'this is my secret', {
        expiresIn: maxAge
    })
}

module.exports.findUserByEmail = async (email) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  };


module.exports.create = async (req, res) => {
    const { firstName, sureName, email, password, currentClassId } = req.body;
    try {
        const newUser = new User({
            firstName,
            sureName,
            email,
            password,
            currentClassId: currentClassId,
            classHistory: [] // Initial class history is empty
        });

        await newUser.save();
        const token = createToken(newUser._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: newUser,  token})
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
}
module.exports.createAdmin = async (req, res) => {

    const { email, password} = req.body;
    try {
        const newUser = new Admin({
            email,
            password,
        });

        await newUser.save();
        const token = createToken(newUser._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: newUser,  token})
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
}
module.exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await Admin.login(email, password); 
      const token = jwt.sign(
        {
          data: {
            id: user.id,
            email: user.email,
          },
        },
        process.env.JWT_SECRET || 'poiuytrewqasdfghjklmnbvcxz',
        { expiresIn: '24h' }
      );
      res.status(200).json({ user, token });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };  
module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.login(email, password);
      const token = jwt.sign(
        {
          data: {
            id: user._id,
            email: user.email,
          },
        },
        process.env.JWT_SECRET || 'poiuytrewqasdfghjklmnbvcxz',
        { expiresIn: '24h' }
      );
      res.status(200).json({ user, token });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
module.exports.getAll = async (req, res) => {
    try {
        const user = await User.find();

        res.status(200).json({ users: user })
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
}

module.exports.getOne = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ error: 'user not found' });
        }
        res.status(200).json({ user: user })
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
}
module.exports.update = async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    try {
        const userExist = await User.findById(id);
        if (!userExist) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        const user = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        res.status(200).json({ user: user });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};
module.exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const userExist = await User.findById(id);
        if (!userExist) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};



