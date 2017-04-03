import * as mongoose from 'mongoose';

export const FORMATS = ['markdown', 'html'];

let Schema = new mongoose.Schema({
  url: {
    type: String, unique : true, required: [true, 'URL required to create page'],
  },
  format : {
    type: String, enum : FORMATS, default : FORMATS[0]
  },
  title: {
    type: String
  },
  content: {
    type: String, required : [true, 'Content required to create a page']
  },
  published:{
      type:Boolean,
      default:false
  } 
}, {
  timestamps : true
});

export var PageSchema = mongoose.model('pages', Schema);