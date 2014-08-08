/**
* @author Michael Sime
* Copyright (c) 2007 Michael Sime; All rights reserved
*/

var qsParm = new Array();
var tempimg1;
var tempimg2;
var changedPic;

qsParm['cou1'] = "be";
qsParm['cou2'] = "be";
qs();

if (qsParm['cou1'] != "be" || qsParm['cou2'] != "be")
{
tempimg1=new Image();
tempimg2=new Image();
tempimg1.src=getImageURL(qsParm['cou1']);
tempimg2.src=getImageURL(qsParm['cou2']);

}

function qs()
{
var query = window.location.search.substring(1);
var parms = query.split('&');
for (var i=0; i<parms.length; i++)
{ var pos = parms[i].indexOf('=');
if (pos > 0)
{ var key = parms[i].substring(0,pos);
var val = parms[i].substring(pos+1);
qsParm[key] = val;
}
}
}


function setStyle(objId, style, value) {
document.getElementById(objId).style[style] = value;
}

var pic1;
var pic2;
var viewHeight;
var viewWidth;
var basicScreenRatio;
var allCountries = [];
var initialCountryList;

function getRatio(changed, unchanged)
{
ratio = Math.sqrt(changed.size / unchanged.size);
return (ratio);
}

function getViewPortHeight()
{
var viewportwidth;
var viewportheight;

// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight

if (typeof window.innerWidth != 'undefined')
{
viewportwidth = window.innerWidth;
viewportheight = window.innerHeight;
}

// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)

else if (typeof document.documentElement != 'undefined'
&& typeof document.documentElement.clientWidth !=
'undefined' && document.documentElement.clientWidth != 0)
{
viewportwidth = document.documentElement.clientWidth;
viewportheight = document.documentElement.clientHeight;
}

// older versions of IE

else
{
viewportwidth = document.getElementsByTagName('body')[0].clientWidth;
viewportheight = document.getElementsByTagName('body')[0].clientHeight;
}

viewHeight = viewportheight - 180;
viewWidth = viewportwidth;

}

function getScalingFactor(changed, unchanged)
{
//scaleFactor = Math.sqrt((unchanged.fullWidth*unchanged.fullHeight*16)/(changed.fullWidth*changed.fullHeight*31));
scaleFactor = Math.sqrt(unchanged.pixels/changed.pixels);
return (scaleFactor);
}

function picture(image, opposite, ratioText)
{
this.image = image;
this.fullWidth = image.width;
this.fullHeight = image.height;
this.ratioText = ratioText;
this.opposite = opposite;
this.size = getCountrySize("be");
this.pixels = 30903;
this.name = "Belgium";
this.pickList = null;
this.code = null;

}

function setColumn(colNo, style, val)
{
setStyle("map"+colNo, style, val);
setStyle("pickcontainer"+colNo, style, val);
}

function padColumn(colNo, maxWidth, maxHeight)
{
padding = (maxHeight/2)-((eval("pic"+colNo).image.height/2));
if (padding < 0) padding = 0;
setStyle("rowtop"+colNo, "height", padding);
setStyle("rowtop"+colNo, "width", maxWidth);

leftpad = (viewWidth/2)-maxWidth;
if (leftpad < 0)
{
leftpad = 0;
}
setStyle("lhs_pad", "width", leftpad);
setStyle("lhs_pad2", "width", leftpad);
//setStyle("lhs_pad3", "width", leftpad);
}

function resizeColumns()
{
maxHeight = Math.max(pic1.image.height, pic2.image.height);
maxWidth = Math.max(pic1.image.width, pic2.image.width);
setColumn(1,"width",maxWidth);
setColumn(2,"width",maxWidth);

setStyle("map1","height",maxHeight);
setStyle("map2","height",maxHeight);

// Vertically centre the maps (can't assume larger map has largest height)
padColumn("1", maxWidth, maxHeight);
padColumn("2", maxWidth, maxHeight);
}

function getFormattedName(name)
{
fname = name;
pos = name.indexOf(", The");
if (pos > 0)
fname = "The "+name.substring(0, pos);
return fname;
}

function loaded(what)
{

function resize(theImage, theRatio)
{
//  theRatio = 1;
theImage.width = theImage.width * theRatio;
theImage.height = theImage.height * theRatio;
return;
}

if (changedPic == null)
return;
//  while (!(tempimg1 == null && tempimg2 == null))
//  {

if (what.id == "image1")
{
if (null == pic1)
return;
else if (pic1.pickList == null || pic1.pickList.selectedIndex == 0)
//      if (tempimg1 != null)
//        loadPic=tempimg1;
//      else
loadPic=pic1;//      return;
else
loadPic = pic1;
}
else
{
if (tempimg2 == null && (null == pic2 || pic2.pickList == null || pic2.pickList.selectedIndex == 0))
return;
else
loadPic = pic2;
}

// If image is taller than viewport, then scale all images to fit
screenRatio = basicScreenRatio;

if (what.name=="image1" && tempimg1 != null)
{
img = tempimg1;
img.height = tempimg1.height;
img.width = tempimg1.width;
tempimg1 = null;
}
else if (what.name=="image2" && tempimg2 != null)
{
img = tempimg2;
img.height = tempimg2.height;
img.width = tempimg2.width;
tempimg2 = null;
}
// Update screen vars in case ratio has changed
if (img == null)
img = loadPic;
screenWidth = img.width;// * screenRatio;
screenHeight = img.height;// * screenRatio;

img.width = screenWidth; // WHAT IF OTHER IMAGE TOO LONG TOO ??
img.height = screenHeight;
loadPic.image.width = screenWidth;
loadPic.fullWidth = screenWidth;
loadPic.fullHeight = screenHeight;



try
{
ratio = (getRatio(changedPic, changedPic.opposite));
scalingFactor = getScalingFactor(changedPic, changedPic.opposite);
scaleRatio = ratio * scalingFactor;
//    changedPic.ratioText.value = ratio;
if (scaleRatio < 1)
{
resizedPic = changedPic;
}
else
{
resizedPic = changedPic.opposite;
scaleRatio = 1/scaleRatio;
ratio = 1/ratio;
}

actualRatio = resizedPic.opposite.size/resizedPic.size;
resizedPic.ratioText.value = Math.round(100/actualRatio)/100;
resizedPic.opposite.ratioText.value = Math.round((actualRatio*100))/100;

resizedPic.image.width = resizedPic.fullWidth*scaleRatio;
resizedPic.image.height = resizedPic.fullHeight*scaleRatio;
resizedPic.opposite.image.width = resizedPic.opposite.fullWidth;
resizedPic.opposite.image.height = resizedPic.opposite.fullHeight;

// If image is taller than viewport, then scale all images to fit
screenRatio = basicScreenRatio;
var newScreenRatio = screenRatio;
var newScreenRatio2 = screenRatio;
maxWidth = resizedPic.image.width > resizedPic.opposite.image.width ? resizedPic.image.width : resizedPic.opposite.image.width;
maxHeight = resizedPic.image.height > resizedPic.opposite.image.height ? resizedPic.image.height : resizedPic.opposite.image.height;

if (maxHeight*screenRatio > viewHeight)
newScreenRatio = (viewHeight/maxHeight);

/* *** SCALING FOR SCREEN SIZE - KETTLE OF BALL GAMES ***/
// If image is still wider than viewport, then scale to fit
if (maxWidth*newScreenRatio > (viewWidth/2))
newScreenRatio2 = ((viewWidth/2)/(maxWidth+50));


if (newScreenRatio < newScreenRatio2)
screenRatio = newScreenRatio;
else
screenRatio = newScreenRatio2;

resize(pic1.image, screenRatio);
resize(pic2.image, screenRatio);



resizeColumns();
}
catch(err)
{
alert("there's been an error");
throw(err);
}
if (tempimg1 == null && tempimg2 != null)
{
loaded(document.getElementById("image2"));
}

}

function load()
{
getViewPortHeight();
screenRatio = 1;
/*
if (viewWidth < 950)
screenRatio = 0.7;
else if (viewWidth < 500)
screenRatio = 0.3;
*/
basicScreenRatio = screenRatio;

getViewPortHeight();

pic1 = new picture(document.getElementById("image1"),null
,document.getElementById("ratio1"));
pic1.image.src = getImageURL(qsParm['cou1']);
pic1.image.alt = qsParm['cou1'];
pic1.code = qsParm['cou1'];


pic1.image.width = pic1.image.width * screenRatio;
pic1.fullWidth = pic1.image.width;
pic1.fullHeight = pic1.image.height;
pic1.pickList = document.getElementById("list1");
//pic1.name = pic1.pickList.options[pic1.pickList.selectedIndex].text;

pic2 = new picture(document.getElementById("image2"),pic1,document.getElementById("ratio2"));
pic2.image.src = getImageURL(qsParm['cou2']);
pic2.image.alt = qsParm['cou1'];
pic2.code = qsParm['cou2'];

pic2.image.width = pic2.image.width * screenRatio;
pic2.fullWidth = pic2.image.width;
pic2.fullHeight = pic2.image.height;
pic2.pickList = document.getElementById("list2");
//pic2.name = pic2.pickList.options[pic1.pickList.selectedIndex].text;

pic1.opposite = pic2;

loadData(initialCountryList);
loadPickList("r","A");

pic1.size = getCountrySize(qsParm['cou1'],"A");
pic1.pixels = getCountryPix(qsParm['cou1'],"A");
pic1.name = getCountryName(qsParm['cou1'],"A");
pic2.size = getCountrySize(qsParm['cou2'],"A");
pic2.pixels = getCountryPix(qsParm['cou2'],"A");
pic2.name = getCountryName(qsParm['cou2'],"A");


resizeColumns();

//img=new Image();
//img.src="https://www.cia.gov/library/publications/the-world-factbook/maps/be-map.gif";

if (tempimg1 != null || tempimg2 != null)
{
img = pic1.image;
pic1.image.width=tempimg1.width;
pic1.image.height=tempimg1.height;
img = pic2.image;
pic2.image.width=tempimg2.width;
pic2.image.height=tempimg2.height;
}

img=pic1.image;
changedPic=pic1;

//loaded(pic1.image);
//change(pic1.pickList);
img=pic2.image;
changedPic=pic2;

outputSentence();

if (typeof window.innerWidth == 'undefined')
loaded(document.getElementById("image1"));
}

function outputCIALink(countryCode)
{
  return("https://www.cia.gov/library/publications/the-world-factbook/geos/"+countryCode+".html");
}

function addChild(containerDiv, linkText, linkHref, delimiter)
{
  var link = document.createElement('a');
  link.setAttribute('href', linkHref);
  link.setAttribute('target', "/null");
  link.appendChild(document.createTextNode(linkText));
  containerDiv.appendChild(link);
  if (delimiter)
    containerDiv.appendChild(document.createTextNode(delimiter));
}

function outputSentence()
{
  // Create link to CIA for map 1
  ldiv = document.getElementById("map1para");
  if (document.getElementById("m1paradiv") != null)
    ldiv.removeChild(m1DIV);
  
  m1DIV = document.createElement("div");
  m1DIV.setAttribute("id","m1paradiv");

  addChild(m1DIV, "More info", outputCIALink(pic1.code));  
  
  // append your newly created DIV element to an already existing element.
  ldiv.appendChild(m1DIV);

  // Create link to CIA for map 2
  rdiv = document.getElementById("map2para");
  if (document.getElementById("m2paradiv") != null)
    rdiv.removeChild(m2DIV);
  
  m2DIV = document.createElement("div");
  m2DIV.setAttribute("id","m2paradiv");
  addChild(m2DIV, "More info", outputCIALink(pic2.code));
  
  // append your newly created DIV element to an already existing element.
  rdiv.appendChild(m2DIV);

  amdiv = document.getElementById("amaz");
  if (document.getElementById("amazdiv") != null)
    amdiv.removeChild(amaz1div);
    
  amaz1div = document.createElement("div");
  amaz1div.setAttribute("id","amazdiv");
  
  var newFrame = document.createElement("iframe")
  newFrame.setAttribute("src", "http://rcm-uk.amazon.co.uk/e/cm?t=countrysize-21&o=2&p=11&l=st1&mode=books&search="+pic1.name+"%20"+"travel&nou=1&fc1=000000&lt1=_blank&lc1=3366FF&bg1=FFFFFF&f=ifr");
  newFrame.setAttribute("marginwidth", "0"); 
  newFrame.setAttribute("marginheight", "0"); 
  newFrame.setAttribute("width", "120" );
  newFrame.setAttribute("height", "450" );
  newFrame.setAttribute("border", "0" );
  newFrame.setAttribute("frameborder", "0"); 
  newFrame.setAttribute("style", "border:none;"); 
  newFrame.setAttribute("scrolling", "no");
  
  amaz1div.appendChild(newFrame);
  amdiv.appendChild(amaz1div);
  
  paradiv = document.getElementById("paragraph");
  var name1 = getFormattedName(pic1.name);
  var name2 = getFormattedName(pic2.name);
  var size1 = Number(pic1.size);
  var size2 = Number(pic2.size);
  if (size1 > size2)
    sentence = name1 + " is "+ (((pic1.size/pic2.size)*100).toFixed(0)/100) + " times the size of " + name2;
  else if (size2 > size1)
    sentence = name2 + " is "+ (((pic2.size/pic1.size)*100).toFixed(0)/100) + " times the size of " + name1;
  else
    sentence = name1 + " is the same size as "+ name2;
  
 
  if (document.getElementById("myDiv") != null)
    paradiv.removeChild(eDIV);
  
  // create a DIV element, using the variable eDIV as a reference to it
  eDIV = document.createElement("div");
  //use the setAttribute method to assign it an id
  eDIV.setAttribute("id","myDiv");
  // add the text and link
  var breakcount = 4;
  if (typeof window.innerWidth == 'undefined')
    breakcount = 1;
  for (var i=0; i<breakcount ; i++)
    {eDIV.appendChild(document.createElement("br"));}
  eDIV.appendChild(document.createTextNode(sentence));
  eDIV.appendChild(document.createElement("br"));
  
  var theLink = "http://countrysize.com\?cou1="+pic1.code+"&cou2="+pic2.code;  
  addChild(eDIV, "Copy this link to share the comparison", theLink);

  eDIV.appendChild(document.createElement("br"));
  eDIV.appendChild(document.createElement("br"));
  
  sentence = "Countrysize: " + name1 + " vs " + name2;
  theLink = theLink.replace("&", "%26").replace("?","%3F");

  addChild(eDIV, "del.icio.us", "http://del.icio.us/post?url="+theLink+"&title="+sentence, " - ");
  addChild(eDIV, "Digg it", "http://digg.com/submit?phase=2&url="+theLink+"&title="+sentence, " - ");
  addChild(eDIV, "Google", "http://www.google.com/bookmarks/mark?op=edit&bkmk="+theLink+"&title="+sentence, " - ");
  addChild(eDIV, "StumbleUpon", "http://www.stumbleupon.com/submit?url="+theLink+"&title="+sentence, " - ");
  addChild(eDIV, "Yahoo MyWeb", "http://myweb2.search.yahoo.com/myresults/bookmarklet?t="+sentence+"&u="+theLink);
    
  //    eDIV.appendChild(document.createElement("/a"))
  
  // append your newly created DIV element to an already existing element.
  paradiv.appendChild(eDIV);
  
  pic1.image.alt=name1;
  pic2.image.alt=name2;
  


}

function change(which)
{
/*
changedList = which.getAttribute("id");
if (document.getElementById)
{
list1 = document.getElementById("list1");
list2 = document.getElementById("list2");
}
else
alert("can''t do that!");

*/

newURL = getImageURL(which.value);
newCountryName = which.options[which.selectedIndex].text;
firstLetter = newCountryName.substr(0,1);
newSize = getCountrySize(which.value, firstLetter);
newPix = getCountryPix(which.value, firstLetter);

if (which == pic1.pickList)
{
changedPic = pic1;

}

if (which == pic2.pickList)
{
changedPic = pic2;

}

//changedPic.image.src = newURL;
img=new Image();
img.src=newURL;
changedPic.size = newSize;
changedPic.pixels = newPix;
changedPic.image.src = newURL;
changedPic.name = newCountryName;
changedPic.code = which.value;

outputSentence()
}

function getImageURL(countryCode)
{
var imageSuffix = countryCode+"-map.gif";
var ciaURL="https://www.cia.gov/library/publications/the-world-factbook/maps/";

if (countryCode.indexOf("xx")==0)
{
ciaURL="http://countrysize.com/";
imageSuffix=countryCode+"-map.png";
/*    ciaURL="http://upload.wikimedia.org/wikipedia/commons/";
countryCode = countryCode.substr(4);
switch (countryCode)
{
case "en":
imageSuffix = "5/5a/British_isles_england.png"; break;
case "sct":
imageSuffix = "4/47/Scotland_Mainland_%28Location%29_Template_%28HR%29.png"; break;
case "wal":
imageSuffix = "2/2f/Map_of_Wales.GIF"; break;


}
*/
}

retval=ciaURL+imageSuffix;
return retval
}

function getCountrySize(code, letter)
{
switch (code)
{
case "be":
return 30528;
}
//  return allCountries[letter][code][1];
return allCountries["A"][code][1];
}

function getCountryPix(code, letter)
{
//  return allCountries[letter][code][2];
return allCountries["A"][code][2];
}

function getCountryName(code, letter)
{
return allCountries["A"][code][0];
}

function doSomethingWithTheData( theData ) {
//put your own code here that uses theData
for( var x = 0, outS = 'The data loaded was:'; theData[x]; x++ ) {
outS += '\n'+theData[x].join(',');
}
alert(outS);
}

function loadPickList(side, letter)
{
if (document.getElementById("LREFRESH").value == 'Y')
{
theList = pic1.pickList;
document.getElementById("LREFRESH").value = 'N';
}
else
theList = pic2.pickList;
//   if (document.getElementById(side.toUpperCase()+"REFRESH").value == 'Y')
//   {
//     theList = pic1.pickList;
//   }
//   else
//     theList = pic2.pickList;
//
//   document.getElementById(side.toUpperCase()+"REFRESH").value = 'N';

theList.options.length = 0;
var optionNo = 0;
theList.options[optionNo] = new Option("Select Country");

for( countryCode in allCountries[letter] ) {
optionNo ++;

countryName = allCountries[letter][countryCode][0];
// not needed:    countrySize = allCountries[letter][countryCode][1];

theList.options[optionNo] = new Option(countryName,
countryCode );
}


}

function loadData (theData)
{
if (pic1 == null)
{
initialCountryList = theData;
return;
}
theLetter = theData[0][1].substr(0,1);
allCountries[theLetter] = [];

//    pic1.pickList.options.length = 0; // empty the list
var optionNo = 0;
//    pic1.pickList.options[optionNo] = new Option("Select country","");

for( var x = 0, outS = 'The data loaded was:'; theData[x]; x++ ) {
optionNo ++;
countryName = theData[x][1];
countryCode = theData[x][0];
countrySize = theData[x][2];
countryPix = theData[x][3];

//	    pic1.pickList.options[optionNo] = new Option(countryName,
//      countryCode );
allCountries[theLetter][countryCode]=[countryName,countrySize,countryPix];

//alert(allCountries['k'][countryCode][1]);
}
//    alert(outS);

if (document.getElementById("LREFRESH").value == 'Y')
loadPickList('l', theLetter);
else if (document.getElementById("RREFRESH").value == 'Y')
loadPickList('r', theLetter);

}

function switchData(theURL)
{
window.frames['dataframe'].window.location.replace(theURL);
}

function loadMoreData(letter, side) {
document.getElementById(side.toUpperCase()+"REFRESH").value = 'Y';
//   if (!allCountries[letter])
//   {
//   	if( document.layers && document.layers['datadiv'].load )
//     {
//   		document.layers['datadiv'].load('countryareas'+letter+'.html',0);
//   	}
//     else if( window.frames && window.frames.length )
//     {
//   	loc = window.frames['dataframe'].window.location;
//         switch (letter)
//         {
//           case "A": loc.replace('countryareasa.html'); break;
//           case "B": loc.replace('countryareasb.html'); break;
//           case "C": loc.replace('countryareasc.html'); break;
//           case "D": loc.replace('countryareasd.html'); break;
//           case "E": loc.replace('countryarease.html'); break;
//           case "F": loc.replace('countryareasf.html'); break;
//           case "G": loc.replace('countryareasg.html'); break;
//           case "H": loc.replace('countryareash.html'); break;
//           case "I": loc.replace('countryareasi.html'); break;
//           case "J": loc.replace('countryareasj.html'); break;
//           case "K": loc.replace('countryareask.html'); break;
//           case "L": loc.replace('countryareasl.html'); break;
//           case "M": loc.replace('countryareasm.html'); break;
//           case "N": loc.replace('countryareasn.html'); break;
//           case "O": loc.replace('countryareaso.html'); break;
//           case "P": loc.replace('countryareasp.html'); break;
//           case "Q": loc.replace('countryareasq.html'); break;
//           case "R": loc.replace('countryareasr.html'); break;
//           case "S": loc.replace('countryareass.html'); break;
//           case "T": loc.replace('countryareast.html'); break;
//           case "U": loc.replace('countryareasu.html'); break;
//           case "V": loc.replace('countryareasv.html'); break;
//           case "W": loc.replace('countryareasw.html'); break;
//           case "X": loc.replace('countryareasx.html'); break;
//           case "Y": loc.replace('countryareasy.html'); break;
//           case "Z": loc.replace('countryareasz.html'); break;
//         }
//       }
//     else
//     {
//   		alert( 'Doesn\'t work' );
//   	}
//   }
//   else
//     loadPickList(side, letter);
}
