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
        sortOrder: 'asc'
    },
    // Runs when Vue mounts to the page
    mounted: function () {
        this.loadLessons();
    },
    computed: {
        // Returns the lessons sorted by the chosen attribute and order
        sortedLessons: function () {
            // Make a copy so we don't mutate the original array
            let lessonsCopy = this.lessons.slice();

            lessonsCopy.sort((a, b) => {
                let valA = a[this.sortAttribute];
                let valB = b[this.sortAttribute];

                // Compare text fields case-insensitively
                if (typeof valA === 'string') {
                    valA = valA.toLowerCase();
                    valB = valB.toLowerCase();
                }

                if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
                if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
                return 0;
            });

            return lessonsCopy;
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

        // Toggle between the lessons page and the cart page
        toggleCart: function () {
            this.showCart = !this.showCart;
        },

        // Remove a lesson from the cart and return the space back to the lesson
        removeFromCart: function (index) {
            const lesson = this.cart[index];
            lesson.space++;
            this.cart.splice(index, 1);

            // If the cart is now empty, go back to the lessons page
            if (this.cart.length === 0) {
                this.showCart = false;
            }
        }
    }
});