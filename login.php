<?php

$id = $_POST['id'];

$usersJson = file_get_contents('users.json');

$users = json_decode($usersJson, true);

if($users[$id]){
    echo json_encode($users[$id]);
}
else{
    echo 'error';
}
