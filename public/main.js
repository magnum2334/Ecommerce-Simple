let app = new Vue({
    el: '#app',
    delimiters: ['${', '}'],
    data: () => ({

        //show componets
        showProduct: true,
        showUsers: false,
        showOrdenes: false,
        showInactivos: false,
        //filters
        productAdminFilter: '',
        nameFilter: '',
        emailFilter: '',
        inactiveFitler: '',
        ordenesFilter: '',
        //cart
        cart: [],
        cartFilter: '',
        cardSelect: false,
        // orders for customers
        customerOrders: '',
        searchProduct: '',
        isLoggin: false,
        linkCustomer: '',
        searchInputProduct: '',
        changesSearch: false,
        category: {
            name: '',
            fields: ['name', 'actions'],
            perPage: 5,
            currentPage: 1,
            copy: [],
            categoryFilter: ''
        },
        product: {
            title: '',
            description: '',
            code: '',
            price: null,
            stock: null,
            status: null,
            category: null,
            fields: ['title', 'description', 'code', 'price', 'stock', 'category', 'status', 'photo', 'actions'],
            fieldsOrder: ['title', 'description', 'price', 'category'],
            products: [],
            perPage: 5,
            currentPage: 1,
            categories: [],
            existProducts: false,
            copy: [],
            productsActive: [],
            id: '',
            photo: '',
            photoNew: '',
            photoExists: false,

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
            customer_id: 0,
            user: '',
            perPage: 5,
            currentPage: 1,
        },
        order: {
            orders: [],
            perPage: 5,
            currentPage: 1,
        }

    }),

    async created() {
        this.categories()
        this.products()
        this.customers()
        this.orders()
    },
    mounted() {

        if (localStorage.getItem('customer') !== null) {
            this.customer.customer_id = JSON.parse(localStorage.getItem('customer'))
            this.customer.user = JSON.parse(localStorage.getItem('user'))
            this.linkCustomer = 'http://127.0.0.1:8000/dashboard/user/' + this.customer.customer_id
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
        rowsTableProducts() {
            return this.product.products.length
        },
        rowsTablecustomer() {
            return this.customer.customers.length
        },
        rowsTableOrder() {
            return this.order.orders.length
        },
        rowsTableCategories() {
            return this.product.categories.length
        }
    },

    methods: {
        hideText(typ) {
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
        onFileChange(event) {
            this.product.photo = event.target.files[0];
            this.product.photoExists = true;
        },
        async submitFormProduct() {
            let formData = new FormData();
            formData.append('title', this.product.title);
            formData.append('code', this.product.code);
            formData.append('description', this.product.description);
            formData.append('price', this.product.price);
            formData.append('stock', this.product.stock);
            formData.append('category_id', this.product.category);
            formData.append('status', true);
            formData.append('photo', this.product.photo);

            try {
                const response = await axios.post('http://127.0.0.1:8000/create/product', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Producto creado exitosamente',
                    text: `El producto con código ${response.data.code} ha sido creado con éxito.`,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });
                this.product.title = '';
                this.product.code = '';
                this.product.description = '';
                this.product.price = '';
                this.product.stock = '';
                this.product.category = '';
                this.product.photo = null;
                this.categories();
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
                this.category.name = '';
                this.categories();
                this.products();

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
            this.category.copy = [...categories.data]
            this.product.categories = [
                { value: null, text: 'Seleccione una categoría', disabled: true },
                ...categories.data.map(({ id, name }) => ({ value: id, text: name }))
            ];
        },
        async products() {
            const prducts = await axios.get('http://localhost:8000/products')
            this.product.existProducts = true
            this.product.products = prducts.data
            this.product.productsActive = this.product.products.filter(item => item.status === true)
                .map(item => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    code: item.code,
                    price: "$" + item.price.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }),
                    stock: item.stock,
                    status: item.status ? "Activo" : "Inavilitado",
                    category: item.category,
                    photo: item.photo,
                    actions: null
                }))
            this.product.copy = [...this.product.productsActive]
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
                let errorMessage = error.response.data.error || 'Hubo un error al intentar crear el la cuenta. Por favor, intenta de nuevo más tarde.';
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
                    localStorage.setItem('user', JSON.stringify(response.data.user))
                    setTimeout(() => {
                        window.location.href = 'http://127.0.0.1:8000/'
                    }, 2000);
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
            Swal.fire({
                icon: 'success',
                title: 'Se agrego al carrito',
                text: "Se agrega correctamente el producto al carrito",
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
            });
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
                    Swal.fire({
                        title: '¡Error!',
                        text: 'Ha ocurrido un error al crear la orden: ' + error.response.data.message,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                }
            }

        },
        cortarTexto(texto) {
            if (texto.length > 64) {
                return texto.substring(0, 61) + "...";
            } else {
                return texto;
            }
        },
        inputChangesSearch() {
            this.changesSearch = false
            setTimeout(() => {
                if (this.searchInputProduct == '') {
                    this.product.productsActive = this.product.copy
                } else {
                    console.log(this.product.productsActive)
                    this.product.productsActive = this.product.productsActive.filter(product => {
                        const title = product.title.toLowerCase();
                        const description = product.description.toLowerCase();
                        const category = product.category.toLowerCase();
                        
                        return title.includes(this.searchInputProduct.toLowerCase()) || description.includes(this.searchInputProduct.toLowerCase()) || category.includes(this.searchInputProduct.toLowerCase);
                    });
                }
                this.changesSearch = true;
            }, 1000);
            
        },
        async updateProduct(value) {
            let data = {
                id: value.item.id,
                title: value.item.title,
                description: value.item.description,
                code: value.item.code,
                stock: value.item.stock,
                price: value.item.price,
                status: value.item.status,
                category: value.item.category,
            }
            try {
                const response = await axios.post('http://127.0.0.1:8000/update/product', data);
                Swal.fire({
                    icon: 'success',
                    title: 'Producto se actualiza exitosamente',
                    text: `El producto con código ${response.data.code} ha sido actualizado con éxito.`,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });
                this.categories();
                this.products();
            } catch (error) {
                let errorMessage = error.response.data.error || 'Hubo un error al intentar actualizar el producto. Por favor, intenta de nuevo más tarde.';
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar el producto',
                    text: errorMessage,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });

            }
        },
        async updateCategory(value) {
            let data = {
                newName: value.item.name,
                categoryId: value.item.id,
            };

            try {
                const response = await axios.post('http://127.0.0.1:8000/update/category', data);
                Swal.fire({
                    icon: 'success',
                    title: 'Categoria se actuaiza exitosamente',
                    text: `La Categoria con el nombre:  ${response.data.name} ha sido actualizado con éxito.`,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });
                this.categories();
                this.products();

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
        infoModalUpdatePhoto(route , id) {
            this.product.photoNew = route
            this.product.id = id;
        },
        async updateProductPhoto() {
            let formData = new FormData();
            formData.append('id', this.product.id);
            formData.append('photo', this.product.photo);
            try {
                const response = await axios.post('http://127.0.0.1:8000/update/photo/product', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Producto actualizado ',
                    text: `la foto correctamente exitosamente`,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });
                this.product.photoNew = response.data.photo
                this.product.photo = '';
                this.product.photoExists = false;
                this.categories();
                this.products();
            } catch (error) {
                let errorMessage = error.response.data.error || 'Hubo un error al intentar actualizar el producto. Por favor, intenta de nuevo más tarde.';
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar el producto',
                    text: errorMessage,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });
            }
          
            this.product.photo = '';
            this.product.photoExists = false;
        },
        onHideModal(){
            this.product.photo = ''
        },
        onFileChangeUpdate(event){
            this.product.photo = event.target.files[0];
            this.product.photoExists = true;
        }
    },
})