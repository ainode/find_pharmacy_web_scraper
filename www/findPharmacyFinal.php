<html><head></head><body><a href="index.php">Go back to begin</a>
<?php
$city = $_POST["city"];
$radius = $_POST["radius"];
$age = $_POST["age"];
$thisYear = date("Y");//echo($thisYear);
$origin = $city . "+ON";
$count = 0;
$citiesArr = array();
$citiesArr[$city] = 0;

$distanceJson = unserialize(file_get_contents('distance2.json'));
makeCityArr($distanceJson, $origin, $radius, $citiesArr);
//var_dump($myjson);
$distanceJson = unserialize(file_get_contents('distance1.json'));
makeCityArr($distanceJson, $origin, $radius, $citiesArr);

function makeCityArr(&$distanceJson, &$origin, &$radius, &$citiesArr){
	foreach($distanceJson as $start=>$destination){
		if($start == $origin && $radius != ""){//echo "Start::::::::";echo $start;
			foreach($destination as $city=>$distance){
				//var_dump($city);
				if(intval($distance) <= intval($radius) && $distance != false){
					//echo "------cities qualifying:";
					//echo $city;
					$citiesArr[$city] = $distance;
				}
			}	
		}
	}
}

//var_dump($citiesArr);

//$pharmacyJson = file_get_contents("myFile8.json");

	?><table border = "1">
	    <th> City   </th>
	    <th>Distance</th>
	    <th>  Name  </th>
	    <th>Phone Number</th>
	    <th>Adress</th>
	    <th>Postal Code</th>
	    <th>Manager First Name</th>
	    <th>Manager Last Name</th>
	    <th>Manager Grad Year</th>
	<?php	
		$pharmacyJson = json_decode(file_get_contents("test.json"));
		printPharmacy($pharmacyJson, $thisYear, $age, $citiesArr);

		$pharmacyJson = json_decode(file_get_contents("myFile7.json"));
		printPharmacy($pharmacyJson, $thisYear, $age, $citiesArr);

		$pharmacyJson = json_decode(file_get_contents("myFile8.json"));
		printPharmacy($pharmacyJson, $thisYear, $age, $citiesArr);

?>
    </table>
<?php

function printPharmacy(&$json, &$thisYear, &$age, &$citiesArr){
	foreach($json as $pharmacy){
	    if (intval($age) <= intval($thisYear) - intval($pharmacy -> mngrGradYr) && is_numeric($pharmacy -> mngrGradYr) && array_key_exists($pharmacy -> city, $citiesArr) && $pharmacy->name != "Shoppers Drug Mart" && $pharmacy->name != "Pharma Plus" && $pharmacy->name != "Rexall" && $pharmacy->name != "Wal-Mart Pharmacy" && $pharmacy->name != "Rexall Pharma Plus" && $pharmacy->name != "Loblaw Pharmacy" && $pharmacy->name != "Rexall" && $pharmacy->name != "Drug Basics" && $pharmacy->name != "Costco"){
		//$destCity = correctWhiteSpace($pharmacy -> city);
		//$count++; 
		//if($count < 2)
		//$destination = $destination . "|" . $destCity . "+ON"; 
		//echo "City:";
?>
			<tr>
			 <td><?php print($pharmacy -> city);?></td>
			 <td><?php print($citiesArr[$pharmacy->city]);?> Km</td>
			 <td><?php print($pharmacy -> name);?></td>
			 <td><?php print($pharmacy -> phoneNumber);?></td>
			 <td><?php print($pharmacy -> address);?></td>
			 <td><?php print($pharmacy -> postalCode);?></td>
			 <td><?php print($pharmacy -> mngrFirstName);?></td>
			 <td><?php print($pharmacy -> mngrLastName);?></td>
			 <td><?php print($pharmacy -> mngrGradYr);?></td>
			</tr> 
<?php

	   }
	}
}
?>
</body></html>