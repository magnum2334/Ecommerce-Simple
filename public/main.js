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
        totalpriceCart: '',
        cartFilter: '',
        cardSelect: false,
        // orders for customers
        customerOrders: '',
        searchProduct: '',
        isLoggin: false,
        linkCustomer: '',
        searchInputProduct: '',
        changesSearch: true,
        category: {
            name: '',
            fields: ['name', 'actions'],
            perPage: 5,
            currentPage: 1,
            copy: [],
            categoryFilter: ''
        },
        spinnerProduct: true,
        product: {
            title: '',
            description: '',
            code: '',
            price: null,
            stock: null,
            status: null,
            category: null,
            fields: ['title', 'description', 'code', 'price', 'stock', 'category', 'status', 'photo', 'actions'],
            fieldsOrder: ['title', 'description', 'price', 'quantity', 'total', 'category'],
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
            select: {
                title: '',
                description: '',
                code: '',
                price: null,
                stock: null,
                category: null,
                selected: 1
            }
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
        // let user = JSON.parse(localStorage.getItem('user'))
        // if(localStorage.getItem('user') != []){
        //     let email = user.email
        //     console.log(email)
        //     const orders = await axios.get('http://localhost:8000/orders')

        //     const dara = Object.values(orders.data.reduce((acc, item) => {
        //         if (!acc[item.orden_id]) {
        //             acc[item.orden_id] = {
        //                 orden_id: item.orden_id,
        //                 customerName: item.fullname,
        //                 customerEmail: item.email,
        //                 orderDate: new Date().toISOString().split('T')[0], // Set to today's date
        //                 products: [],
        //                 total: item.total,
        //             };
        //         }

        //         acc[item.orden_id].products.push({
        //             productId: item.product_id,
        //             productName: item.title,
        //             quantity: item.quantity,
        //             price: JSON.stringify(item.price)  + ',000'
        //         });

        //         return acc;
        //     }, {}));
        //     console.log()
        //     this.order.orders = dara;

        // }
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
                this.spinnerProduct = false;
                setTimeout(() => {
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
       
                    this.spinnerProduct = true;
                }, 4000);
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
                        total: item.total,
                    };
                }

                acc[item.orden_id].products.push({
                    productId: item.product_id,
                    productName: item.title,
                    quantity: item.quantity,
                    price: JSON.stringify(item.price)  + ',000'
                });

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
                    window.location.href = 'http://127.0.0.1:8000/dashboard/'
                } else {
                    this.isLoggin = true
                    this.customer.customer_id = response.data.user.id
                    this.linkCustomer = 'http://127.0.0.1:8000/dashboard/user/' + response.data.user.id
                    localStorage.setItem('customer', response.data.user.id)
                    localStorage.setItem('user', JSON.stringify(response.data.user))
                    setTimeout(() => {
                        window.location.href = 'http://127.0.0.1:8000/'
                    }, 1000);
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
        addToCart() {

        },
        SelectProduct(product) {
            this.product.select = ''
            this.product.select = product
            this.product.select = {
                product_id: product.id,
                title: product.title,
                description: product.description,
                code: product.code,
                price: product.price,
                stock: product.stock,
                category: product.category.name,
                photo: product.photo,
                selected: 1
            }
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
                    this.cart = this.cart.map(item => {
                        return {
                            product_id: item.product_id,
                            quantity: item.selected,
                        };
                    });
                    const order = {
                        customer_id: this.customer.customer_id = JSON.parse(localStorage.getItem('customer')),
                        order_date: new Date().toISOString().slice(0, 10),
                        order_details: this.cart,
                        total_price: this.totalpriceCart
                    };

                    const response = await axios.post('http://localhost:8000/create/order', order);
                    if (response.data.message === 'La orden ha sido creada exitosamente' ||response.data.message ===  'The order was successfully created') {
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
                    this.product.productsActive = this.product.productsActive.filter(product => {
                        const title = product.title.toLowerCase();
                        const description = product.description.toLowerCase();
                        const category = product.category.name.toLowerCase();
                        return title.includes(this.searchInputProduct.toLowerCase()) || description.includes(this.searchInputProduct.toLowerCase()) || category.includes(this.searchInputProduct.toLowerCase());
                    });
                }
                this.changesSearch = true;
            }, 500);

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
        infoModalUpdatePhoto(route, id) {
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
        onHideModal() {
            this.product.photo = ''
        },
        onFileChangeUpdate(event) {
            this.product.photo = event.target.files[0];
            this.product.photoExists = true;
        },
        increaseProduct() {
            if (this.product.select.selected < this.product.select.stock) {
                this.product.select.selected++;
            }
        },
        decreaseProduct() {
            if (this.product.select.selected > 1) {
                this.product.select.selected--;
            } else {
                this.product.select.selected = 1;
            }
        },
        handleOk() {
            const index = this.cart.findIndex(item => item.title === this.product.select.title);
            if (index >= 0) {
                const item = this.cart[index];
                if (item.selected == item.stock) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No se al agregar al carrito',
                        text: 'No se puede agregar el producto al carrito no existen stock',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Aceptar'
                    });
                }
                if (item.selected < item.stock) {

                    if (item.selected + this.product.select.selected > item.stock) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Error al agregar al carrito',
                            text: 'No se puede agregar el producto al carrito no existen sufiencientes stock',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Aceptar'
                        });
                    } else {
                        item.selected = item.selected + this.product.select.selected;
                        Swal.fire({
                            icon: 'success',
                            title: 'Se agrego al carrito',
                            text: "Se agrega correctamente el producto al carrito",
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Aceptar'
                        });

                    }

                }

            } else {
                this.cart.push(this.product.select);
                setTimeout(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Se agrego al carrito',
                        text: "Se agrega correctamente el producto al carrito",
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Aceptar'
                    });
                }, 500);
            }
            this.$nextTick(() => {
                this.$bvModal.hide('modal-prevent-closing')
            })
            localStorage.setItem('cart', JSON.stringify(this.cart))

        },
        totalPrice(price, quantity) {
            const numericPrice = parseFloat(price.replace(/[$,.]/g, ''));
            const total = numericPrice * quantity;
            const formattedTotal = '$' + total.toLocaleString();
            console.log(formattedTotal);
            return formattedTotal;
        },
        footRowClass(rowData, rowIndex) {
            if (rowIndex === this.cart.length) {
                return 'd-none';
            }
        },
        totalCart() {

            const total = this.cart.reduce((acc, item) => {
                const numericPrice = parseFloat(item.price.replace(/[$,.]/g, ''));
                return acc + numericPrice * item.selected;
            }, 0);
            this.totalpriceCart = '$' + total.toLocaleString();
            return '$' + total.toLocaleString();

        },
        cerrar(){
            window.location.reload ()
            localStorage.clear()
        }

    },
})