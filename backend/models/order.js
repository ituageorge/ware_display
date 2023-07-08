const  mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    shippingInfo:{
        address: {
            type : String,
            required : true,
        },
        city: {
            type : String,
            required : true,
        },
        phoneNo: {
            type : String,
            required : true,
        },
        postalCode: {
            type : String,
            required : true,
        },
        country: {
            type : String,
            required : true,
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    orderItems: [
        {
            name: {
                type:String,
                required:true
                },
                quantity: {
                    type:Number,
                    default:1,
                    min:[0,"Quantity must be greater than zero"],
                    max:[256,"Quantity cannot exceed maximum limit"]
                    },
                    price: {
                        type: Number,
                        require: true,
                        validate(value) {
                            if (value <= 0){
                                throw new Error("Price should not be lesser or equal to Zero");
                                }
                                else{
                                    return value;
                                    }
                                    }
                                    },
                    image:{
                                        type:String,
                                        required:false,
                            },
                    product: {
                        type:mongoose.Schema.Types.ObjectId,
                        required: true,
                        ref:"Product"
                    }       



        }
    ],
    paymentMethod : {
        id : {
            type : String
        },
        status : {
            type : String
        },
        },
        isPaid :{type: Boolean},
        paidAt : {
            type: Date
        },
        itemsPrice: {
            type: Number,
            required:true,
            default: 0.0
        },
        taxPrice: {
            type: Number,
            required:true,
            default: 0.0
        },
        shippingPrice: {
            type: Number,
            required:true,
            default: 0.0
        },
        totalPrice: {
            type: Number,
            required:true,
            default: 0.0
        },
        orderStatus : {
            type :String,
            enum : ['created','paid','shipped', 'processing'],
            default:'Processing',
            required: true,

        },
        deliveredAt: {
            type:Date
        },
        createdAt: {
            type: Date,
            default: Date.now
        }

})

module.exports = mongoose.model('Order', orderSchema);
