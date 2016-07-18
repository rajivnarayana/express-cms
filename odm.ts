import { PageSchema } from './pages-schema';
import { Document } from "mongoose";

export async function read(id) {
    return await PageSchema.findById(id);
}

export async function create(values) {
    return await PageSchema.create(values);
}

export async function update(id, values) {
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