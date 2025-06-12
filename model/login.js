const {Schema, default: mongoose} = require('mongoose')
const { isEmail } = require('validator')


const loginEmailSchema = new Schema({
    email: {
        type: String,
        validates: [isEmail, 'invalid email']
    },
    password: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    code: {
        type: String
    }

},
{timestamps: true}
)

const Login = mongoose.model('emailLogin', loginEmailSchema)

module.exports = Login
