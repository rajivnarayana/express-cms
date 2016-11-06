import { PageSchema } from './pages-schema';
import { Document } from "mongoose";

export async function read(id) {
    return await PageSchema.findById(id);
}

export async function create(values) {
    return await PageSchema.create(values);
}

export async function update(id, values) {
    if (!values.published) {
        values.published = false;
    } else {
        values.published = values.published == "on";
    }
    
    return await PageSchema.findByIdAndUpdate(id, {$set : values}, {$new : true});
}

export async function list() : Promise<Document> {
    return await PageSchema.find();
}

export async function findBySlug(slug) {
    let pages = await PageSchema.find({url : slug, published : true});
    if (pages.length == 0) {
        return null;
    } else {
        return pages[0];
    }
}

export async function publish(id) {
    return await PageSchema.findByIdAndUpdate(id, {$set : { published : true }}, { $new : true });
}

export async function unpublish(id) {
    return await PageSchema.findByIdAndUpdate(id, {$set : { published : false }}, { $new : true });
}