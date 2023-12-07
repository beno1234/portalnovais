export const FIELDS = {
    user: [
        {
            label: "Nome",
            property: "name",
            classes: "bold"
        },
        {
            label: "CPF",
            property: "document"
        },
        {
            label: "E-mail",
            property: "email"
        },
        {
            label: "Telefone",
            property: "phone"
        },
        {
            label: "Role",
            property: "role"
        }
        /* {
            label: "Status",
            property: "active",
            type: "boolean"
        }, */
    ],
    advertisement: [
        {
            label: "Nome",
            property: "name",
            classes: "bold"
        },
        {
            label: "E-mail",
            property: "email"
        },
        {
            label: "WhatsApp",
            property: "whatsapp"
        },
        {
            label: "Visualizações",
            property: "views"
        },
        {
            label: "Avaliação",
            property: "rating"
        },
        {
            label: "Likes",
            property: "likes"
        },
        {
            label: "Status",
            property: "status"
        },
    ],
    category: [
        {
            label: "Nome",
            property: "name",
            classes: "bold"
        },
        {
            label: "Quantidade máxima de envios por cotação",
            property: "maxQuotes"
        }
    ],
    articleCategory: [
        {
            label: "Nome",
            property: "name",
            classes: "bold"
        }
    ],
    subCategory: [
        {
            label: "Nome",
            property: "name",
            classes: "bold"
        },
        {
            label: "Categoria pai",
            property: "parentCategory"
        }
    ],
    location: [
        {
            label: "Nome",
            property: "name",
            classes: "bold"
        },
        {
            label: "Posição",
            property: "position"
        }
    ],
    quotation: [
        {
            label: "Título",
            property: "title",
            classes: "bold"
        },
        {
            label: "Publicado em",
            property: "publishedAt"
        },
        {
            label: "Respondido",
            property: "status"
        }
    ],
    article: [
        {
            label: "Título",
            property: "title",
            classes: "bold"
        },
        {
            label: "Visualizações",
            property: "views"
        }
    ],
    banner: [
        {
            label: "Título",
            property: "name",
            classes: "bold"
        },
        {
            label: "Link ao clicar",
            property: "site"
        }
    ]
};

export default FIELDS;