<?php
// Assuming you have a database connection
$servername = "your_server_name";
$username = "your_username";
$password = "your_password";
$dbname = "your_database_name";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieve values from the login form
$username = $_POST['username'];
$password = $_POST['password'];

// Hash the entered password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Check if the username exists in the database
$sql = "SELECT * FROM users WHERE username = '$username'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Username exists, now check the password
    $row = $result->fetch_assoc();
    if (password_verify($password, $row['password'])) {
        // Passwords match, login successful
        echo "Login successful!";
    } else {
        // Passwords do not match, login failed
        echo "Invalid password!";
    }
} else {
    // Username does not exist, login failed
    echo "Invalid username!";
}

$conn->close();
?>
