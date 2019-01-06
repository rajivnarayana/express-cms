import { PageSchema } from './pages-schema';

export async function read(id) {
    return await PageSchema.findById(id).exec();
}

export async function create({published, ...rest}) {
    return await PageSchema.create({...rest, published : published == "on"});
}

export async function update(id, values) {
    if (!values.published) {
        values.published = false;
    } else {
        values.published = values.published == "on";
    }
    
    return await PageSchema.findByIdAndUpdate(id, {$set : values}, {new : true, runValidators: true});
}

export async function list() : Promise<any> {
    return await PageSchema.find().exec();
}

export async function findBySlug(slug): Promise<any> {
    let pages = await PageSchema.find({url : slug, published : true}).exec();
    if (pages.length == 0) {
        return null;
    } else {
        return pages[0];
    }
}

export async function publish(id) {
    return await PageSchema.findByIdAndUpdate(id, {$set : { published : true }}, { new : true });
}

export async function unpublish(id) {
    return await PageSchema.findByIdAndUpdate(id, {$set : { published : false }}, { new : true });
}