let app = new Vue({
    el: '#app',
    delimiters: ['${', '}'],
    data: () => ({
        showProduct: true,
        showUsers: false,
        showOrdenes: false,
        showInactivos: false,
        titleFilter: '',
        categoryFilter: '',
        codeFilter: '',
        nameFilter: '',
        emailFilter: '',
        inactiveFitler: '',
        ordenesFilter: '',
        category: {
            name: ''
        },
        product: {
            title: '',
            description: '',
            code: '',
            price: null,
            stock: null,
            status: null,
            category: null,
            fields: ['title', 'description', 'code', 'price', 'stock', 'category', 'status'],
            products: [],
            inactiveProducts: [],
            categories: [],
            existProducts: false

        },
        customer: {
            fields: ['fullname', 'email', 'status'],
            customers: [],
            fullName: '',
            email: '' ,
            password: '',
            registerCheck: ''

        },
        order: {
            orders: [

            ]

        }
    }),
    async created() {

        const customer = await axios.get('http://localhost:8000/customers')
        this.customer.customers = customer.data


        const categories = await axios.get('http://localhost:8000/categories');
        this.product.categories = [
            { value: null, text: 'Seleccione una categoría', disabled: true },
            ...categories.data.map(({ id, name }) => ({ value: id, text: name }))
        ];

        const prducts = await axios.get('http://localhost:8000/products')
        this.product.existProducts = true
        this.product.products = prducts.data
            .filter(item => item.status === true)
            .map(item => ({
                title: item.title,
                description: item.description,
                code: item.code,
                price: "$" + item.price,
                stock: item.stock,
                status: item.status ? "available" : "not available",
                category: item.category,
                actions: null
            }))

        this.product.inactiveProducts = prducts.data
            .filter(item => item.status === false)
            .map(item => ({
                title: item.title,
                description: item.description,
                code: item.code,
                price: item.price,
                stock: item.stock,
                status: item.status ? "available" : "not available",
                category: item.category,
                actions: null
            }))
        const orders = await axios.get('http://localhost:8000/orders')

        const dara = Object.values(orders.data.reduce((acc, item) => {
            if (!acc[item.orden_id]) {
                acc[item.orden_id] = {
                    orden_id: item.orden_id,
                    customerName: item.fullname,
                    customerEmail: item.email,
                    orderDate: new Date().toISOString().split('T')[0], // Set to today's date
                    products: [],
                    total: 0,
                    status: 'Pending'
                };
            }

            acc[item.orden_id].products.push({
                productId: item.product_id,
                productName: item.code,
                quantity: item.quantity,
                price: item.unitPrice
            });

            acc[item.orden_id].total += item.unitPrice * item.quantity;

            return acc;
        }, {}));
        console.log(dara)
        this.order.orders = dara;
    },
    mounted() {

    },
    computed: {
        filteredProducts() {
            return this.product.products.filter((product) => {
                let titleFilter = product.title.toLowerCase().includes(this.titleFilter.toLowerCase());
                let categoryFilter = product.category.name.toLowerCase().includes(this.categoryFilter.toLowerCase());
                let codeFilter = product.code.toLowerCase().includes(this.codeFilter.toLowerCase());
                return titleFilter && categoryFilter && codeFilter;
            })
        },
    },

    methods: {
        hideText(typ) {
            console.log(typ)
            if (typ == 'Productos') {
                this.showProduct = true
                this.showUsers = false
                this.showOrdenes = false
                this.showInactivos = false
            } if (typ == 'Usuarios') {
                this.showUsers = true
                this.showProduct = false
                this.showOrdenes = false
                this.showInactivos = false
            }  if (typ == 'Ordenes') {
                this.showOrdenes = true
                this.showUsers = false
                this.showProduct = false
                this.showInactivos = false
            } if(typ == 'Inactivos') {
                this.showOrdenes = false
                this.showUsers = false
                this.showProduct = false
                this.showInactivos = true
            }
            console.log(this.showProduct)
        },
        async submitFormProduct() {
            let data = {
                title: this.product.title,
                code: this.product.code,
                description: this.product.description,
                price: this.product.price,
                stock: this.product.stock,
                category_id: this.product.category,
                status: true,
            };

            try {
                const response = await axios.post('http://127.0.0.1:8000/create/product', data);
                Swal.fire({
                    icon: 'success',
                    title: 'Producto creado exitosamente',
                    text: `El producto con código ${response.data.code} ha sido creado con éxito.`,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });
            } catch (error) {
                let errorMessage = error.response.data.error || 'Hubo un error al intentar crear el producto. Por favor, intenta de nuevo más tarde.';
                Swal.fire({
                    icon: 'error',
                    title: 'Error al crear el producto',
                    text: errorMessage,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });
            }
        },
        async submitFormCategory() {
            let data = {
                name: this.category.name,
            };

            try {
                const response = await axios.post('http://127.0.0.1:8000/create/category', data);
                Swal.fire({
                    icon: 'success',
                    title: 'Categoria creada exitosamente',
                    text: `La Categoria con el nombre:  ${response.data.name} ha sido creado con éxito.`,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });
            } catch (error) {
                let errorMessage = error.response.data.error || 'Hubo un error al intentar crear el producto. Por favor, intenta de nuevo más tarde.';
                Swal.fire({
                    icon: 'error',
                    title: 'Error al crear el la categoria',
                    text: errorMessage,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });
            }
        },
        async submitFormCustomer() {
            let data = {
                fullname: this.customer.fullName,
                email: this.customer.email,
                password: this.customer.fullName,
            };

            try {
                const response = await axios.post('http://127.0.0.1:8000/create/customer', data);
                Swal.fire({
                    icon: 'success',
                    title: 'registro realizado con éxito',
                    text: "ya puedes iniciar en la cuenta ",
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });
            } catch (error) {
                let errorMessage = error.response.data.error || 'Hubo un error al intentar crear el producto. Por favor, intenta de nuevo más tarde.';
                Swal.fire({
                    icon: 'error',
                    title: 'Error al crear la cuenta',
                    text: errorMessage,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });
            }
        }
    },
})