const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); //used to parse and handle cookies in the incoming HTTP requests //with the help of chatgpt : how to add anonymous users?
const crypto = require('crypto'); //provides cryptographic functionalities such as hashing, encryption, and decryption //with the help of chatgpt : how to add anonymous users?
const {timePosted}= require('./time.js'); // Adjust the path as per your file structure

const app = express();

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'c237_forumapp'
});

connection.connect(error => {
    if (error) {
        console.error('Error connecting to MySQL:', error);
        return;
    }
    console.log('Connected to MySQL database');
});

// Set up view engine
app.set('view engine', 'ejs');

// Enable static files
app.use(express.static('public'));

//enable form processing
app.use(bodyParser.urlencoded({
    extended: true
}));

//enable cookie processing //with the help of chatgpt : how to add anonymous users?
app.use(cookieParser());

app.use((req, res, next) => {
    if (!req.cookies.userId) {
        const userId = crypto.randomBytes(16).toString('hex');
        res.cookie('userId', userId, { maxAge: 900000, httpOnly: true });
    }
    next();
});

//C - post form (meant for data entry)
app.get('/addPost', (req, res) => {
    res.render('addPost');
    //res.send("Add post form");
});


//C - process form (meant for processing data)
app.post('/addPost', (req, res) => {
    //Extract product data from the request body
    const {name, details } = req.body;
    const userId = req.cookies.userId; //get userId from cookies
    const sql = 'INSERT INTO posts (postName, postDetails, userId, created_at) VALUES (?, ?, ?, NOW())';
    //Insert the new product into the database
    connection.query(sql, [name, details, userId], (error, results) => {
        if (error) {
            //Handle any error that occurs during the database operation
            console.error('Error adding post:', error);
            return res.status(500).send('Error adding post');
        } else {
            //Send a success response if the operation was successful
            res.redirect('/');
        }
    });
});

//C - comments form (meant for data entry)
app.get('/addComment/:postId', (req, res) => {
    const postId = req.params.postId;
    res.render('addComment', { postId });
});


//C - process form (meant for processing data)
app.post('/addComment/:postId', (req, res) => {
    const postId = req.params.postId;
    const commentDetails = req.body.commentDetails; 
    const userId = req.cookies.userId;
    const sql = 'INSERT INTO comments (commentDetails, postId, userId, datePublished) VALUES (?, ?, ?, NOW())';

    connection.query(sql, [commentDetails, postId, userId], (error, results) => {
        if (error) {
            console.error('Error adding comment:', error);
            return res.status(500).send('Error adding comment');
        } else {
            res.redirect(`/`);
        }
    });
});

//R - get all items (home page)
app.get('/', (req, res) => {
    const query = `
        SELECT p.postId, p.postName, p.postDetails, p.created_at,
               c.commentId, c.commentDetails, c.datePublished as commentCreatedAt
        FROM posts p
        LEFT JOIN comments c ON p.postId = c.postId
        ORDER BY p.created_at DESC, c.datePublished ASC
    `;

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching data:', error);
            res.status(500).send('Error fetching data');
            return;
        }

        // Grouping the comments by postId for rendering //with the help of chatgpt : how to group comments by postId?
        const posts = results.reduce((acc, row) => {  // Reduce the results into an object
            const postId = row.postId;
            if (!acc[postId]) {     //Checks if there is no entry for the current postId in acc. If not, create a new entry.
                acc[postId] = {     //acc starts as an empty object {} and gradually accumulates data.
                    postId: postId,
                    postName: row.postName, //For each row in results, which represents a row from database query result:
                    postDetails: row.postDetails,
                    created_at: row.created_at,
                    comments: []
                };
            }
            if (row.commentId) { //Checks if the current row has a commentId. If it does, add the comment to the comments array.
                acc[postId].comments.push({ //Pushes an object { commentId: row.commentId, commentDetails: row.commentDetails, comment: row.commentCreatedAt } 
                    commentId: row.commentId,                                    //into the comments array of the corresponding post in acc.
                    commentDetails: row.commentDetails,          //This structure allows grouping comments by their associated postId.
                    datePublished: row.commentCreatedAt });       //The final result is an object with postId as keys and post data as values.
            }
            return acc;
        }, {});

        res.render('index', { posts: Object.values(posts), timePosted }); // Pass posts data to the index.ejs template
    });
});

//R - About Us Page
app.get('/aboutUs', (req, res) => {
    res.render('aboutUs');
});

//R - Login Page
app.get('/login', (req, res) => {
    res.render('login');
});

//U - Process login form
app.post('/login', (req, res) => {
    // Extract post data from the request body
    const { username, password } = req.body;

    const sql = 'SELECT userId FROM users WHERE username=? AND password=?;';
    connection.query(sql, [username, password], (error, results) => {
        if (error) {
            //Handle any error that occurs during the database operation
            console.error('Error logging in:', error);
            res.status(500).send('Error logging in');
        } else {
            // Update the userID if its valid
            if (results.length == 0) {
                return res.status(404).send('Username and/or Password is incorrect!')
            }

            //Send a success response if the operation was successful
            res.cookie('userId', results[0].userId)
            res.redirect('/');
        }
    });
});

//G - Register Page
app.get('/register', (req, res) => {
    res.render('register');
});


//C - Process register form
app.post('/register', (req, res) => {
    // Extract post data from the request body
    const { username, password } = req.body;

    const sql = 'INSERT INTO users (username, password) VALUES (?, ?);';
    connection.query(sql, [username, password], (error, results) => {
        if (error) {
            //Handle any error that occurs during the database operation
            console.error('Error registering:', error);
            res.status(500).send('Error registering');
        } else {
            res.cookie('userId', results.insertId)

            //Send a success response if the operation was successful
            res.redirect('/');
        }
    });
});

//U - display form (meant for data entry)
app.get('/editPost/:id', (req, res) => {
    const postId = req.params.id;
    const userId = req.cookies.userId;
    const sql = 'SELECT * FROM posts WHERE postId = ? AND userId = ?';
    // Fetch data from MySQL based on the post ID
    connection.query(sql, [postId, userId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving post by ID');
        }
        //Check if any post with the given ID was found
        if (results.length > 0) {
            // Render HTML page with the given ID was found
            res.render('editPost', { post: results[0] });
        } else {
            //If no post with the given ID was found, render a 404 page or handle it accordingly
            res.status(404).send('Post not found');
        }
    });
});

//U - process form (meant for processing data)
app.post('/editPost/:id', (req, res) => {
    const userId = req.cookies.userId;
    const postId = req.params.id;
    // Extract post data from the request body
    const { postName, postDetails } = req.body;

    const sql = 'UPDATE posts SET postName = ?, postDetails = ? WHERE postId = ? AND userId = ?';
    connection.query(sql, [postName, postDetails, postId, userId], (error, results) => {
    // Update the post in the database
        if (error) {
            //Handle any error that occurs during the database operation
            console.error('Error updating post:', error);
            res.status(500).send('Error updating post');
        } else {
            //Send a success response if the operation was successful
            res.redirect('/');
        }
    });
});

//D - delete post by id (display)
app.post('/deletePost/:id', (req, res) => {
    const userId = req.cookies.userId;
    const postId = req.params.id;
    const sql = 'DELETE FROM posts WHERE postId = ? AND userId = ?';
    // Delete the post from the database
    connection.query(sql, [postId, userId], (error, results) => {
        if (error) {
            //Handle any error that occurs during the database operation
            console.error('Error deleting post:', error);
            res.status(500).send('Error deleting post');
        } else {
            if (results.affectedRows == 0) {
                return res.status(403).send('You do not have access to delete this post.')
            }

            //Send a success response if the operation was successful
            res.redirect('/');
        }
    });
});


const PORT = process.env.PORT || 3090;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
