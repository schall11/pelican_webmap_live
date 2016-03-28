<?php
$numdays = 7;
$td = time();
$td2 = $td * 1000;
$lw = ($td2 - ($numdays * 24 * 3600 * 1000));

$url='https://www.movebank.org/movebank/service/json-auth?&timestamp_start=' . $lw . '&study_id=113455474&sensor_type=gps';
$url2 = 'https://www.movebank.org/movebank/service/json-auth?&study_id=113455474&sensor_type=gps';

$user='UDWR-WCP-NRO';
$password='P3l3c@nus';
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_USERPWD, $user . ':' . $password);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
$data = curl_exec($ch);
curl_close($ch); 
$ch = curl_init($url2);
curl_setopt($ch, CURLOPT_USERPWD, $user . ':' . $password);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
$data2 = curl_exec($ch);
curl_close($ch); 
echo json_encode(array($data,$data2));
 ?>