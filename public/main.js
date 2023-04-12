let app = new Vue({
    el: '#app',
    delimiters : ['${', '}'],
    data:{
        hola:'HELLO WORLD lllll'
    },

    mounted() {
        console.log('Holalalalal')
    },
    
    methods: {
        mor(){
            console.log('morrrr')
        }
    },
})