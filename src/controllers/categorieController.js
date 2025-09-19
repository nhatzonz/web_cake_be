const categorieService = require('../services/categorieService');

async function createCategorie(req, res) {
    try {
        const categorie = await categorieService.createCategorie(req.body, req.file);
        return res.status(201).json(categorie);
    } catch (e) {
        return res.status(e.status || 500).json({ message: e.message || 'Lỗi server' });
    }
}

async function getCategories(req, res) {
    try {
        const categories = await categorieService.getCategories();
        return res.status(200).json(categories);
    } catch (e) {
        return res.status(500).json({ message: 'Lỗi server' });
    }
}

async function updateCategorie(req, res) {
    try {
        const categorie = await categorieService.updateCategorie(req.params.id, req.body, req.file);
        return res.status(200).json(categorie);
    } catch (e) {
        return res.status(e.status || 500).json({ message: e.message || 'Lỗi server' });
    }
}

async function deleteCategorie(req, res) {
    try {
        const categorie = await categorieService.deleteCategorie(req.params.id);
        return res.status(200).json(categorie);
    } catch (e) {
        return res.status(e.status || 500).json({ message: e.message || 'Lỗi server' });
    }
}

async function getCategorieById(req, res) {
    try {
        const categorie = await categorieService.getCategorieById(req.params.id);
        if (!categorie) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        return res.status(200).json(categorie);
    } catch (e) {
        return res.status(500).json({ message: 'Lỗi server' });
    }
}

module.exports = {
    createCategorie,
    getCategories,
    updateCategorie,
    deleteCategorie,
    getCategorieById,
};