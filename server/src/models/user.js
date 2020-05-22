const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        validate(val) {
            if (val < 0) {
                throw new Error('Not a valid age');
            }
        }
    },
    email: {
        type: String,
        required: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error('Invalid email');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(val) {
            if (validator.contains(val.toLowerCase(), 'password')) {
                throw new Error('Invalid password: Password can not contain "password"');
            }
        }
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
}
);

userSchema.methods.generateToken = async function () {
    const token = jwt.sign({ id: this._id.toString() }, 'mySecret');
    this.tokens.push({ token });
    this.save();
    return token;
};

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;

    return user;
}

userSchema.statics.findByCreds = async (name, password) => {
    const user = await User.findOne({ name });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
        throw new Error('Invalid name or password');
    }
    return user;
};
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;