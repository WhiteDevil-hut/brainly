import mongoose from 'mongoose'
const schema = mongoose.Schema;

const userschema = new schema({
  username:{type:String,unique:true,required:true},
  password:{type:String,required:true}
});

const tagschema = new schema({
  title:{type:String,required:true,unique:true }
});
const contentTypes=['image','video','article','audio'];

const contentschema =new schema({
  link: {type:String,required:true},
  type: {type:String,enum:contentTypes,required:true},
  title:{type:String,required:true },
  tags:[{ type:schema.Types.ObjectId,ref:'Tag'}],
  userId:{type:schema.Types.ObjectId,ref:'User',required:true}
});

const linkSchema=new schema({
  hash:{type:String,required:true },
  userId:{type:schema.Types.ObjectId,ref:'User',required:true}
});

module.exports = {
  User:mongoose.model('User',userschema),
  Tag:mongoose.model('Tag',tagschema),
  Content:mongoose.model('Content',contentschema),
  Link:mongoose.model('Link',linkSchema)
};
