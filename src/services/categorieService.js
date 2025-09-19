const path = require('path');
const { Categories } = require('../models');

function toSlug(input) {
    return String(input || '')
        .toLowerCase()
        .normalize('NFD').replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function createCategorie(payload, file) {
    if (!payload?.name) {
        const e = new Error('Thiếu tên danh mục');
        e.status = 400; throw e;
    }
    const slug = payload.slug && payload.slug.trim() ? toSlug(payload.slug) : toSlug(payload.name);
    const image_url = file ? path.posix.join('/uploads', path.basename(file.path)) : null;
    const data = { name: payload.name, slug, description: payload.description || null, image_url, sort_order: payload.sort_order ? Number(payload.sort_order) : 0 };
    const categorie = await Categories.create(data);
    return categorie;
}

async function getCategories() {
    return Categories.findAll({ where: { isDelete: false }, order: [['sort_order', 'ASC'], ['id', 'ASC']] });
}

async function updateCategorie(id, payload, file) {
    const item = await Categories.findOne({ where: { id, isDelete: false } });
    if (!item) {
        const e = new Error('Danh mục không tồn tại');
        e.status = 404; throw e;
    }
    const next = { ...item.toJSON() };
    if (payload.name !== undefined) next.name = payload.name;
    if (payload.slug !== undefined) next.slug = payload.slug ? toSlug(payload.slug) : toSlug(next.name);
    if (payload.description !== undefined) next.description = payload.description;
    if (file) next.image_url = path.posix.join('/uploads', path.basename(file.path));
    if (payload.sort_order !== undefined) next.sort_order = Number(payload.sort_order) || 0;
    await Categories.update({ name: next.name, slug: next.slug, description: next.description, image_url: next.image_url, sort_order: next.sort_order }, { where: { id } });
    return await Categories.findOne({ where: { id } });
}

async function deleteCategorie(id) {
    const item = await Categories.findOne({ where: { id, isDelete: false } });
    if (!item) {
        const e = new Error('Danh mục không tồn tại');
        e.status = 404; throw e;
    }
    await Categories.update({ isDelete: true }, { where: { id } });
    return { success: true };
}

async function getCategorieById(id) {
    return Categories.findOne({ where: { id, isDelete: false } });
}

module.exports = { createCategorie, getCategories, updateCategorie, deleteCategorie, getCategorieById };