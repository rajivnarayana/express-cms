import * as mongoose from 'mongoose';

let Schema = new mongoose.Schema({
  url: {
    type: String, required: [true, 'URL required to create page'],
  },
  title: {
    type: String
  },
  content: {
    type: String
  },
  published:{
      type:Boolean,
      default:false
  } 
}, {
  timestamps : true
});

export var PageSchema = mongoose.model('pages', Schema);