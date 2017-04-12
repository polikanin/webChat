<?php

$jsonData = $_POST['jsonData'];

$jsonDataDecode = json_decode($jsonData, true);

$json = file_get_contents('messages.json');

$jsonDecode = json_decode($json, true);
if(!$jsonDecode){
    $jsonDecode = array();
}

array_push($jsonDecode, $jsonDataDecode);

$jsonEncode = json_encode($jsonDecode);

file_put_contents('messages.json', $jsonEncode);
echo $jsonEncode;