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
        cart: [],
        customerOrders: '',
        userVerified: false,
        cartFilter: '',
        cardSelect: false,
        isLoggin: false,
        linkCustomer: '',
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
            email: '',
            password: '',
            registerCheck: '',
            emailLogin: '',
            passwordLogin: '',
            registerCheck: '',
            customer_id: 0
        },
        order: {
            orders: [
            ]
        }

    }),

    async created() {
        this.categories()
        this.products()
        this.customers()
        this.orders()
        if (this.userVerified) {
            this.ordersUser()
        }
       
    },
    mounted() {
       
        if (localStorage.getItem('customer') !== null) {
            this.customer.customer_id = JSON.parse(localStorage.getItem('customer'))
            this.linkCustomer = 'http://127.0.0.1:8000/dashboard/user/' +  this.customer.customer_id
            this.isLoggin = true
        }
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
            } if (typ == 'Ordenes') {
                this.showOrdenes = true
                this.showUsers = false
                this.showProduct = false
                this.showInactivos = false
            } if (typ == 'Inactivos') {
                this.showOrdenes = false
                this.showUsers = false
                this.showProduct = false
                this.showInactivos = true
            }
        },
        cardFuction(typ) {
            if (typ == 'cart') {
                this.cardSelect = true
            } else {
                this.cardSelect = false
            }
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
                this.products();
            } catch (error) {
                let errorMessage = error.response.data.error || 'Hubo un error al intentar crear el producto. Por favor, intenta de nuevo más tarde.';
                Swal.fire({
                    icon: 'error',
                    title: 'Error al crear el producto',
                    text: errorMessage,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });
                this.created();
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
                this.categories();

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
        async categories() {
            const categories = await axios.get('http://localhost:8000/categories');
            this.product.categories = [
                { value: null, text: 'Seleccione una categoría', disabled: true },
                ...categories.data.map(({ id, name }) => ({ value: id, text: name }))
            ];
        },
        async products() {
            const prducts = await axios.get('http://localhost:8000/products')
            this.product.existProducts = true
            this.product.products = prducts.data
                .filter(item => item.status === true)
                .map(item => ({
                    id: item.id,
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
        },
        async customers() {
            const customer = await axios.get('http://localhost:8000/customers')
            this.customer.customers = customer.data
        },
        async orders() {
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
            this.order.orders = dara;
        },
        async submitFormCustomer() {
            let data = {
                fullname: this.customer.fullName,
                email: this.customer.email,
                password: this.customer.password,
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
                this.customers()
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
        },
        async submitFormLogin() {
            try {
                let data = {
                    email: this.customer.emailLogin,
                    password: this.customer.passwordLogin,
                };
                const response = await axios.post('http://127.0.0.1:8000/dashboard/user', data);
                Swal.fire({
                    icon: 'success',
                    title: 'inicio realizado con éxito',
                    text: "Se inicia correctamente en la cuenta",
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });
                if (this.customer.emailLogin == 'admin@admin.com' && this.customer.passwordLogin == 'error404') {
                    window.location.href = 'http://127.0.0.1:8000/dashboard'
                } else {
                    this.isLoggin = true
                    this.customer.customer_id = response.data.user.id
                    this.linkCustomer = 'http://127.0.0.1:8000/dashboard/user/' + response.data.user.id
                    localStorage.setItem('customer', response.data.user.id)
                }
            } catch (error) {
                let errorMessage = error.response.data.error || 'Hubo un error al intentar Ingresar, intenta de nuevo más tarde.';
                Swal.fire({
                    icon: 'error',
                    title: 'Error al crear la cuenta',
                    text: errorMessage,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });
            }
        },
        addToCart(productId) {
            this.cart.push(productId)
            localStorage.setItem('cart', JSON.stringify(this.cart))
        },
        
        ordersUser(email) {
            return this.customerOrders = this.order.orders.filter((order) => order.customerEmail == email)
        },
        async payload(card) {
            if (this.cart.length === 0) {
                await Swal.fire({
                    title: 'El carrito está vacío',
                    icon: 'error',
                    text: 'Agrega algunos productos antes de realizar una compra',
                });
            } else if (this.customer.customer_id === 0) {
                await Swal.fire({
                    title: 'No se ha iniciado sesión',
                    icon: 'warning',
                    text: 'Por favor, inicia sesión para crear una orden',
                });
            } else {
                try {
                    const order = {
                        customer_id: this.customer.customer_id = JSON.parse(localStorage.getItem('customer')),
                        order_date: new Date().toISOString().slice(0, 10),
                        order_details: []
                    };
                    this.cart.forEach((product) => {
                        const existingProductIndex = order.order_details.findIndex((orderProduct) => orderProduct.product_id === product.id);
                        if (existingProductIndex !== -1) {
                            order.order_details[existingProductIndex].quantity += 1;
                        } else {
                            order.order_details.push({
                                product_id: product.id,
                                quantity: 1
                            });
                        }
                    });

                    const response = await axios.post('http://localhost:8000/create/order', order);
                    if (response.data.message === 'The order was successfully created') {
                        // SweetAlert para orden creada con éxito
                        Swal.fire({
                            title: '¡Orden creada!',
                            text: 'La orden ha sido creada exitosamente',
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        });
                        this.cart = [];
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire({
                        title: '¡Error!',
                        text: 'Ha ocurrido un error al crear la orden: ' + error.response.data.message,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                }
            }

        }
    },
})