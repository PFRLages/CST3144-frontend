// CST3144 Coursework - Frontend

// Backend API base URL
const API_URL = 'http://localhost:8080';

// Vue instance
let webstore = new Vue({
  el: '#app',
  data: {
    sitename: 'After-School Lessons',
    lessons: [],
    apiUrl: 'http://localhost:8080'
  },
  // Runs when Vue mounts to the page
  mounted: function () {
    this.loadLessons();
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