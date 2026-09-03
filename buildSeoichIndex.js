
function buildSearchIndex(data) {
    return [
        ...data.tourism.map(item => ({
            ...item,
            type: "Tourism"
        })),

        ...data.businesses.map(item => ({
            ...item,
            type: "Business"
        })),

        ...data.products.map(item => ({
            ...item,
            type: "Product"
        })),

        ...data.projects.map(item => ({
            ...item,
            type: "Project"
        })),

        ...data.portfolio.map(item => ({
            ...item,
            type: "Portfolio"
        }))
    ];
}
