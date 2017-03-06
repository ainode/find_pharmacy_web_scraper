<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

	<html xmlns="http://www.w3.org/1999/xhtml">
				
<a href="<?php echo $_SERVER["PHP_SELF"];?>">Refresh</a>

<title>Welcome to Find pharmacy in Ontario</title>
<h1>Welcome to 'Find a pharmacy in Ontario' Application</h>
<script type="text/javascript" src="jsFuncs.js">
// <![CDATA[
//onload=equalize;
	    // ]]>

	</script>
</head>

<body>

		<form action="findPharmacyFinal.php" name="login" id="login" method="post" onsubmit="return validate_login();">
      
		<p></p>
		<table>
        
		   <tr>
          
			<td>City of choice:</td>
          
			<!--<td>
<input name="city" id="city" type="text" /></td>
-->  
			<td>
				<select name="city" id="city" type="text">
					<option value="Toronto">Toronto</option>
					<option value="Ottawa">Ottawa</option>
					<option value="Kingston">Kingston</option>
					<option value="London">London</option>
					<option value="Parry Sound">Parry Sound</option>
					<option value="Windsor">Windsor</option>

			</td>      
		   </tr>
        
		   <tr>
          
			<td>Radius:</td>
          
			<td><input name="radius" id="pass" type="text" /></td>
 
      
		   </tr>
        
		   <tr>
          
			<td>Number of years manager graduated:</td>
          
			<td><input name="age" id="age" type="text" /></td>
 
      
		   </tr>
        

		   <tr>
          
		 	<td></td>
          
			<td><input type="submit" value="Submit" /></td>
        
		   </tr>
      
		</table>      
    
	        </form>
  
</body>
</html>