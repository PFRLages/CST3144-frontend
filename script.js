// CST3144 Coursework - Frontend

// Backend API base URL
const API_URL = 'http://localhost:8080';

// Vue instance
let webstore = new Vue({
    el: '#app',
    data: {
        sitename: 'After-School Lessons',
        lessons: [],
        cart: [],
        showCart: false,
        apiUrl: 'http://localhost:8080',
        sortAttribute: 'topic',
        sortOrder: 'asc',
        checkoutName: '',
        checkoutPhone: '',
        orderConfirmation: ''
    },
    // Runs when Vue mounts to the page
    mounted: function () {
        this.loadLessons();
    },
    computed: {
        sortedLessons: function () {
            let lessonsCopy = this.lessons.slice();

            lessonsCopy.sort((a, b) => {
                let valA = a[this.sortAttribute];
                let valB = b[this.sortAttribute];

                if (typeof valA === 'string') {
                    valA = valA.toLowerCase();
                    valB = valB.toLowerCase();
                }

                if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
                if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
                return 0;
            });

            return lessonsCopy;
        },

        // Name must contain only letters and spaces
        isValidName: function () {
            return /^[A-Za-z\s]+$/.test(this.checkoutName);
        },

        // Phone must contain only numbers
        isValidPhone: function () {
            return /^[0-9]+$/.test(this.checkoutPhone);
        },

        // Both must be valid before checkout is enabled
        canCheckout: function () {
            return this.isValidName && this.isValidPhone;
        }
    },
    methods: {
        loadLessons: function () {
            fetch(`${this.apiUrl}/lessons`)
                .then(response => response.json())
                .then(data => {
                    this.lessons = data;
                })
                .catch(error => {
                    console.error('Failed to load lessons:', error);
                });
        },

        addToCart: function (lesson) {
            if (lesson.space > 0) {
                this.cart.push(lesson);
                lesson.space--;
            }
        },

        toggleCart: function () {
            this.showCart = !this.showCart;
        },

        removeFromCart: function (index) {
            const lesson = this.cart[index];
            lesson.space++;
            this.cart.splice(index, 1);

            if (this.cart.length === 0) {
                this.showCart = false;
            }
        },

        // Submit the order - saves order and updates each lesson's space in the backend
        submitOrder: function () {
            // Build the order object with lessonIDs (all _ids in the cart)
            const order = {
                name: this.checkoutName,
                phone: this.checkoutPhone,
                lessonIDs: this.cart.map(lesson => lesson._id),
                spaces: this.cart.length
            };

            // POST the order to the backend
            fetch(`${this.apiUrl}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // PUT updated space for each unique lesson in the cart
                        this.cart.forEach(lesson => {
                            fetch(`${this.apiUrl}/lessons/${lesson._id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ space: lesson.space })
                            });
                        });

                        // Confirmation message + reset form and cart
                        this.orderConfirmation = `Order submitted successfully for ${this.checkoutName}!`;
                        this.cart = [];
                        this.checkoutName = '';
                        this.checkoutPhone = '';
                        this.showCart = false;
                    } else {
                        this.orderConfirmation = 'Failed to submit order. Please try again.';
                    }
                })
                .catch(error => {
                    console.error('Order submission failed:', error);
                    this.orderConfirmation = 'Error submitting order.';
                });
        }
    }
});