const {Schema, default: mongoose} = require('mongoose')
const { isEmail } = require('validator')


const loginEmailSchema = new Schema({
    email: {
        type: String,
        validates: [isEmail, 'invalid email']
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