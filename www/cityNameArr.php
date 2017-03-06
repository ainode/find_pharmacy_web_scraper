<?php
$arr = array();
ini_set('max_execution_time', 600);

//iterate over all the cities of ontario
for($i = 1; $i < 9; $i++){
	$json = file_get_contents("myFile". $i .".json");
	$json = json_decode($json);
	getPharmacyNames($json, $arr);
}

//put all cities of ontario in an associative array
//as key so that there is no duplicate
function getPharmacyNames($json, &$arr){
	foreach($json as $pharmacy){		
		$city = $pharmacy -> city;
		$arr[$city] = null;
	}
}

$newJson = array();
$count = 0;
$destArr100 = array();
//$origins = array("Toronto+ON", "Ottawa+ON", "Thunder+Bay+ON", "Timmins+ON", "Windsor+ON", "Parry+Sound+ON", "Niagara+Falls+ON", "London+ON","Kingston+ON");
$origins = array("Kingston+ON", "London+ON", "Parry+Sound+ON");

foreach($origins as $origin){
	$cityEntry = array();	
	$destArr100[] = "Toronto";
	$destination = "Toronto+ON";
	foreach($arr as $city => $value){
		$destArr100[] = $city;
		$destCity = correctWhiteSpace($city);	
		$destination = $destination . "|" . $destCity . "+ON";
		$count++; 
		if($count == 99){
			constructDistanceJson($origin, $destination, $destArr100, $newJson, $cityEntry);
			$destination = "Toronto+ON";
			sleep(11);
			$count = 0;
			unset($destArr100);
			$destArr100[] = "Toronto";
			//break;
		}
		echo $city;
	}
	if($destination != ""){
			constructDistanceJson($origin, $destination, $destArr100, $newJson, $cityEntry);
			$count = 0;
			unset($destArr100);
	}		
	$cityArr[$origin] = $cityEntry;
	unset($cityEntry); 
}

function correctWhiteSpace($destCity){
	while(true){
		$whiteSpacePos = stripos($destCity, " ");
			if(!$whiteSpacePos){
				break;
			}
			else{	
				$destCity = substr($destCity, 0, $whiteSpacePos) ."+". substr($destCity, $whiteSpacePos + 1, strlen($destCity));
			}
		}
	return $destCity;
}

function constructDistanceJson(&$origin, &$processedDest, &$destArr100, &$newJson, &$cityEntry){
	$json = file_get_contents('https://maps.googleapis.com/maps/api/distancematrix/json?origins=' . $origin . '&destinations=' . $processedDest . '&mode=bicycling&language=fr-FR');
	$json = json_decode($json);
	$count = 0;
	var_dump ($json);
	foreach($json -> rows[0]->elements as $element){
		var_dump($element);
		$cityEntry[$destArr100[$count]] = substr($element->distance->value, 0, -3);
		$count++;		
	}
}
$cityArr = json_encode($cityArr);
$cities = json_decode($cityArr);
$cities = serialize($cities);
echo $cities;

//$cities = "hello new file";
$distances = "distance2.json"; 	
echo file_put_contents($distances, $cities);
//var_dump($arr);
//print_r(array_keys($arr));
$myjson = unserialize(file_get_contents('distance2.json'));
var_dump($myjson);
?>