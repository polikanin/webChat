<?php


$json = file_get_contents('messages.json');

$jsonDecode = json_decode($json, true);
if(!$jsonDecode){
    $jsonDecode = array();
}


$jsonEncode = json_encode($jsonDecode);

file_put_contents('messages.json', $jsonEncode);
echo $jsonEncode;