// CST3144 Coursework - Frontend

// Backend API base URL
const API_URL = 'http://localhost:8080';

// Vue instance
let webstore = new Vue({
    el: '#app',
    data: {
        sitename: 'After-School Lessons',
        lessons: [],
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
        // Fetch all lessons from the backend
        loadLessons: function () {
            fetch(`${API_URL}/lessons`)
                .then(response => response.json())
                .then(data => {
                    this.lessons = data;
                })
                .catch(error => {
                    console.error('Failed to load lessons:', error);
                });
        }
    }
});