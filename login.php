<?php

// Retrieve values from the login form
$username = $_POST['username'];
$password = $_POST['password'];

$conn = new mysqli('localhost', 'root', '', 'login');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
    $stmt=$conn->prepare("insert into registration(username,password) values(?,?)");
    $stmt->bind_param("ss",$username,$password);
    $stmt->execute();
    echo"Logged In sucessfully.....";
    $stmt->close();
    $conn->close();
}
?>
