var casper = require('casper').create({
	verbose: true
});
var mouse = require("mouse").create(casper);
var utils = require('utils');
var fs = require('fs');

pharmacies = [];
var pageNums = ["10","11","12"];
var gradYear = "";
var managerId = "";
var postalCode = "";
var designation = "";
var pharmacyName = "";
var managerFirstName = "";
var managerLastName = "";
var address = "";
var city = "";
var province = "";
var phoneNumber = "";
var recordInx = [];


casper.start('https://members.ocpinfo.com/search/Search.aspx', function() {
	this.echo(this.getTitle());	    
});

function processPage(){
	onStepComplete : casper.then(function() {  
		texts = this.fetchText('td[onClick *="ViewPharmacy"]');
    		var textArr = texts.split("                            ");
    		this.echo(textArr.length);
    		for(i = 0; i < textArr.length; i++){
			textArr[i] = textArr[i].trim();
			//if((textArr[i].search("Pharma Plus") == -1) || (textArr[i].search("Shoppers Drug Mart") == -1)){textArr[i] = ""};
        		if(textArr[i].length > 0){
	  			// var j = 0;
           			//while(!isNaN(textArr[i][j]) && j < 6){
				//j++;
	   			//}	
	   			//var pharmacyNo = textArr[i].substring(0, j);
	   			//pharmacyNo = pharmacyNo.trim();
           			this.echo(postalCode);		   
	   			//onStepComplete : casper.then(function(){           
	   				postalCode = textArr[i].substring((textArr[i].length - 13), textArr[i].length - 6);
					if(postalCode == "AP0K1G0"){
						postalCode = "P0K1G0";
					}
					if(postalCode == "0M 1S0 "){
						postalCode = "K0M 1S0 ";
					}
					if(postalCode == "aL5C1C6"){
						postalCode = "L5C1C6";
					}
					postalCode = postalCode.trim();
	   				this.echo(textArr[i]);
	   			//});	
	   			getPharmacyRec(postalCode);
	   			//echoMembers();
	   			onStepComplete : casper.then(function(){           
					this.echo(this.getTitle());
	   			});	
				var tempRec = getManagerRec();
				//onStepComlete : casper.then(function(){
	       			getManagerPage();
	       			getManagerInfo();
	       			makePharmRec();
	       			fillJson();	
				casper.then(function(){
    	       				casper.back();
				});
				casper.then(function(){
	       				if(managerId.length > 1){
	       					casper.back();	
	       				}
				});
      			}
    		}

	});
}

function getPharmacyRec(pharmNo){
    onStepComplete : casper.then(function() { 
this.echo("NUMBER: ");this.echo(pharmNo);
this.echo(this.getTitle());   
    this.clickLabel(pharmNo, 'td');
    });
}

function echoMembers(){
    casper.then(function(){
    	   this.echo(this.fetchText('td[onClick *="MemberSelected"]'));
	   });
}

function getManagerRec(){
    casper.then(function(){
        var staff = this.fetchText('td[onClick *="MemberSelected"]');

	pharmacyName = this.fetchText('span[id = lblCompanyName]');
	address = this.fetchText('span[id =lblAddress]');
	city = this.fetchText('span[id =lblCity]');
	postalCode = this.fetchText('span[id =lblPostalCode]');
	phoneNumber = this.fetchText('span[id =lblPhone]');

	this.echo(pharmacyName);
	recordInx[0] = staff.search("YesYes");
	if(recordInx[0] != -1){
	    this.echo("list of staff");this.echo(staff);
	    managerId = staff.substring(recordInx - 16, recordInx[0] - 10);
	    if(isNaN(managerId.charAt(0))){
		managerId = managerId.substring(1);
	    }
	    if(isNaN(managerId.charAt(0))){
		managerId = managerId.substring(1);
	    }
	    designation = "YesYes";
	    utils.dump(managerId);
	}
	else{
	    var lastDig;
	    var firstDig = staff.search(/[0-9]/);
	    for(i = firstDig; i < staff.length; i++){
		if(isNaN(staff.charAt(i))){
			break;
		}
		lastDig = i + 1;
	    }
	    managerId = staff.substring(firstDig, lastDig);
	    designation = "NONO";
	}	
    this.echo("recordInx : ");this.echo(recordInx[0]);

     });
}

function getManagerPage(){
    casper.then(function(){
this.echo("managerId: ");this.echo(managerId);
	if(managerId.length > 1){
    	    this.clickLabel(managerId, 'td');
	}
    });
}

function getManagerInfo(){
    casper.then(function(){
	if(managerId.length > 1){
	managerFirstName = this.fetchText('span[id = lblPreferredName]');
	managerLastName = this.fetchText('span[id = lblLastName]');
        var tableText = this.fetchText("#gvEducation");
    	var firstDig = tableText.search(/[0-9]/);
    	//this.echo(firstDig);
    	gradYear = tableText.substring(firstDig + 4, firstDig + 8);
    	this.echo(gradYear);
	}
    });
}		

function makePharmRec(){
   casper.then(function(){
	if(designation == "YesYes"){     	
		var pharmacy = {};
		pharmacy["name"] = pharmacyName;
		pharmacy["mngrFirstName"] = managerFirstName;
		pharmacy["mngrLastName"] = managerLastName;
		pharmacy["mngrGradYr"] = gradYear.valueOf();
		pharmacy["mngrId"] = managerId.valueOf();
		pharmacy["phoneNumber"] = phoneNumber;
		pharmacy["address"] = address;
		pharmacy["city"] = city;
		pharmacy["postalCode"] = postalCode;
		
		pharmacies.push(pharmacy);
	}
   });
}

function fillJson(){
    onStepComplete : casper.then(function(){
         var pharmacyStr = JSON.stringify(pharmacies);	
         fs.write('myFile8.json', pharmacyStr, 'w');
    });
}

casper.then(function() {    
	this.click("#rdoPharmacy");
});

casper.then(function(){
	processPage();
});

onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$11');
	});
});

casper.then(function(){
	processPage();
});

onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$21');
	});
});


casper.then(function(){
	processPage();
});

onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$31');
	});
});

casper.then(function(){
	processPage();
});
onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$41');
	});
});

casper.then(function(){
	processPage();
});


onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$51');
	});
});

casper.then(function(){
	processPage();
});
onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$61');
	});
});

casper.then(function(){
	processPage();
});

onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$71');
	});
});

casper.then(function(){
	processPage();
});

onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$81');
	});
});


casper.then(function(){
	processPage();
});

onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$91');
	});
});

casper.then(function(){
	processPage();
});

onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$101');
	});
});

casper.then(function(){
	processPage();
});


onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$111');
	});
});

casper.then(function(){
	processPage();
});

onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$121');
	});
});

casper.then(function(){
	processPage();
});

onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$131');
	});
});

casper.then(function(){
	processPage();
});

onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$141');
	});
});


casper.then(function(){
	processPage();
});

onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$151');
	});
});

casper.then(function(){
	processPage();
});

onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$161');
	});
});

casper.then(function(){
	processPage();
});

onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$171');
	});
});


casper.then(function(){
	processPage();
});

onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$181');
	});
});

casper.then(function(){
	processPage();
});
onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$1191');
	});
});

casper.then(function(){
	processPage();
});

onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$201');
	});
});


casper.then(function(){
	processPage();
});

onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$205');
	});
});

casper.then(function(){
	processPage();
});

onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$206');
	});
});

casper.then(function(){
	processPage();
});

onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$207');
	});
});

casper.then(function(){
	processPage();
});
onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$208');
	});
});

casper.then(function(){
	processPage();
});

onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$209');
	});
});


casper.then(function(){
	processPage();
});

onStepComplete : casper.then(function(){
	this.evaluate(function(){
    		__doPostBack('gvPharmacySearch','Page$210');
	});
});

casper.then(function(){
	processPage();
});

casper.run();