import mongoose,{Schema} from 'mongoose'
mongoose.connect("mongodb+srv://admin:admin%40123@cluster0.lws1p14.mongodb.net/brainly")
const userschema = new Schema({
  username:{type:String,unique:true,required:true},
  password:{type:String,required:true}
});

const tagschema = new Schema({
  title:{type:String,required:true,unique:true }
});
const contentTypes=['image','video','article','audio'];

const contentschema =new Schema({
  link: {type:String,required:true},
  type: {type:String,enum:contentTypes,required:true},
  title:{type:String,required:true },
  tags:[{ type:Schema.Types.ObjectId,ref:'Tag'}],
  userId:{type:Schema.Types.ObjectId,ref:'User',required:true}
});

const linkschema=new Schema({
  hash:{type:String,required:true },
  userId:{type:Schema.Types.ObjectId,ref:'User',required:true,unique:true}
});

export const UserModel=mongoose.model('User',userschema);
export const TagModel=mongoose.model('Tag',tagschema);
export const ContentModel=mongoose.model('Content',contentschema);
export const LinkModel=mongoose.model('Link',linkschema);

